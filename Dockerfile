# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Create scripts directory in build stage
RUN mkdir -p /app/scripts

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install

# Copy source code and scripts
COPY . .
COPY backend/scripts/* /app/scripts/

# Build frontend
RUN cd frontend && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Create necessary directories
RUN mkdir -p /app/scripts

# Copy built files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/frontend/build ./frontend/build
COPY --from=build /app/backend ./backend
COPY --from=build /app/scripts ./scripts

# Install production dependencies
RUN npm install --production

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "backend/server.js"] 