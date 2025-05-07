FROM node:18-alpine

WORKDIR /app

# Install PostgreSQL client for database setup
RUN apk add --no-cache postgresql-client

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install && \
    cd backend && npm install

# Copy application files
COPY . .

# Set working directory to backend
WORKDIR /app/backend

# Create wait-for-postgres script
RUN echo '#!/bin/sh\n\
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do\n\
  echo "Waiting for PostgreSQL..."\n\
  sleep 1\n\
done\n\
echo "PostgreSQL is ready!"\n\
' > /app/wait-for-postgres.sh && chmod +x /app/wait-for-postgres.sh

EXPOSE 5000

CMD ["sh", "-c", "/app/wait-for-postgres.sh && npm start"] 