FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install && \
    cd frontend && npm install

# Copy application files
COPY . .

# Set working directory to frontend
WORKDIR /app/frontend

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 