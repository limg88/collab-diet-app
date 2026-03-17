# Design System — CollabDiet

> Version: 1.0 — derived from existing implementation
> Stack: Ionic 7 + Angular 17 + CSS Custom Properties

---

## 1. Color Palette

| Token | Value | Use |
|-------|-------|-----|
| `--ion-color-primary` | `#2E7D32` (green) | Headers, selected states, primary actions |
| `--ion-color-secondary` | `#F57C00` (orange) | FAB buttons, CTAs, accents |
| `--ion-color-tertiary` | `#FFA000` (amber) | Warnings, highlights |
| `--ion-color-success` | `#388E3C` | Success toasts, checkmarks |
| `--ion-color-danger` | `#D32F2F` | Destructive actions, error toasts |
| `--ion-color-warning` | `#FBC02D` | Non-critical alerts |
| `--ion-color-medium` | `#757575` | Secondary text, section labels |
| `--ion-background-color` | `#FAFAFA` | Page background |
| `--ion-card-background` | `#FFFFFF` | Card surfaces |

**Unit-type color coding (ingredients):**
- `gr` → `#2E7D32` (green)
- `ml` → `#1565C0` (blue)
- `unit` → `#7B1FA2` (purple)

**Dark mode:** Defined in `@media (prefers-color-scheme: dark)`. Primary shifts to `#4CAF50`, backgrounds to `#121212`/`#1E1E1E`.

> Rule: Never use raw hex values in component styles. Always use CSS custom properties so dark mode adapts automatically.

---

## 2. Typography

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Page title | default `ion-title` | 700 | Letter-spacing `-0.3px` |
| Section label | `0.68–0.7rem` | 700 | Uppercase, letter-spacing `1.2px`, color `medium` |
| Item name | `0.9–0.95rem` | 600 | Color `#1a1a1a` → should be `--ion-text-color` |
| Item meta | `0.78–0.82rem` | 400 | Color `#666` → should be `--ion-color-medium` |
| Day pill abbr | `0.6rem` | 700 | Uppercase |
| Day pill number | `1rem` | 700 | — |
| Empty state title | `1.1rem` | 700 | — |
| Empty state body | `0.875rem` | 400 | `max-width: 260px`, `line-height: 1.5` |

---

## 3. Spacing & Radius

| Token | Value | Use |
|-------|-------|-----|
| `--app-border-radius` | `12px` | Cards, modals, meal sections |
| `--app-border-radius-sm` | `8px` | Chips, badges, smaller cards |
| Page horizontal margin | `12px` | Cards, sections |
| Section padding | `16px` | Content within cards |
| Gap between items | `4px–12px` | Context-dependent |

---

## 4. Shadows

| Token | Value | Use |
|-------|-------|-----|
| `--app-shadow` | `0 2px 12px rgba(0,0,0,0.08)` | Cards, meal sections |
| `--app-shadow-lg` | `0 4px 20px rgba(0,0,0,0.12)` | FAB buttons, modals |

---

## 5. Component Patterns

### Cards / Sections
- White background (`--ion-card-background`)
- `border-radius: var(--app-border-radius)`
- `box-shadow: var(--app-shadow)`
- Margin: `0 12px 12px`

### Section Labels (uppercase headers)
```css
font-size: 0.68rem;
font-weight: 700;
letter-spacing: 1.2px;
text-transform: uppercase;
color: var(--ion-color-medium);
padding: 12px 16px 4px;
```

### Empty States
```html
<div class="empty-state">
  <ion-icon class="empty-icon" name="..."></ion-icon>
  <h3>Titolo</h3>
  <p>Descrizione breve (max 260px wide)</p>
</div>
```

### FAB Buttons
- Color: `--ion-color-secondary` (orange)
- Position: `fixed bottom-right`
- Shadow: `--app-shadow-lg`

### Destructive Actions
- Always `color="danger"` on the button
- Confirm with `AlertController` before executing
- Toast feedback after completion

### Success Feedback
- `ion-toast` with `color="success"`, `duration=2000`
- Message: name the specific item that was acted on

### Toasts
- Success: `color="success"`, 2000ms
- Error: `color="danger"`, 3500ms
- Warning: `color="warning"`, 3000ms

---

## 6. Tab Bar

| Tab | Icon | Label |
|-----|------|-------|
| menu | `restaurant-outline` | Menù |
| ingredients | `nutrition-outline` | Ingredienti |
| shopping | `cart-outline` | Spesa |
| collaboration | `people-outline` | Team |

- `--color`: `var(--ion-color-medium)` (unselected)
- `--color-selected`: `var(--ion-color-primary)` (selected)
- Background: `#ffffff`, `border-top: 1px solid rgba(0,0,0,0.08)`
- Safe area: `padding-bottom: env(safe-area-inset-bottom)`

---

## 7. Icon Usage

| Context | Icon | Notes |
|---------|------|-------|
| Add action | `add` | FAB or header button |
| Edit | `pencil-outline` | Inline action button |
| Delete | `trash-outline` | Inline, color danger |
| Logout | `log-out-outline` | Header end slot |
| Collaborator indicator | `people-outline` | Shopping list |
| Pantry / stock | `storefront-outline` | Shopping list |
| Calendar / week | `calendar-outline` | Collaboration page |
| Meal — breakfast | `cafe` | Color `#F57C00` |
| Meal — morning snack | `sunny` | Color `#FBC02D` |
| Meal — lunch | `restaurant` | Color `#2E7D32` |
| Meal — afternoon snack | `ice-cream` | Color `#7B1FA2` |
| Meal — dinner | `moon` | Color `#1565C0` |
| Meal — night snack | `fast-food` | Color `#546E7A` |

---

## 8. Interaction States

| State | Treatment |
|-------|-----------|
| Loading (initial) | `ion-skeleton-text` rows, same layout as content |
| Loading (refresh) | Silent — no skeleton; previous data stays visible |
| Error | Toast (transient) + inline banner with retry (persistent) |
| Empty | `.empty-state` centered card with icon + CTA |
| Purchased item | `opacity: 0.55`, `text-decoration: line-through` |
| Selected day pill | White bg, primary color text, shadow |

---

## 9. Responsive Guidelines

- **Minimum supported width:** 360px (Samsung S8+)
- Day selector: `flex: 1` pills fill full width, no horizontal scroll on 360px+
- Max content width: no max-width set (full width on mobile; consider `max-width: 600px; margin: auto` for desktop Electron)
- Touch targets: minimum `44px` height for all tappable elements
