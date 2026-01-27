# Build stage for Java backend
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Build stage for Next.js frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY ui/package*.json ./
RUN npm ci
COPY ui/ ./
RUN npm run build

# Production stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Install Node.js and curl for running Next.js and health checks
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy backend JAR
COPY --from=backend-build /app/target/p2p-1.0-SNAPSHOT.jar ./backend.jar

# Copy frontend build and source files needed for production
COPY --from=frontend-build /app/.next ./frontend/.next
COPY --from=frontend-build /app/node_modules ./frontend/node_modules
COPY --from=frontend-build /app/package*.json ./frontend/
COPY --from=frontend-build /app/next.config.js ./frontend/

# Expose ports
EXPOSE 8080 3000

# Create startup script that ensures backend starts first
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start backend' >> /app/start.sh && \
    echo 'echo "Starting backend server..."' >> /app/start.sh && \
    echo 'java -jar /app/backend.jar > /tmp/backend.log 2>&1 &' >> /app/start.sh && \
    echo 'BACKEND_PID=$!' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Wait for backend to be ready' >> /app/start.sh && \
    echo 'echo "Waiting for backend to start..."' >> /app/start.sh && \
    echo 'for i in {1..30}; do' >> /app/start.sh && \
    echo '  if curl -s http://127.0.0.1:8080/ > /dev/null 2>&1; then' >> /app/start.sh && \
    echo '    echo "Backend is ready!"' >> /app/start.sh && \
    echo '    break' >> /app/start.sh && \
    echo '  fi' >> /app/start.sh && \
    echo '  echo "Waiting for backend... ($i/30)"' >> /app/start.sh && \
    echo '  sleep 1' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start frontend' >> /app/start.sh && \
    echo 'echo "Starting frontend server..."' >> /app/start.sh && \
    echo 'cd /app/frontend' >> /app/start.sh && \
    echo 'exec npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
