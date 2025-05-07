#!/bin/bash

# Function to check if database credentials are set
check_db_credentials() {
    if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
        echo "Database credentials not found in environment variables"
        return 1
    fi
    return 0
}

# Debug: Print all environment variables
echo "Current environment variables:"
env | grep -E "DB_|EC2_"

# Try to load credentials from different sources
echo "Loading database credentials..."

# First try loading from backend/.env
if [ -f "backend/.env" ]; then
    echo "Loading credentials from backend/.env"
    export $(grep -v '^#' backend/.env | xargs)
fi

# If still not set, try loading from root .env
if ! check_db_credentials && [ -f ".env" ]; then
    echo "Loading credentials from root .env"
    export $(grep -v '^#' .env | xargs)
fi

# Debug: Print EC2_IP after loading .env files
echo "EC2_IP after loading .env files: $EC2_IP"

# Final check for credentials
if ! check_db_credentials; then
    echo "Error: Database credentials not found. Please ensure they are set in one of:"
    echo "1. backend/.env file"
    echo "2. root .env file"
    echo ""
    echo "Required environment variables:"
    echo "DB_HOST=your_db_host"
    echo "DB_PORT=your_db_port"
    echo "DB_NAME=your_db_name"
    echo "DB_USER=your_db_user"
    echo "DB_PASSWORD=your_db_password"
    exit 1
fi

# Check for SSH key
if [ ! -f "propertylisting.pem" ]; then
    echo "Error: SSH key file 'propertylisting.pem' not found in current directory"
    exit 1
fi

# Set proper permissions for SSH key
chmod 400 propertylisting.pem

# Verify scripts exist
if [ ! -f "backend/scripts/db-setup.js" ]; then
    echo "Error: Required script file not found in backend/scripts directory"
    exit 1
fi

# Build the application
echo "Building the application..."
cd frontend
npm install
npm run build
cd ..

# Build Docker image
echo "Building Docker image..."
docker build --no-cache -t property-listing:latest .

# Verify Docker image was built
if ! docker image inspect property-listing:latest &> /dev/null; then
    echo "Error: Failed to build Docker image"
    exit 1
fi

# Save the Docker image as a tar file
echo "Saving Docker image..."
docker save property-listing:latest > property-listing.tar

# Calculate checksum of the tar file
echo "Calculating checksum..."
TAR_CHECKSUM=$(sha256sum property-listing.tar | awk '{print $1}')
echo "Local tar file checksum: $TAR_CHECKSUM"

# Function to retry SCP transfer
retry_scp() {
    local max_attempts=3
    local attempt=1
    local success=0

    # Debug: Print the exact SCP command that will be used
    echo "Attempting SCP with command: scp -i propertylisting.pem property-listing.tar ubuntu@${EC2_IP}:/home/ubuntu/property-listing/"

    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt of $max_attempts to transfer Docker image..."
        scp -i propertylisting.pem property-listing.tar "ubuntu@${EC2_IP}:/home/ubuntu/property-listing/"
        
        if [ $? -eq 0 ]; then
            success=1
            break
        fi
        
        echo "Transfer failed, retrying in 10 seconds..."
        sleep 10
        attempt=$((attempt + 1))
    done

    if [ $success -eq 0 ]; then
        echo "Error: Failed to transfer Docker image after $max_attempts attempts"
        exit 1
    fi
}

# Copy the Docker image to EC2 with retry logic
echo "Copying Docker image to EC2..."
retry_scp

# Verify the transfer on EC2
echo "Verifying transfer on EC2..."
ssh -i propertylisting.pem "ubuntu@${EC2_IP}" << EOF
cd /home/ubuntu/property-listing

# Calculate remote checksum
REMOTE_CHECKSUM=\$(sha256sum property-listing.tar | awk '{print \$1}')
echo "Remote tar file checksum: \$REMOTE_CHECKSUM"

# Compare checksums
if [ "\$REMOTE_CHECKSUM" != "$TAR_CHECKSUM" ]; then
    echo "Error: Checksum mismatch between local and remote files"
    echo "Local checksum: $TAR_CHECKSUM"
    echo "Remote checksum: \$REMOTE_CHECKSUM"
    exit 1
fi

# Load the Docker image
echo "Loading Docker image..."
docker load < property-listing.tar

# Verify image was loaded
if ! docker image inspect property-listing:latest &> /dev/null; then
    echo "Error: Failed to load Docker image"
    exit 1
fi

# Start containers with proper environment
echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for containers to start
echo "Waiting for containers to start..."
sleep 10

# Check container status
echo "Checking container status..."
docker-compose -f docker-compose.prod.yml ps

# Get logs from db-setup container
echo "Checking database setup logs..."
docker-compose -f docker-compose.prod.yml logs db-setup

# Wait for database setup to complete
echo "Waiting for database setup to complete..."
sleep 30

# Check if setup was successful
if docker-compose -f docker-compose.prod.yml ps | grep -q "db-setup.*Exit 0"; then
    echo "Database setup completed successfully"
else
    echo "Error: Database setup failed"
    echo "Checking database setup logs for errors:"
    docker-compose -f docker-compose.prod.yml logs db-setup
    exit 1
fi
EOF

echo "Deployment completed successfully!" 