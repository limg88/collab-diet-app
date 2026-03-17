import { test, expect } from '@playwright/test';
import { uniqueEmail, registerUser, loginUser } from './helpers/api';
import { loginViaUI } from './helpers/auth';

const PASSWORD = 'Test1234!';

test.describe('Gestione Ingredienti', () => {
  let email: string;

  test.beforeEach(async ({ page, request }) => {
    email = uniqueEmail();
    await registerUser(request, { email, password: PASSWORD });
    await loginViaUI(page, email, PASSWORD);
    await page.locator('ion-tab-button[tab="ingredients"]').click();
    await expect(page).toHaveURL(/\/ingredients/);
  });

  test('pagina ingredienti carica correttamente', async ({ page }) => {
    await expect(page.locator('ion-title')).toContainText('Ingredienti');
    await expect(page.locator('.empty-state')).toBeVisible({ timeout: 5000 });
  });

  test('crea un nuovo ingrediente', async ({ page }) => {
    await page.locator('ion-fab-button').click();

    // Fill the alert form
    const alert = page.locator('ion-alert');
    await expect(alert).toBeVisible({ timeout: 5000 });

    await alert.locator('input[name="name"]').fill('Pasta');
    await alert.locator('input[name="category"]').fill('Cereali');
    await alert.locator('input[name="defaultUnit"]').fill('gr');
    await alert.locator('input[name="defaultQty"]').fill('100');

    await alert.getByRole('button', { name: 'Crea' }).click();
    await expect(alert).not.toBeVisible({ timeout: 5000 });

    await expect(page.locator('.ing-name').filter({ hasText: 'Pasta' })).toBeVisible({ timeout: 5000 });
  });

  test('cerca ingrediente per nome', async ({ page, request }) => {
    // Create ingredients via API
    const token = await loginUser(request, { email, password: PASSWORD });
    const { createIngredient } = await import('./helpers/api');
    await createIngredient(request, token, { name: 'Pasta', defaultUnit: 'gr', defaultQty: 100 });
    await createIngredient(request, token, { name: 'Latte', defaultUnit: 'ml', defaultQty: 200 });

    await page.reload();
    await expect(page.locator('.ing-name').first()).toBeVisible({ timeout: 5000 });

    // Search
    await page.locator('ion-searchbar input').fill('past');
    await expect(page.locator('.ing-name').filter({ hasText: 'Pasta' })).toBeVisible();
    await expect(page.locator('.ing-name').filter({ hasText: 'Latte' })).not.toBeVisible();
  });

  test('modifica ingrediente', async ({ page, request }) => {
    const token = await loginUser(request, { email, password: PASSWORD });
    const { createIngredient } = await import('./helpers/api');
    await createIngredient(request, token, { name: 'Riso', defaultUnit: 'gr', defaultQty: 80 });

    await page.reload();
    await expect(page.locator('.ing-name').filter({ hasText: 'Riso' })).toBeVisible({ timeout: 5000 });

    // Click edit (pencil) button for the ingredient
    await page.locator('ion-item').filter({ hasText: 'Riso' })
      .locator('ion-button[color="primary"]').click();

    const alert = page.locator('ion-alert');
    await expect(alert).toBeVisible({ timeout: 5000 });

    const nameInput = alert.locator('input[name="name"]');
    await nameInput.clear();
    await nameInput.fill('Riso Integrale');
    await alert.getByRole('button', { name: 'Salva' }).click();

    await expect(page.locator('.ing-name').filter({ hasText: 'Riso Integrale' })).toBeVisible({ timeout: 5000 });
  });

  test('elimina ingrediente', async ({ page, request }) => {
    const token = await loginUser(request, { email, password: PASSWORD });
    const { createIngredient } = await import('./helpers/api');
    await createIngredient(request, token, { name: 'Burro', defaultUnit: 'gr', defaultQty: 30 });

    await page.reload();
    await expect(page.locator('.ing-name').filter({ hasText: 'Burro' })).toBeVisible({ timeout: 5000 });

    await page.locator('ion-item').filter({ hasText: 'Burro' })
      .locator('ion-button[color="danger"]').click();

    const confirmAlert = page.locator('ion-alert');
    await expect(confirmAlert).toBeVisible({ timeout: 5000 });
    await confirmAlert.getByRole('button', { name: 'Elimina' }).click();

    await expect(page.locator('.ing-name').filter({ hasText: 'Burro' })).not.toBeVisible({ timeout: 5000 });
  });
});
