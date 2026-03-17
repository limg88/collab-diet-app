# Architecture Options

## Option A: Ionic + Angular + NestJS + Postgres (REQUIRED comparison)
- Android: Ionic Capacitor → APK
- Desktop: Electron wrapper around Ionic web app
- Shared: Angular code shared between both targets
- Backend: NestJS + TypeORM + PostgreSQL
- Pro: Single Angular codebase for both targets; mature ecosystem; PWA fallback
- Con: Electron is heavy; Capacitor Android = WebView (not native)

## Option B: NativeScript + Angular + NestJS + Postgres (REQUIRED comparison)
- Android: NativeScript → native Android controls
- Desktop: NOT SUPPORTED — NativeScript has no desktop story
- ELIMINATED: fails the desktop requirement

## Decision
**Option A selected**: Ionic + Angular + NestJS + Postgres + Docker Compose

Structure:
```
collab-diet-app/
├── backend/          # NestJS
├── frontend/         # Ionic Angular (shared web/Android/Desktop via Electron)
├── docker-compose.yml
└── ai-output/
```

Desktop target: Electron wrapping the Ionic Angular app (via @electron-forge or electron-builder).
Android target: Capacitor 6.
