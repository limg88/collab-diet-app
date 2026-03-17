# UX Improvement Strategy

> Based on audit findings in 05-ux-audit.md
> Principle: high impact, minimal token/code cost, no redesigns

---

## Priority 1 — High Impact, Low Cost

### UX-01: Confirm before removing menu item (M6)
**What:** Add `AlertController` confirm dialog before `removeMealItem()` call.
**Why:** Destructive, irreversible action — one tap currently deletes. Aligned with shopping list pattern (already has confirm).
**Cost:** 5 lines in `menu.page.ts`.

### UX-02: Search/filter inside ingredient picker (M3)
**What:** Add `IonSearchbar` inside `IngredientPickerComponent` header. Filter `ingredients` array by name substring.
**Why:** Without search, adding meals to a large catalog is unusable on mobile.
**Cost:** 1 searchbar + 1 `filteredIngredients` getter.

### UX-03: +/- stepper in qty step (M4)
**What:** Add `–` and `+` `ion-button` flanking the `ion-input` in the qty step of `IngredientPickerComponent`. Each tap adjusts by the ingredient's `defaultQty` step.
**Why:** Fat-finger safe. Industry standard for food/quantity pickers.
**Cost:** 2 buttons + `adjustQty(delta)` method.

### UX-04: Password show/hide toggle (A2)
**What:** Add eye icon button in login and register pages toggling `type="password"` ↔ `type="text"`.
**Why:** Mobile users type passwords blind with keyboard autocorrect. Standard UX.
**Cost:** 1 boolean + 1 icon per page.

---

## Priority 2 — Medium Impact, Low Cost

### UX-05: Collapse empty meal sections on menu page (M1)
**What:** In menu page, show a "Nessun pasto pianificato" placeholder that collapses empty meal sections by default. Add a "Mostra tutti" toggle to expand.
**Why:** 6 empty cards per day is noisy. Most days only have 2–3 active meals.
**Cost:** 1 boolean + `*ngFor` filter + expand toggle.

### UX-06: Active filter chip with clear option (I1)
**What:** After selecting a category filter via action-sheet, show a dismissible chip in the ingredient list header ("Categoria: Cereali ×").
**Why:** Users need visible confirmation that filter is active and easy path to clear it.
**Cost:** 1 chip + `clearFilter()` method.

### UX-07: Named success toast after menu add (M5)
**What:** Change "Aggiunto!" toast to "Aggiunto: [nome ingrediente]".
**Why:** Confirms exactly what was added; reduces need to visually re-scan the list.
**Cost:** 1 string interpolation.

### UX-08: Progress bar label (S2)
**What:** Add text above `ion-progress-bar`: "Acquistati: N / M" in the progress card.
**Why:** Progress bar without label is ambiguous ("% of what?").
**Cost:** Already exists as `.progress-count` — just verify label is always visible.

### UX-09: Hide purchased items toggle (S7)
**What:** Add a "Nascondi acquistati" toggle button in shopping toolbar. When active, filter out `isPurchased === true` items.
**Why:** Common pattern in shopping apps; reduces noise after partial completion.
**Cost:** 1 boolean + filter in getter.

### UX-10: Remove collaborator UI (C1)
**What:** Add "Rimuovi collaboratore" button in `.collab-row` (active collaborators). Call `DELETE /collaboration/:id`.
**Why:** Currently impossible to end a collaboration from the UI — missing CRUD completeness.
**Cost:** 1 button + 1 API call + 1 confirm.

---

## Priority 3 — Polish

### UX-11: Fix dark mode hardcoded colors (G3)
**What:** Replace `#1a1a1a`, `#333`, `#f0f0f0`, `#666` with CSS custom properties (`--ion-text-color`, `--ion-border-color`, etc.).
**Why:** App claims dark mode support via `variables.scss` but inline hex values break it.
**Cost:** Find/replace in 3 page files.

### UX-12: Persistent error state with retry (G5)
**What:** If `ionViewWillEnter` refresh fails, show an inline banner with "Errore di rete — Riprova" button instead of only a dismissible toast.
**Why:** Toast disappears in 3s; user may miss it.
**Cost:** 1 error state boolean + 1 banner component.

### UX-13: Date in day title (M7)
**What:** Show "Lunedì 17 Mar" instead of just "Lunedì" in `.day-title`.
**Why:** Context: users need to confirm which week they're planning.
**Cost:** `dayDate` computed from `weekStart + dayIndex`.

---

## Implementation Order

| Phase | Items | Rationale |
|-------|-------|-----------|
| Immediate (next commit) | UX-01, UX-02, UX-03, UX-04 | Safety-critical + usability |
| Next iteration | UX-05, UX-06, UX-07, UX-08, UX-09, UX-10 | Feature completeness |
| Polish | UX-11, UX-12, UX-13 | Non-blocking |
