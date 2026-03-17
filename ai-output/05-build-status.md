# Build Status

## Backend
- `npm run build` → clean (NestJS nest build, 0 errors)
- `npm test` → 29/29 tests pass (3 suites: shopping aggregation, menu copy, collaboration rules)

## Frontend
- `npm run build` → clean (Angular 17 + Ionic 7, all lazy chunks generated)
  - CSS RTL pseudo-class warnings: benign Ionic behavior, not errors
  - Bundle budget advisory: 901KB initial (advisory only, build succeeds)

## Docker Compose
- docker-compose.yml: postgres:16 + backend (node:20-alpine multi-stage)
- `docker compose up --build` should start both services

## Android
- `npm run cap:android` from frontend/ → requires Android Studio + SDK installed
- Capacitor 6 configured, webDir=www

## Desktop
- `npm run electron` from frontend/ → builds Angular then launches Electron 30

## How to run
```bash
# Backend + DB (Docker)
cd collab-diet-app
docker compose up --build

# Frontend dev
cd frontend && npm install && npm start
# → http://localhost:4200
```
