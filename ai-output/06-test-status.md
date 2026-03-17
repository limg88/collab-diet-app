# Test Status

## Backend Tests (Jest)
Location: backend/test/

| Suite | Tests | Status |
|-------|-------|--------|
| shopping.service.spec.ts | 11 | PASS |
| menu.service.spec.ts | 9 | PASS |
| collaboration.service.spec.ts | 9 | PASS |
| dto-validation.spec.ts | 11 | PASS |
| **Total** | **40** | **ALL PASS** |

### Coverage areas
- Shopping aggregation: same ingredient from 2 meals → quantities summed, breakdown built
- Shopping: qty_to_buy = max(0, total - stock)
- Menu: auto-create current week copying previous week items
- Menu: meal type restriction enforcement (RB-MENU-06)
- Collaboration: cannot invite self (RB-COL-02)
- Collaboration: no duplicate pending invite (RB-COL-03)
- Collaboration: only receiver can accept/reject (RB-COL-05)
- Collaboration: only sender can revoke (RB-COL-05)
- DTO validation: @Max(99999) overflow guard (AddMealItem, UpdateMealItem, CreateIngredient)
- DTO validation: @Min(0.01) minimum quantity guard (RB-ING-03)
- DTO validation: UpdateItemDto name/unit/category optional fields

## E2E Tests (Playwright)
Location: e2e/tests/

| File | Tests | Area |
|------|-------|------|
| 01-auth.spec.ts | ~6 | Registration, login, validation |
| 02-ingredients.spec.ts | ~7 | CRUD, categories, filters |
| 03-menu.spec.ts | ~10 | Weekly menu, picker, day nav |
| 04-shopping.spec.ts | ~8 | Shopping list, extras, collab |
| 05-collaboration.spec.ts | ~8 | Invites, accept/reject, view menu |
| 06-cross-tab-refresh.spec.ts | 4 | ionViewWillEnter silent refresh |
| 07-gap-analysis.spec.ts | 10 | Gap analysis: RB-ING-03, 3.4.1, 3.4.6, RB-SHOP-04, RB-MENU-04, RB-MENU-08 |

## Frontend Tests
- Karma/Jasmine configured but not yet run (requires Chrome)
- Service logic covered by backend tests and e2e
