# UX Audit — CollabDiet MVP

> Analyst: UX/UI Designer agent
> Scope: Ionic/Angular frontend as implemented (all 5 tabs + shared components)
> Method: Static code review + functional flow analysis

---

## Summary

The app has a coherent visual identity (green/orange food palette, card-based layout, consistent iconography) and covers all functional requirements. The primary UX gaps are around **information density on mobile**, **destructive action feedback**, **empty-state guidance**, and **micro-interaction consistency**.

Severity scale: 🔴 High (blocks or confuses) · 🟡 Medium (friction) · 🟢 Low (polish)

---

## Issues Found

### Authentication

| # | Severity | Issue |
|---|----------|-------|
| A1 | 🟢 | Password rules appear AFTER typing; no pre-emptive hint that a strong password is required |
| A2 | 🟡 | No "show/hide password" toggle — users on mobile type blind |
| A3 | 🟡 | No distinction between "email already used" and "server error" in the error toast |

---

### Ingredients

| # | Severity | Issue |
|---|----------|-------|
| I1 | 🟡 | Category filter is an action-sheet — closes after single selection, no "clear filter" chip visible in list header |
| I2 | 🟢 | No sort option (alphabetical vs date added) — mild friction once catalog grows |
| I3 | 🟡 | Delete button is immediately visible with no swipe gesture — accidental taps on mobile |
| I4 | 🟢 | Meal-type restriction field is not surfaced in the list view — users forget they set it |
| I5 | 🟡 | No inline feedback when ingredient form is saved (modal dismisses silently) |

---

### Menu

| # | Severity | Issue |
|---|----------|-------|
| M1 | 🟡 | Empty meals are shown (6 sections all visible even when empty) — cognitive overload, hard to scan what's planned |
| M2 | 🟢 | No visual distinction between "today" meals and other days beyond a dot in the pill |
| M3 | 🟡 | Ingredient picker search is absent — scrolling through long ingredient lists is tedious |
| M4 | 🟡 | "Qty step" in picker: stepper +/- buttons are missing; only raw input. No +/- buttons = error-prone on mobile |
| M5 | 🟢 | Success toast after add is generic ("Aggiunto") — could name the ingredient |
| M6 | 🔴 | No undo for item removal — delete is immediate with no confirm |
| M7 | 🟢 | Day title area shows only the day name; date number (e.g. "17 Mar") absent |

---

### Shopping

| # | Severity | Issue |
|---|----------|-------|
| S1 | 🟡 | Stock input is always visible for all items — noisy when pantry is not being managed |
| S2 | 🟡 | Progress bar has no label explaining what it measures (e.g. "Acquistati") |
| S3 | 🟡 | Extra items and menu items share the same row layout — visually indistinguishable except section label |
| S4 | 🔴 | No confirmation before deleting extra item — alert exists but destructive action is one tap away from accidental trigger |
| S5 | 🟢 | "Importa scorta" button purpose unclear without tooltip or helper text |
| S6 | 🟡 | Search is in the toolbar — not discoverable; users expect searchbar inside content |
| S7 | 🟢 | Purchased items stay in the list — no option to hide them |

---

### Collaboration

| # | Severity | Issue |
|---|----------|-------|
| C1 | 🟡 | No ability to disconnect/remove a collaborator in the UI (route not implemented) |
| C2 | 🟡 | Invite state changes (accept/reject) require manual navigation — no notification or badge |
| C3 | 🟢 | "Inviti inviati" section not clearly separated from active collaborators |
| C4 | 🟢 | Collaborator menu modal dismisses on backdrop tap — could lose navigation state |

---

### Cross-Cutting / Global

| # | Severity | Issue |
|---|----------|-------|
| G1 | 🟡 | Loading skeleton shown only on initial load; subsequent ionViewWillEnter refreshes are silent — no feedback if refresh fails |
| G2 | 🟢 | Tab bar labels are short but some (e.g. "Spesa") might not be self-explanatory in isolation |
| G3 | 🟡 | Dark mode: CSS variables defined but some hardcoded hex values (`#1a1a1a`, `#333`, `#f0f0f0`) will not adapt |
| G4 | 🟢 | No page transition animations — Ionic defaults are present but not customized |
| G5 | 🟡 | Error states (network failures) show only a toast; no retry button or persistent error banner |

---

## High-Priority Issues (act first)

1. **M6** — No undo/confirm for menu item removal
2. **M3** — No search in ingredient picker
3. **M4** — No +/- stepper in qty step (picker)
4. **G3** — Hardcoded colors break dark mode
5. **A2** — Missing password show/hide toggle
