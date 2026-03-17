import { test, expect } from '@playwright/test';
import { uniqueEmail, registerUser, createIngredient } from './helpers/api';
import { loginViaUI } from './helpers/auth';

const PASSWORD = 'Test1234!';

test.describe('Refresh automatico al cambio di tab (ionViewWillEnter)', () => {
  let email: string;
  let token: string;

  test.beforeEach(async ({ page, request }) => {
    email = uniqueEmail();
    token = await registerUser(request, { email, password: PASSWORD });
    await loginViaUI(page, email, PASSWORD);
    await expect(page).toHaveURL(/\/menu/, { timeout: 10000 });
  });

  test('nuovo ingrediente compare nel picker del menù senza reload pagina', async ({ page, request }) => {
    // Visita la pagina menù (carica ingredienti vuoti)
    await expect(page.locator('.meal-section').first()).toBeVisible({ timeout: 8000 });

    // Aggiungi ingrediente via API (simula aggiunta dalla tab Ingredienti)
    await createIngredient(request, token, { name: 'Quinoa', defaultUnit: 'gr', defaultQty: 80 });

    // Vai alla tab Ingredienti
    await page.locator('ion-tab-button[tab="ingredients"]').click();
    await expect(page).toHaveURL(/\/ingredients/);
    await expect(page.locator('.ing-item, .empty-state')).toBeVisible({ timeout: 8000 });

    // Torna alla tab Menù — ionViewWillEnter deve ricaricare gli ingredienti
    await page.locator('ion-tab-button[tab="menu"]').click();
    await expect(page).toHaveURL(/\/menu/);
    await expect(page.locator('.meal-section').first()).toBeVisible({ timeout: 8000 });

    // Apri il picker — Quinoa deve essere presente
    await page.locator('.meal-section').first().locator('.add-btn').click();
    await expect(page.locator('ion-modal')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('ion-modal .ing-row').filter({ hasText: 'Quinoa' })).toBeVisible({ timeout: 5000 });

    // Chiudi modale
    await page.locator('ion-modal ion-buttons[slot="end"] ion-button').click();
  });

  test('lista ingredienti si aggiorna al rientro nella tab', async ({ page, request }) => {
    // Naviga alla tab Ingredienti
    await page.locator('ion-tab-button[tab="ingredients"]').click();
    await expect(page.locator('ion-title')).toContainText('Ingredienti', { timeout: 5000 });
    // Prima: lista vuota
    await expect(page.locator('.empty-state')).toBeVisible({ timeout: 6000 });

    // Aggiungi ingrediente via API (simula altra sessione / altro tab)
    await createIngredient(request, token, { name: 'Miglio', defaultUnit: 'gr', defaultQty: 70 });

    // Vai su un'altra tab e torna — ionViewWillEnter deve ricaricare
    await page.locator('ion-tab-button[tab="menu"]').click();
    await expect(page).toHaveURL(/\/menu/);
    await page.locator('ion-tab-button[tab="ingredients"]').click();
    await expect(page).toHaveURL(/\/ingredients/);

    // L'ingrediente aggiunto via API deve essere visibile senza reload manuale
    await expect(page.locator('.ing-item').filter({ hasText: 'Miglio' })).toBeVisible({ timeout: 8000 });
  });

  test('lista della spesa si aggiorna al rientro nella tab', async ({ page, request }) => {
    const ing = await createIngredient(request, token, { name: 'Tofu', defaultUnit: 'gr', defaultQty: 150 });

    // Vai alla tab Spesa (primo caricamento — vuota)
    await page.locator('ion-tab-button[tab="shopping"]').click();
    await expect(page).toHaveURL(/\/shopping/);
    await expect(page.locator('.empty-state')).toBeVisible({ timeout: 8000 });

    // Aggiungi Tofu al menù via API
    const API_BASE = 'http://localhost:3000/api/v1';
    await page.request.post(`${API_BASE}/menu/items`, {
      data: { dayOfWeek: 1, mealType: 'LUNCH', ingredientId: ing.id },
      headers: { Authorization: `Bearer ${token}` }
    });

    // Vai su altra tab e torna
    await page.locator('ion-tab-button[tab="menu"]').click();
    await page.locator('ion-tab-button[tab="shopping"]').click();
    await expect(page).toHaveURL(/\/shopping/);

    // Tofu deve comparire automaticamente (ionViewWillEnter sincronizza)
    await expect(page.locator('.item-name').filter({ hasText: 'Tofu' })).toBeVisible({ timeout: 8000 });
  });

  test('sezione collaboratori si aggiorna al rientro nella tab', async ({ page, request }) => {
    const API_BASE = 'http://localhost:3000/api/v1';

    // Vai alla tab Collaboratori (primo caricamento)
    await page.locator('ion-tab-button[tab="collaboration"]').click();
    await expect(page).toHaveURL(/\/collaboration/);
    await expect(page.locator('.invite-card')).toBeVisible({ timeout: 8000 });

    // Registra un secondo utente e invia invito via API
    const email2 = uniqueEmail();
    const token2 = await registerUser(page.request, { email: email2, password: PASSWORD });
    await page.request.post(`${API_BASE}/collaboration/invite`, {
      data: { email: email2 },
      headers: { Authorization: `Bearer ${token}` }
    });

    // Vai su altra tab e torna
    await page.locator('ion-tab-button[tab="menu"]').click();
    await page.locator('ion-tab-button[tab="collaboration"]').click();
    await expect(page).toHaveURL(/\/collaboration/);

    // L'invito inviato deve apparire nella sezione "Inviti inviati"
    await expect(page.locator('.collab-row').filter({ hasText: email2 })).toBeVisible({ timeout: 8000 });
  });
});
