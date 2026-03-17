import { test, expect } from '@playwright/test';
import { uniqueEmail, registerUser } from './helpers/api';

const VALID_PASSWORD = 'Test1234!';

test.describe('Autenticazione', () => {
  test('redirect alla login se non autenticato', async ({ page }) => {
    await page.goto('/menu');
    await expect(page).toHaveURL(/\/login/);
  });

  test('registrazione nuovo utente', async ({ page }) => {
    const email = uniqueEmail();
    await page.goto('/register');

    await page.locator('ion-input[type="email"]').click();
    await page.locator('ion-input[type="email"]').fill(email);
    await page.locator('ion-input[type="password"]').click();
    await page.locator('ion-input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Registrati' }).click();

    await expect(page).toHaveURL(/\/menu/, { timeout: 10000 });
  });

  test('login utente esistente', async ({ page, request }) => {
    const email = uniqueEmail();
    await registerUser(request, { email, password: VALID_PASSWORD });

    await page.goto('/login');
    await page.locator('ion-input[type="email"]').click();
    await page.locator('ion-input[type="email"]').fill(email);
    await page.locator('ion-input[type="password"]').click();
    await page.locator('ion-input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Accedi' }).click();

    await expect(page).toHaveURL(/\/menu/, { timeout: 10000 });
  });

  test('errore con credenziali errate', async ({ page, request }) => {
    const email = uniqueEmail();
    await registerUser(request, { email, password: VALID_PASSWORD });

    await page.goto('/login');
    await page.locator('ion-input[type="email"]').click();
    await page.locator('ion-input[type="email"]').fill(email);
    await page.locator('ion-input[type="password"]').click();
    await page.locator('ion-input[type="password"]').fill('WrongPass1!');
    await page.getByRole('button', { name: 'Accedi' }).click();

    await expect(page.locator('.error-msg')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('logout', async ({ page, request }) => {
    const email = uniqueEmail();
    await registerUser(request, { email, password: VALID_PASSWORD });

    await page.goto('/login');
    await page.locator('ion-input[type="email"]').click();
    await page.locator('ion-input[type="email"]').fill(email);
    await page.locator('ion-input[type="password"]').click();
    await page.locator('ion-input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Accedi' }).click();
    await page.waitForURL(/\/menu/, { timeout: 10000 });

    // Click logout button (icon-only button in header)
    await page.locator('ion-header ion-button').last().click();
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});
