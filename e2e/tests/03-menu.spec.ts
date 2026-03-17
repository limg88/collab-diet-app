import { test, expect } from '@playwright/test';
import { uniqueEmail, registerUser, loginUser, createIngredient } from './helpers/api';
import { loginViaUI } from './helpers/auth';

const PASSWORD = 'Test1234!';

test.describe('Menù Settimanale', () => {
  let email: string;
  let token: string;

  test.beforeEach(async ({ page, request }) => {
    email = uniqueEmail();
    token = await registerUser(request, { email, password: PASSWORD });
    await loginViaUI(page, email, PASSWORD);
    await expect(page).toHaveURL(/\/menu/, { timeout: 10000 });
  });

  test('pagina menù mostra day-selector settimanale', async ({ page }) => {
    // Should show 7 day pills
    const dayPills = page.locator('.day-pill');
    await expect(dayPills).toHaveCount(7, { timeout: 8000 });
  });

  test('menù corrente viene caricato', async ({ page }) => {
    // Meal sections should be visible
    await expect(page.locator('.meal-section').first()).toBeVisible({ timeout: 8000 });
  });

  test('aggiunge alimento al pasto via modal picker', async ({ page, request }) => {
    const ing = await createIngredient(request, token, { name: 'Uova', defaultUnit: 'unit', defaultQty: 2 });

    await page.reload();
    await expect(page.locator('.meal-section').first()).toBeVisible({ timeout: 8000 });

    await page.locator('.meal-section').first().locator('.add-btn').click();

    // Modal picker should open
    await expect(page.locator('ion-modal')).toBeVisible({ timeout: 5000 });

    // Click the ingredient
    await page.locator('ion-modal .ing-row').filter({ hasText: 'Uova' }).click();

    // Quantity step appears
    await expect(page.locator('ion-modal .qty-step')).toBeVisible({ timeout: 3000 });

    // Confirm with default quantity
    await page.locator('ion-modal .confirm-btn').click();

    await expect(page.locator('ion-modal')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator('.item-name').filter({ hasText: 'Uova' })).toBeVisible({ timeout: 5000 });
  });

  test('quantità modificabile prima di aggiungere al pasto', async ({ page, request }) => {
    const ing = await createIngredient(request, token, { name: 'Riso', defaultUnit: 'gr', defaultQty: 80 });

    await page.reload();
    await expect(page.locator('.meal-section').first()).toBeVisible({ timeout: 8000 });

    await page.locator('.meal-section').first().locator('.add-btn').click();
    await expect(page.locator('ion-modal')).toBeVisible({ timeout: 5000 });

    await page.locator('ion-modal .ing-row').filter({ hasText: 'Riso' }).click();
    await expect(page.locator('ion-modal .qty-step')).toBeVisible({ timeout: 3000 });

    // Modify quantity
    const qtyInput = page.locator('ion-modal .qty-main-input');
    await qtyInput.clear();
    await qtyInput.fill('150');
    await page.locator('ion-modal .confirm-btn').click();

    // Item should appear with modified quantity
    await expect(page.locator('.item-qty').filter({ hasText: '150' })).toBeVisible({ timeout: 5000 });
  });

  test('quantità > 99999 viene bloccata prima del salvataggio', async ({ page, request }) => {
    await createIngredient(request, token, { name: 'TestOverflow', defaultUnit: 'gr', defaultQty: 100 });

    await page.reload();
    await expect(page.locator('.meal-section').first()).toBeVisible({ timeout: 8000 });

    await page.locator('.meal-section').first().locator('.add-btn').click();
    await expect(page.locator('ion-modal')).toBeVisible({ timeout: 5000 });

    await page.locator('ion-modal .ing-row').filter({ hasText: 'TestOverflow' }).click();
    await expect(page.locator('ion-modal .qty-step')).toBeVisible({ timeout: 3000 });

    // Enter an oversized value
    const qtyInput = page.locator('ion-modal .qty-main-input');
    await qtyInput.clear();
    await qtyInput.fill('234234234');
    await page.locator('ion-modal .confirm-btn').click();

    // Value should be capped to 99999 — item appears with quantity 99999 (not the overflow value)
    await expect(page.locator('ion-modal')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator('.item-qty').filter({ hasText: '99999' })).toBeVisible({ timeout: 5000 });
  });

  test('feedback toast dopo aggiunta alimento al pasto', async ({ page, request }) => {
    await createIngredient(request, token, { name: 'Frutta', defaultUnit: 'gr', defaultQty: 100 });

    await page.reload();
    await expect(page.locator('.meal-section').first()).toBeVisible({ timeout: 8000 });

    await page.locator('.meal-section').first().locator('.add-btn').click();
    await expect(page.locator('ion-modal')).toBeVisible({ timeout: 5000 });

    await page.locator('ion-modal .ing-row').first().click();
    await expect(page.locator('ion-modal .qty-step')).toBeVisible({ timeout: 3000 });
    await page.locator('ion-modal .confirm-btn').click();

    // Success toast should appear
    await expect(page.locator('ion-toast')).toBeVisible({ timeout: 5000 });
  });

  test('rimuove alimento dal pasto', async ({ page, request }) => {
    const ing = await createIngredient(request, token, { name: 'Miele', defaultUnit: 'gr', defaultQty: 20 });
    await import('./helpers/api').then(m => m.addMenuItemApi(request, token, {
      dayOfWeek: 1, mealType: 'BREAKFAST', ingredientId: ing.id
    }));

    await page.reload();
    await expect(page.locator('.item-name').filter({ hasText: 'Miele' })).toBeVisible({ timeout: 8000 });

    // Delete the item
    await page.locator('.meal-item-row').filter({ hasText: 'Miele' })
      .locator('ion-button[color="danger"]').click();

    await expect(page.locator('.item-name').filter({ hasText: 'Miele' })).not.toBeVisible({ timeout: 5000 });
  });

  test('navigazione tra i giorni', async ({ page }) => {
    await expect(page.locator('.day-pill').first()).toBeVisible({ timeout: 8000 });

    // Click on Thursday (day 4)
    await page.locator('.day-pill').nth(3).click();
    await expect(page.locator('.day-title')).toContainText('Giovedì');
  });

  test('messaggio quando nessun ingrediente disponibile', async ({ page }) => {
    // No ingredients created — clicking "+" should show toast warning
    await page.locator('.meal-section').first().locator('.add-btn').click();

    // Should show a toast (no alert) warning about missing ingredients
    await expect(page.locator('ion-toast')).toBeVisible({ timeout: 5000 });
  });

  test('nome ingrediente visibile dopo aggiunta', async ({ page, request }) => {
    const ing = await createIngredient(request, token, { name: 'Avena', defaultUnit: 'gr', defaultQty: 80 });
    await import('./helpers/api').then(m => m.addMenuItemApi(request, token, {
      dayOfWeek: 1, mealType: 'BREAKFAST', ingredientId: ing.id
    }));

    await page.reload();
    await expect(page.locator('.day-pill').first()).toBeVisible({ timeout: 8000 });

    // Navigate to Monday (day 1)
    await page.locator('.day-pill').first().click();

    // Ingredient name should be visible in the meal item
    await expect(page.locator('.item-name').filter({ hasText: 'Avena' })).toBeVisible({ timeout: 8000 });
  });

  test('day pills riempiono tutta la larghezza su viewport stretto (360px)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 }); // Samsung S8+
    await expect(page.locator('.day-pill')).toHaveCount(7, { timeout: 8000 });

    // All pills visible without horizontal scroll (flex:1 distributes evenly)
    const bar = page.locator('.day-selector-bar');
    await expect(bar).toBeVisible();

    const lastPill = page.locator('.day-pill').last();
    await expect(lastPill).toBeVisible();
    await lastPill.click();
    await expect(page.locator('.day-title')).toContainText('Domenica');
  });
});
