# Local Development Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- AWS CLI configured with appropriate credentials
- Git

## Step 1: Clone the Repository
```bash
git clone <repository-url>
cd UtrainsPropertylisting
```

## Step 2: Set Up Environment Variables
1. Create a `.env` file in the `backend` directory:
```bash
cd backend
touch .env
```

2. Add the following environment variables to `backend/.env`:
```
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
PORT=5000
NODE_ENV=development
```

## Step 3: Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

## Step 4: Start Local DynamoDB
```bash
# Start DynamoDB local container
docker-compose up -d dynamodb-local
```

## Step 5: Initialize Database
```bash
# Run database setup script
cd backend
node scripts/dynamo-setup.js
node scripts/seed-data.js
cd ..
```

## Step 6: Start the Application
You can run the application in two ways:

### Option 1: Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up
```

### Option 2: Running Services Separately
1. Start the backend server:
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm start
```

## Accessing the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development Workflow
1. Make changes to the code
2. For frontend changes, the development server will automatically reload
3. For backend changes, you'll need to restart the backend server

## Testing
```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## Troubleshooting
1. If you encounter port conflicts:
   - Check if any other services are using ports 3000 or 5000
   - Modify the ports in the respective configuration files

2. If DynamoDB setup fails:
   - Ensure Docker is running
   - Check if the DynamoDB container is up: `docker ps`
   - Try restarting the container: `docker-compose restart dynamodb-local`

3. If you see AWS credential errors:
   - Verify your AWS credentials in the `.env` file
   - Ensure you have the correct permissions in your AWS account

## Stopping the Application
```bash
# If using Docker Compose
docker-compose down

# If running services separately
# Press Ctrl+C in each terminal window
``` 