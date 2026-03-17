# E2E Tests — CollabDiet (Playwright)

End-to-end tests for the CollabDiet frontend.

## Prerequisites

1. Backend running: `docker compose up` from project root
2. Frontend running: `cd frontend && npm start`

## Setup

```bash
cd e2e
npm install
npx playwright install chromium
```

## Run tests

```bash
# All tests (headless)
npm test

# With browser visible
npm run test:headed

# Interactive UI mode
npm run test:ui

# View last report
npm run test:report
```

## Test coverage

| Suite | Tests |
|-------|-------|
| 01-auth | Redirect, register, login, wrong credentials, logout |
| 02-ingredients | Load, create, search, edit, delete |
| 03-menu | Load, add item, remove item, day navigation, no-ingredients warning |
| 04-shopping | Empty state, auto-generate from menu, progress bar, toggle purchased, add/delete extra |
| 05-collaboration | Load, send invite, invalid email, accept invite, reject invite |
