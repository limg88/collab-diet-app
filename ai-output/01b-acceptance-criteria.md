# Acceptance Criteria

> Scope: all features in ANALISI_FUNZIONALE.md v1.0
> Format: Given / When / Then (abbreviated as table where sufficient)

---

## 3.1 Authentication

| ID | Scenario | Acceptance Criteria |
|----|----------|---------------------|
| AC-AUTH-01 | Register valid | Given unused email + valid password → account created, JWT returned, redirect to /menu |
| AC-AUTH-02 | Register duplicate email | Given existing email → 409 or inline error, no new account |
| AC-AUTH-03 | Register invalid password | Given pw < 8 chars OR missing uppercase/number/special → validation error displayed before submit |
| AC-AUTH-04 | Login valid | Given registered email + correct password → JWT returned, redirect to /menu |
| AC-AUTH-05 | Login wrong password | Given correct email + wrong password → 401 error message |
| AC-AUTH-06 | Protected route unauthenticated | Given no token → redirect to /login |
| AC-AUTH-07 | Logout | Given authenticated → token cleared, redirect to /login |

---

## 3.2 Ingredient Management

| ID | Scenario | Acceptance Criteria |
|----|----------|---------------------|
| AC-ING-01 | Create ingredient | name + unit + qty(>0) → saved, visible in catalog |
| AC-ING-02 | Create with zero qty | qty = 0 → 400 error, not saved |
| AC-ING-03 | Create with restricted meal types | optional meal types saved → ingredient only appears in picker for those meal types |
| AC-ING-04 | Edit ingredient | changed fields persist on reload |
| AC-ING-05 | Delete ingredient (no menu refs) | removed from catalog, status = deleted |
| AC-ING-06 | Delete ingredient with active menu refs | logical delete; existing menu items remain valid |
| AC-ING-07 | Deleted ingredient absent from picker | does not appear in picker for new additions |
| AC-ING-08 | Filter by category | only matching category items shown |
| AC-ING-09 | Catalog is private | user B cannot see user A's ingredients |

---

## 3.3 Weekly Menu

| ID | Scenario | Acceptance Criteria |
|----|----------|---------------------|
| AC-MENU-01 | Load current week | 7 day pills visible; days span Mon–Sun of current week (Europe/Roma) |
| AC-MENU-02 | Auto-create from previous | When no current week menu exists and previous week has items → current week pre-populated |
| AC-MENU-03 | Auto-create empty | When no previous week → empty week loaded |
| AC-MENU-04 | Add ingredient to meal | picker opens, qty pre-filled with ingredient.defaultQty, item appears after confirm |
| AC-MENU-05 | Qty modified in picker | user enters custom qty → saved correctly |
| AC-MENU-06 | Qty overflow rejected | qty > 99999 → capped to 99999, not rejected (UI) / 400 on API |
| AC-MENU-07 | Meal type restriction enforced | ingredient with allowed=[BREAKFAST] only appears in BREAKFAST picker, not in LUNCH picker |
| AC-MENU-08 | Remove item | item deleted, no longer visible |
| AC-MENU-09 | Navigate days | clicking a day pill shows correct day name and items |
| AC-MENU-10 | Read-only collaborator menu | "Vedi menù" opens modal with 7-day pills; no add/remove buttons |
| AC-MENU-11 | Past week read-only (API) | PATCH/DELETE on past week item → 400 |

---

## 3.4 Shopping List

| ID | Scenario | Acceptance Criteria |
|----|----------|---------------------|
| AC-SHOP-01 | Auto-generate from menu | items from menu appear automatically; section "Dal Menù" visible |
| AC-SHOP-02 | Aggregation | same name+unit from multiple meals summed into one row |
| AC-SHOP-03 | Collaborator aggregation | active collaborator's menu items included; indicator visible |
| AC-SHOP-04 | Breakdown visible | collaborator breakdown shows per-user quantity |
| AC-SHOP-05 | Stock update | entering stockQty recalculates qty-to-buy = max(0, total – stock) |
| AC-SHOP-06 | Covered badge | when qty-to-buy = 0 → "✓ In dispensa" badge shown |
| AC-SHOP-07 | Mark purchased | checkbox toggled → item styled as purchased; progress count increments |
| AC-SHOP-08 | Progress bar | progress bar shows purchased/total ratio |
| AC-SHOP-09 | Add extra item | fab → alert → name+unit+qty → item appears in "Extra" section |
| AC-SHOP-10 | Edit extra item | pencil → alert → new name saved |
| AC-SHOP-11 | Delete extra item | delete button + confirm → item removed |
| AC-SHOP-12 | MENU item not editable (name/unit) | PATCH name on MENU-source item → 400 |
| AC-SHOP-13 | Search filter | searchbar narrows list by ingredient name (case-insensitive) |

---

## 3.5 Collaboration

| ID | Scenario | Acceptance Criteria |
|----|----------|---------------------|
| AC-COL-01 | Send invite to registered user | invite created, success toast, invite visible in sent list |
| AC-COL-02 | Send invite to unknown email | 404/error toast shown |
| AC-COL-03 | Self-invite blocked | sending invite to own email → error |
| AC-COL-04 | Duplicate pending invite blocked | second invite to same pending user → error |
| AC-COL-05 | Accept invite | invite moves to accepted; both users see each other as collaborators |
| AC-COL-06 | Reject invite | invite removed from pending; no collaborator relationship |
| AC-COL-07 | Revoke sent invite | sender can cancel pending invite; removed from pending list |
| AC-COL-08 | Rejected invite not reappears | after reject + reload → not in pending section |
| AC-COL-09 | View collaborator menu | "Vedi menù" button visible for accepted collaborator; modal opens showing their week |
| AC-COL-10 | Shopping aggregation post-accept | collaborator's menu items appear in own shopping list after accept |
| AC-COL-11 | Collaborator menu auth | unauthenticated/non-collaborator → 403 on GET /menu/collaborator/:id |
