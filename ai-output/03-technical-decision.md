# Technical Decision Record

## Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | NestJS + TypeORM | 10.x / 0.3.x |
| Database | PostgreSQL | 16 |
| Auth | JWT (passport-jwt) | — |
| Frontend | Ionic + Angular | 7.x / 17.x |
| Android | Capacitor | 6.x |
| Desktop | Electron | 30.x |
| Infra | Docker Compose | — |

## Monorepo Layout
```
backend/   → NestJS app
frontend/  → Ionic Angular app
docker-compose.yml → postgres + backend
```

## Auth Strategy
- POST /auth/register → email + password (bcrypt)
- POST /auth/login → JWT (access token, 24h)
- All other routes: Bearer JWT guard

## API Design
REST, versioned under /api/v1. DTOs validated with class-validator.

## Test Strategy
- backend: Jest unit tests on business rules (shopping list aggregation, menu copy, collaboration rules)
- frontend: Jasmine/Karma unit tests on state/services
- e2e: not in MVP scope

## Rationale
NestJS chosen over raw Express for decorators, modules, DI — maps cleanly to domain.
TypeORM chosen for migration support and PostgreSQL integration.
Ionic chosen over bare Angular because it provides mobile-ready UI components + Capacitor integration out of the box.
NativeScript eliminated — no desktop support.
