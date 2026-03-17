# Test Status

## Backend Tests (Jest)
Location: backend/test/

| Suite | Tests | Status |
|-------|-------|--------|
| shopping.service.spec.ts | 11 | PASS |
| menu.service.spec.ts | 9 | PASS |
| collaboration.service.spec.ts | 9 | PASS |
| **Total** | **29** | **ALL PASS** |

### Coverage areas
- Shopping aggregation: same ingredient from 2 meals → quantities summed, breakdown built
- Shopping: qty_to_buy = max(0, total - stock)
- Menu: auto-create current week copying previous week items
- Menu: meal type restriction enforcement (RB-MENU-06)
- Collaboration: cannot invite self (RB-COL-02)
- Collaboration: no duplicate pending invite (RB-COL-03)
- Collaboration: only receiver can accept/reject (RB-COL-05)
- Collaboration: only sender can revoke (RB-COL-05)

## Frontend Tests
- Karma/Jasmine configured but not yet run (requires Chrome)
- Service logic covered by backend tests
