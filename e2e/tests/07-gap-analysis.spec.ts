import { test, expect } from '@playwright/test';
import { uniqueEmail, registerUser, loginUser, createIngredient, addMenuItemApi } from './helpers/api';
import { loginViaUI } from './helpers/auth';

const PASSWORD = 'Test1234!';
const API_BASE = 'http://localhost:3000/api/v1';

test.describe('Gap analysis — business rules enforcement', () => {

  // ─── RB-ING-03: defaultQty must be > 0 ───────────────────────────────────
  test.describe('RB-ING-03: ingrediente — quantità minima 0.01', () => {
    test('defaultQty = 0 viene rifiutato dalla API', async ({ request }) => {
      const email = uniqueEmail();
      const token = await registerUser(request, { email, password: PASSWORD });
      const res = await request.post(`${API_BASE}/ingredients`, {
        data: { name: 'TestZero', defaultUnit: 'gr', defaultQty: 0 },
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(res.status()).toBe(400);
    });

    test('defaultQty = 0.01 viene accettato dalla API', async ({ request }) => {
      const email = uniqueEmail();
      const token = await registerUser(request, { email, password: PASSWORD });
      const res = await request.post(`${API_BASE}/ingredients`, {
        data: { name: 'TestMinQty', defaultUnit: 'gr', defaultQty: 0.01 },
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(res.status()).toBe(201);
    });
  });

  // ─── 3.4.1: password hints on register page ──────────────────────────────
  test.describe('3.4.1: indicatori forza password nella registrazione', () => {
    test('tutti i requisiti diventano verdi con password valida', async ({ page }) => {
      await page.goto('http://localhost:4200/register');
      const pwInput = page.locator('ion-input[type="password"]').first();
      await pwInput.click();
      await pwInput.fill('Test1234!');

      // All 4 rule indicators should turn green (have 'met' class or green color)
      const rules = page.locator('.pw-rule');
      await expect(rules).toHaveCount(4, { timeout: 5000 });
      for (let i = 0; i < 4; i++) {
        await expect(rules.nth(i)).toHaveClass(/met/, { timeout: 3000 });
      }
    });

    test('requisiti non soddisfatti mostrati in grigio', async ({ page }) => {
      await page.goto('http://localhost:4200/register');
      const pwInput = page.locator('ion-input[type="password"]').first();
      await pwInput.click();
      await pwInput.fill('short');

      const rules = page.locator('.pw-rule');
      await expect(rules).toHaveCount(4, { timeout: 5000 });
      // At least some rules should NOT have 'met' class
      const notMet = rules.filter({ hasNot: page.locator('.met') });
      await expect(notMet.first()).toBeVisible({ timeout: 3000 });
    });
  });

  // ─── 3.4.6: shopping searchbar ───────────────────────────────────────────
  test.describe('3.4.6: ricerca nella lista della spesa', () => {
    let email: string;
    let token: string;

    test.beforeEach(async ({ page, request }) => {
      email = uniqueEmail();
      token = await registerUser(request, { email, password: PASSWORD });
      await loginViaUI(page, email, PASSWORD);
    });

    test('searchbar filtra gli articoli per nome', async ({ page, request }) => {
      const ing1 = await createIngredient(request, token, { name: 'Avocado', defaultUnit: 'unit', defaultQty: 1 });
      const ing2 = await createIngredient(request, token, { name: 'Broccoli', defaultUnit: 'gr', defaultQty: 200 });
      await addMenuItemApi(request, token, { dayOfWeek: 1, mealType: 'LUNCH', ingredientId: ing1.id });
      await addMenuItemApi(request, token, { dayOfWeek: 1, mealType: 'DINNER', ingredientId: ing2.id });

      await page.locator('ion-tab-button[tab="shopping"]').click();
      await expect(page).toHaveURL(/\/shopping/);
      await page.reload();
      await expect(page.locator('.item-name').filter({ hasText: 'Avocado' })).toBeVisible({ timeout: 8000 });

      // Type in searchbar
      const searchbar = page.locator('ion-searchbar');
      await expect(searchbar).toBeVisible({ timeout: 5000 });
      await searchbar.locator('input').fill('Avocado');

      await expect(page.locator('.item-name').filter({ hasText: 'Avocado' })).toBeVisible({ timeout: 3000 });
      await expect(page.locator('.item-name').filter({ hasText: 'Broccoli' })).not.toBeVisible({ timeout: 3000 });
    });

    test('badge "In dispensa" visibile quando scorta copre il fabbisogno', async ({ page, request }) => {
      // Add extra item via API with a stock qty that covers the need
      await request.post(`${API_BASE}/shopping/extras`, {
        data: { name: 'SaleDispensa', unit: 'gr', totalQty: 100 },
        headers: { Authorization: `Bearer ${token}` }
      });

      // Retrieve the item and set stockQty to full coverage via PATCH
      await page.locator('ion-tab-button[tab="shopping"]').click();
      await page.reload();
      await expect(page.locator('.item-name').filter({ hasText: 'SaleDispensa' })).toBeVisible({ timeout: 8000 });

      const extraItem = await request.get(`${API_BASE}/shopping`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const body = await extraItem.json();
      const item = body.find((i: { name: string }) => i.name === 'SaleDispensa');
      expect(item).toBeDefined();

      // PATCH stockQty = totalQty to trigger "covered" state
      await request.patch(`${API_BASE}/shopping/${item.id}`, {
        data: { stockQty: 100 },
        headers: { Authorization: `Bearer ${token}` }
      });

      await page.reload();
      await expect(page.locator('.shop-item').filter({ hasText: 'SaleDispensa' })
        .locator('.covered-badge')).toBeVisible({ timeout: 8000 });
    });
  });

  // ─── RB-SHOP-04: FUORI_MENU items editable ───────────────────────────────
  test.describe('RB-SHOP-04: modifica articoli FUORI_MENU', () => {
    let email: string;
    let token: string;

    test.beforeEach(async ({ page, request }) => {
      email = uniqueEmail();
      token = await registerUser(request, { email, password: PASSWORD });
      await loginViaUI(page, email, PASSWORD);
    });

    test('pulsante modifica visibile per articoli extra', async ({ page, request }) => {
      await request.post(`${API_BASE}/shopping/extras`, {
        data: { name: 'OlioEVO', unit: 'ml', totalQty: 500 },
        headers: { Authorization: `Bearer ${token}` }
      });

      await page.locator('ion-tab-button[tab="shopping"]').click();
      await page.reload();
      await expect(page.locator('.item-name').filter({ hasText: 'OlioEVO' })).toBeVisible({ timeout: 8000 });

      const extraItem = page.locator('.shop-item').filter({ hasText: 'OlioEVO' });
      await expect(extraItem.locator('ion-button.edit-btn, ion-icon[name="pencil-outline"]').first()).toBeVisible({ timeout: 5000 });
    });

    test('modifica nome articolo extra tramite UI', async ({ page, request }) => {
      await request.post(`${API_BASE}/shopping/extras`, {
        data: { name: 'PastaVecchia', unit: 'gr', totalQty: 300 },
        headers: { Authorization: `Bearer ${token}` }
      });

      await page.locator('ion-tab-button[tab="shopping"]').click();
      await page.reload();
      await expect(page.locator('.item-name').filter({ hasText: 'PastaVecchia' })).toBeVisible({ timeout: 8000 });

      // Click edit button
      await page.locator('.shop-item').filter({ hasText: 'PastaVecchia' })
        .locator('ion-button[class*="edit"]').first().click();

      const alert = page.locator('ion-alert');
      await expect(alert).toBeVisible({ timeout: 5000 });

      // Clear and fill new name
      await alert.locator('input').first().clear();
      await alert.locator('input').first().fill('PastaNuova');
      await alert.getByRole('button', { name: /salva|ok/i }).click();

      await expect(page.locator('.item-name').filter({ hasText: 'PastaNuova' })).toBeVisible({ timeout: 5000 });
      await expect(page.locator('.item-name').filter({ hasText: 'PastaVecchia' })).not.toBeVisible();
    });

    test('API rifiuta modifica nome su articolo MENU (source != FUORI_MENU)', async ({ request }) => {
      const email = uniqueEmail();
      const token = await registerUser(request, { email, password: PASSWORD });
      const ing = await createIngredient(request, token, { name: 'Pasta', defaultUnit: 'gr', defaultQty: 80 });
      await addMenuItemApi(request, token, { dayOfWeek: 1, mealType: 'LUNCH', ingredientId: ing.id });

      // Get the shopping list to find the MENU item
      const listRes = await request.get(`${API_BASE}/shopping`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const list = await listRes.json();
      const menuItem = list.find((i: { source: string }) => i.source === 'MENU');
      expect(menuItem).toBeDefined();

      // Attempt to rename — should be rejected
      const patchRes = await request.patch(`${API_BASE}/shopping/${menuItem.id}`, {
        data: { name: 'HackedName' },
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(patchRes.status()).toBe(400);
    });
  });

  // ─── RB-MENU-04: current-week guard ──────────────────────────────────────
  test.describe('RB-MENU-04: modifica solo menù settimana corrente (API)', () => {
    test('aggiunta al menù corrente ha esito positivo', async ({ request }) => {
      const email = uniqueEmail();
      const token = await registerUser(request, { email, password: PASSWORD });
      const ing = await createIngredient(request, token, { name: 'Fagioli', defaultUnit: 'gr', defaultQty: 100 });
      const res = await request.post(`${API_BASE}/menu/items`, {
        data: { dayOfWeek: 1, mealType: 'LUNCH', ingredientId: ing.id },
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(res.status()).toBe(201);
    });
  });

  // ─── RB-MENU-08: collaborator menu auth guard ─────────────────────────────
  test.describe('RB-MENU-08: accesso menù collaboratore richiede collaborazione attiva', () => {
    test('utente non collaboratore riceve 403', async ({ request }) => {
      const emailA = uniqueEmail();
      const emailB = uniqueEmail();
      const tokenA = await registerUser(request, { email: emailA, password: PASSWORD });
      const tokenB = await registerUser(request, { email: emailB, password: PASSWORD });

      // Register B and get their userId from a profile endpoint or known pattern
      // Try to access A's menu as B without collaboration
      const profileRes = await request.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${tokenA}` }
      });
      const { id: userAId } = await profileRes.json();

      const res = await request.get(`${API_BASE}/menu/collaborator/${userAId}`, {
        headers: { Authorization: `Bearer ${tokenB}` }
      });
      expect(res.status()).toBe(403);
    });

    test('collaboratore accettato può leggere il menù', async ({ request }) => {
      const emailA = uniqueEmail();
      const emailB = uniqueEmail();
      const tokenA = await registerUser(request, { email: emailA, password: PASSWORD });
      const tokenB = await registerUser(request, { email: emailB, password: PASSWORD });

      // A invites B
      await request.post(`${API_BASE}/collaboration/invite`, {
        data: { email: emailB },
        headers: { Authorization: `Bearer ${tokenA}` }
      });

      // B accepts
      const invitesRes = await request.get(`${API_BASE}/collaboration/invites`, {
        headers: { Authorization: `Bearer ${tokenB}` }
      });
      const { received } = await invitesRes.json();
      await request.patch(`${API_BASE}/collaboration/invites/${received[0].id}/accept`, {
        headers: { Authorization: `Bearer ${tokenB}` }
      });

      // Get A's userId
      const profileRes = await request.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${tokenA}` }
      });
      const { id: userAId } = await profileRes.json();

      // B reads A's menu — should succeed
      const res = await request.get(`${API_BASE}/menu/collaborator/${userAId}`, {
        headers: { Authorization: `Bearer ${tokenB}` }
      });
      expect(res.status()).toBe(200);
    });
  });
});
