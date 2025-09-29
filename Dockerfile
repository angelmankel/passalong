# Use Node.js Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install --production
RUN cd frontend && npm install

# Copy source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY items/ ./items/

# Build frontend
RUN cd frontend && npm run build

# Copy built frontend to backend public directory
RUN mkdir -p backend/public && cp -r frontend/build/* backend/public/

# Expose port
EXPOSE 5000

# Start the backend server (which will also serve the frontend)
CMD ["cd", "backend", "&&", "npm", "start"]
