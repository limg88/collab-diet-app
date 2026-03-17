# Functional Summary

## Core Entities
- User (auth, email unique)
- Ingredient (catalog, logical delete, per-user private)
- WeeklyMenu → MenuDay (7) → Meal (6 types) → MealItem → Ingredient
- ShoppingItem (MENU derived | FUORI_MENU manual; aggregated per name+unit)
- CollaborationInvite (pending/accepted/rejected/revoked)

## MVP Vertical Slice
1. Register / Login (JWT)
2. Ingredient CRUD (logical delete)
3. Weekly menu — current week, auto-copy from previous week (Europe/Roma TZ)
4. Shopping list — auto-generated, pantry stock deduction, manual extras
5. Collaboration — invite by email, accept/reject, shared shopping list

## Key Business Rules (non-obvious)
- RB-MENU-03: auto-create current week menu copying previous
- RB-SHOP-02: aggregate by name+unit across meals and collaborators
- RB-SHOP-04: qty_to_buy = max(0, total - stock)
- RB-COL-08: multiple active collaborators; all aggregated in shopping list
- Ingredient with active menu references: logical delete only

## Meal Types (enum)
BREAKFAST, MORNING_SNACK, LUNCH, AFTERNOON_SNACK, DINNER, NIGHT_SNACK

## Units (enum)
gr, ml, unit
