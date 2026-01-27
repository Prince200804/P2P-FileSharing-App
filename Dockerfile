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

# Install Node.js for running Next.js
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

# Set environment variable for backend URL
ENV BACKEND_URL=http://127.0.0.1:8080/api/:path*

# Create startup script
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'java -jar /app/backend.jar &' >> /app/start.sh && \
    echo 'BACKEND_PID=$!' >> /app/start.sh && \
    echo 'echo "Backend started with PID $BACKEND_PID"' >> /app/start.sh && \
    echo 'sleep 10' >> /app/start.sh && \
    echo 'cd /app/frontend && exec npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
