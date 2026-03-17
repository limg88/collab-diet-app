# CollabDiet — Collaborative Meal Planning App

A collaborative meal planning application with weekly menu management, ingredient tracking, shopping list generation, and multi-user collaboration.

## Stack

- **Backend**: NestJS + TypeScript + Prisma ORM + PostgreSQL
- **Frontend**: Ionic Angular 17 (standalone components) + Capacitor
- **Desktop**: Electron
- **Android**: Capacitor + Android SDK
- **Database**: PostgreSQL 16
- **Containerization**: Docker Compose

## Architecture

```
collab-diet-app/
├── backend/          NestJS API (port 3000)
├── frontend/         Ionic Angular app (port 4200)
└── docker-compose.yml
```

---

## Running the Backend (Docker)

The recommended way to run backend + database together:

```bash
# From project root
docker compose up --build
```

This starts:
- PostgreSQL on port 5432
- NestJS backend on port 3000

API available at: `http://localhost:3000/api/v1`

### Backend only (local dev, requires PostgreSQL running)

```bash
cd backend
cp .env.example .env   # set DATABASE_URL, JWT_SECRET
npm install
npm run start:dev
```

---

## Running the Frontend (Web)

```bash
cd frontend
npm install
npm start
```

Frontend available at: `http://localhost:4200`

The frontend connects to the backend at `http://localhost:3000/api/v1` by default.

---

## Building for Android (APK)

Requirements: Android Studio, Java 17+, Android SDK

```bash
cd frontend
npm install
npm run cap:android
```

This will:
1. Build the Angular app (`ng build`)
2. Sync with Capacitor (`npx cap sync android`)
3. Open Android Studio (`npx cap open android`)

Then in Android Studio: Build > Generate Signed Bundle/APK

**Note**: The Android build uses `http://10.0.2.2:3000/api/v1` as the API URL (Android emulator host).
To change the API URL for a physical device, update `src/environments/environment.android.ts`.

---

## Running the Desktop App (Electron)

```bash
cd frontend
npm install
npm run electron
```

This builds the Angular app with `baseHref="./"` and launches it in an Electron window.

---

## Running Tests

### Backend tests

```bash
cd backend
npm test           # unit tests
npm run test:e2e   # end-to-end tests
```

### Frontend tests

```bash
cd frontend
npm test           # Karma/Jasmine with ChromeHeadless
```

---

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://diet_user:diet_pass@localhost:5432/diet_db` |
| `JWT_SECRET` | JWT signing secret | required |
| `PORT` | HTTP port | `3000` |
| `NODE_ENV` | Environment | `development` |

### Frontend

Edit `src/environments/environment.ts` (dev) or `environment.prod.ts` (prod):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1'
};
```

---

## API Endpoints Summary

| Resource | Endpoint |
|----------|----------|
| Auth | `POST /api/v1/auth/register`, `POST /api/v1/auth/login` |
| Ingredients | `GET/POST /api/v1/ingredients`, `PATCH/DELETE /api/v1/ingredients/:id` |
| Menu | `GET /api/v1/menu/current`, `POST /api/v1/menu/items`, `PATCH/DELETE /api/v1/menu/items/:id` |
| Shopping | `GET /api/v1/shopping`, `POST /api/v1/shopping/extras`, `PATCH/DELETE /api/v1/shopping/:id` |
| Collaboration | `POST /api/v1/collaboration/invite`, `GET /api/v1/collaboration/invites`, `PATCH /api/v1/collaboration/invites/:id/accept` |

---

## First Run Checklist

1. `docker compose up --build` — starts DB + backend
2. `cd frontend && npm install && npm start` — starts frontend
3. Open `http://localhost:4200` — register a user
4. Add ingredients, plan a weekly menu, view the shopping list
5. Invite a collaborator by email
