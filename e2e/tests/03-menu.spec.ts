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

  test('aggiunge alimento al pasto', async ({ page, request }) => {
    // Create ingredient via API
    const ing = await createIngredient(request, token, { name: 'Uova', defaultUnit: 'unit', defaultQty: 2 });

    await page.reload();
    await expect(page.locator('.meal-section').first()).toBeVisible({ timeout: 8000 });

    // Click "+" button on first meal (Colazione)
    await page.locator('.meal-section').first().locator('.add-btn').click();

    const alert = page.locator('ion-alert');
    await expect(alert).toBeVisible({ timeout: 5000 });

    // Select the ingredient radio
    await alert.locator(`input[value="${ing.id}"]`).check();
    await alert.getByRole('button', { name: 'Aggiungi' }).click();
    await expect(alert).not.toBeVisible({ timeout: 5000 });

    // Item should appear in the meal
    await expect(page.locator('.item-name').filter({ hasText: 'Uova' })).toBeVisible({ timeout: 5000 });
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

  test('day selector scrollabile su viewport stretto (360px)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 }); // Samsung S8+
    await expect(page.locator('.day-pill')).toHaveCount(7, { timeout: 8000 });
    // All 7 pills exist; the bar should be scrollable (overflow-x: auto)
    const bar = page.locator('.day-selector-bar');
    await expect(bar).toBeVisible();
    // The last pill should be reachable by scrolling
    await page.locator('.day-pill').last().scrollIntoViewIfNeeded();
    await page.locator('.day-pill').last().click();
    await expect(page.locator('.day-title')).toContainText('Domenica');
  });
});
