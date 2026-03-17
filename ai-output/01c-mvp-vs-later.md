# MVP vs Later

> Decision boundary: implemented in first milestone vs deferred.

---

## In MVP (Implemented)

| Area | Feature | Notes |
|------|---------|-------|
| Auth | Register, Login, JWT | Password rules enforced front + back |
| Auth | Logout | Token cleared client-side |
| Ingredients | Full CRUD | Logical delete, category, meal-type restrictions |
| Ingredients | Filter by category (action-sheet) | Single-select category filter |
| Menu | Weekly view (7 days, current week) | Europe/Roma Monday anchor |
| Menu | Auto-copy from previous week | RB-MENU-03 |
| Menu | Add/remove meal items | Two-step picker (select → confirm qty) |
| Menu | Qty cap at 99999 | Frontend + backend validation |
| Menu | Meal type restriction enforcement | RB-MENU-06, enforced in picker |
| Menu | Collaborator menu (read-only modal) | "Vedi menù" in collaboration tab |
| Menu | Current-week-only edit guard | RB-MENU-04 |
| Shopping | Auto-generated from menu | Sync on load + ionViewWillEnter |
| Shopping | Aggregation by name+unit | Across meals + collaborators |
| Shopping | Pantry stock deduction | qty_to_buy = max(0, total – stock) |
| Shopping | Mark as purchased + progress bar | Visual strikethrough + counter |
| Shopping | Extra items (FUORI_MENU) | Create, edit, delete |
| Shopping | Collaborator indicator | 👥 icon + breakdown |
| Shopping | Import collaborator stock | Copy collaborator's stockQty |
| Shopping | Search / filter | Searchbar in header |
| Shopping | "In dispensa" badge | Shown when qty_to_buy = 0 |
| Collaboration | Invite by email | Pending/accepted/rejected/revoked states |
| Collaboration | Accept / reject / revoke | All state transitions |
| Collaboration | Active collaborator list | With "Vedi menù" button |
| Cross-cutting | ionViewWillEnter refresh | All 4 tabs silently reload on re-entry |
| Cross-cutting | Password strength hints | 4 live rule indicators on register |

---

## Deferred (Not Implemented — Post-MVP)

| Area | Feature | Rationale |
|------|---------|-----------|
| Auth | Password reset / "forgot password" | Requires email delivery service (SMTP/SES); not in MVP scope |
| Auth | Email verification | Same dependency |
| Ingredients | Sort by name/date | Nice-to-have; list is filterable |
| Ingredients | Bulk import (CSV) | Not in spec v1.0 |
| Menu | Past week read (archive viewer) | RB-MENU-04 says past weeks read-only; UI not implemented |
| Menu | Edit qty inline on menu page | Currently only editable via re-add; deferred |
| Shopping | Reorder items manually | Drag-and-drop; not in spec |
| Shopping | Export list (PDF/share) | Not in spec |
| Shopping | Price tracking | Not in spec |
| Shopping | Recurring extras | Not in spec |
| Collaboration | Disconnect collaborator | UI button absent; API route needed |
| Collaboration | Multiple collaborators (>1) | Backend supports it (RB-COL-08); UI shows list but not tested beyond 1 |
| Platform | Android Capacitor build | Scaffold in place; needs signing config |
| Platform | Electron desktop build | Scaffold in place; not verified on CI |
| Platform | iOS build | No signing config; out of scope |
| UX | Onboarding flow | First-run guidance; not designed |
| UX | Dark mode full review | Variables defined; some components may need manual override |
| UX | Accessibility (WCAG 2.1 AA) | Not audited; deferred |
| UX | i18n / localization | All strings in Italian; no abstraction layer |
