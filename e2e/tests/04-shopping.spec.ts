import { test, expect } from '@playwright/test';
import { uniqueEmail, registerUser, loginUser, createIngredient, addMenuItemApi } from './helpers/api';
import { loginViaUI } from './helpers/auth';

const PASSWORD = 'Test1234!';

test.describe('Lista della Spesa', () => {
  let email: string;
  let token: string;

  test.beforeEach(async ({ page, request }) => {
    email = uniqueEmail();
    token = await registerUser(request, { email, password: PASSWORD });
    await loginViaUI(page, email, PASSWORD);
    await page.locator('ion-tab-button[tab="shopping"]').click();
    await expect(page).toHaveURL(/\/shopping/);
  });

  test('lista vuota per nuovo utente', async ({ page }) => {
    await expect(page.locator('.empty-state')).toBeVisible({ timeout: 8000 });
  });

  test('lista generata automaticamente dal menù', async ({ page, request }) => {
    const ing = await createIngredient(request, token, { name: 'Yogurt', defaultUnit: 'gr', defaultQty: 150 });
    await addMenuItemApi(request, token, { dayOfWeek: 1, mealType: 'BREAKFAST', ingredientId: ing.id });

    await page.reload();
    await expect(page.locator('.item-name').filter({ hasText: 'Yogurt' })).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.section-label').first()).toContainText('Dal Menù');
  });

  test('progress bar visibile con articoli', async ({ page, request }) => {
    const ing = await createIngredient(request, token, { name: 'Pane', defaultUnit: 'gr', defaultQty: 100 });
    await addMenuItemApi(request, token, { dayOfWeek: 2, mealType: 'LUNCH', ingredientId: ing.id });

    await page.reload();
    await expect(page.locator('ion-progress-bar')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.progress-count')).toContainText('0/');
  });

  test('marca articolo come acquistato', async ({ page, request }) => {
    const ing = await createIngredient(request, token, { name: 'Latte', defaultUnit: 'ml', defaultQty: 250 });
    await addMenuItemApi(request, token, { dayOfWeek: 1, mealType: 'BREAKFAST', ingredientId: ing.id });

    await page.reload();
    await expect(page.locator('.item-name').filter({ hasText: 'Latte' })).toBeVisible({ timeout: 8000 });

    // Click the checkbox
    await page.locator('.shop-item').filter({ hasText: 'Latte' })
      .locator('ion-checkbox').click();

    // Progress count should update
    await expect(page.locator('.progress-count')).toContainText('1/', { timeout: 5000 });
  });

  test('aggiunge articolo extra (FUORI_MENU)', async ({ page }) => {
    await expect(page.locator('ion-fab-button')).toBeVisible({ timeout: 5000 });
    await page.locator('ion-fab-button').click();

    const alert = page.locator('ion-alert');
    await expect(alert).toBeVisible({ timeout: 5000 });

    await alert.locator('input[name="name"]').fill('Detersivo');
    await alert.locator('input[name="unit"]').fill('unit');
    await alert.locator('input[name="totalQty"]').fill('2');
    await alert.getByRole('button', { name: 'Aggiungi' }).click();

    await expect(page.locator('.item-name').filter({ hasText: 'Detersivo' })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.section-label').filter({ hasText: 'Extra' })).toBeVisible();
  });

  test('scorta disponibile per articoli extra', async ({ page, request }) => {
    const API_BASE = 'http://localhost:3000/api/v1';
    await request.post(`${API_BASE}/shopping/extras`, {
      data: { name: 'Sale', unit: 'gr', totalQty: 500 },
      headers: { Authorization: `Bearer ${token}` }
    });

    await page.reload();
    const extraItem = page.locator('.shop-item').filter({ hasText: 'Sale' });
    await expect(extraItem).toBeVisible({ timeout: 8000 });

    // Extra item should have a stock input
    await expect(extraItem.locator('.stock-input')).toBeVisible();
  });

  test('elimina articolo extra', async ({ page, request }) => {
    const API_BASE = 'http://localhost:3000/api/v1';
    await request.post(`${API_BASE}/shopping/extras`, {
      data: { name: 'Caffè', unit: 'gr', totalQty: 250 },
      headers: { Authorization: `Bearer ${token}` }
    });

    await page.reload();
    await expect(page.locator('.item-name').filter({ hasText: 'Caffè' })).toBeVisible({ timeout: 8000 });

    await page.locator('.shop-item').filter({ hasText: 'Caffè' })
      .locator('ion-button[color="danger"]').click();

    const confirmAlert = page.locator('ion-alert');
    await expect(confirmAlert).toBeVisible({ timeout: 5000 });
    await confirmAlert.getByRole('button', { name: 'Rimuovi' }).click();

    await expect(page.locator('.item-name').filter({ hasText: 'Caffè' })).not.toBeVisible({ timeout: 5000 });
  });
});
