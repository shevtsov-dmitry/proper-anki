# =========================
# 1. Build frontend
# =========================
FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package*.json ./

RUN apk add --no-cache python3 make g++ \
  && npm ci

COPY frontend/ .

RUN npm run build


# =========================
# 2. Build backend native image
# =========================
FROM ghcr.io/graalvm/native-image-community:25 AS backend-builder

WORKDIR /app

# Maven wrapper
COPY backend/mvnw .
COPY backend/.mvn ./.mvn
COPY backend/pom.xml .

RUN chmod +x mvnw

# Backend source
COPY backend/ .

# Compile native executable
RUN ./mvnw -Pnative native:compile


# =========================
# 3. Runtime
# =========================
FROM debian:12-slim AS runtime

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  libstdc++6 \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Native backend executable
COPY --from=backend-builder /app/target/backend /app/backend

# Frontend
COPY --from=frontend-builder /app/dist /app/frontend

EXPOSE 8080

ENTRYPOINT ["/app/backend"]
