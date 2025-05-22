#!/bin/sh
# NOTE: This script is not used in production anymore. Migrations are skipped in production for now.

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Start the application
echo "Starting the application..."
npm start 