# MVP Plan

## Deliverables Implemented

| Feature | Backend | Frontend |
|---------|---------|---------|
| Auth (register/login/JWT) | ✅ | ✅ |
| Ingredient CRUD (logical delete) | ✅ | ✅ |
| Weekly menu (auto-copy previous week) | ✅ | ✅ |
| Shopping list (auto-sync, aggregation) | ✅ | ✅ |
| Shopping extra items (FUORI_MENU) | ✅ | ✅ |
| Pantry stock deduction | ✅ | ✅ |
| Collaboration invites | ✅ | ✅ |
| Collaborator menu read-only view | ✅ | ✅ |
| Android via Capacitor | ✅ scaffold | — |
| Desktop via Electron | ✅ scaffold | — |
| Docker Compose (postgres + backend) | ✅ | — |

## Module structure
```
backend/  → NestJS (auth, users, ingredients, menu, shopping, collaboration)
frontend/ → Ionic Angular 17 (standalone components, lazy-loaded pages)
docker-compose.yml → postgres:16 + backend (node:20-alpine)
```
