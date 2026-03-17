import { Page } from '@playwright/test';

export async function loginViaUI(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.locator('ion-input[type="email"]').first().click();
  await page.locator('ion-input[type="email"]').first().fill(email);
  await page.locator('ion-input[type="password"]').first().click();
  await page.locator('ion-input[type="password"]').first().fill(password);
  await page.getByRole('button', { name: /Accedi/i }).click();
  // Wait for navigation away from login
  await page.waitForURL(/\/(menu|ingredients|shopping|collaboration)/, { timeout: 10000 });
}

export async function fillIonInput(page: Page, selector: string, value: string) {
  const input = page.locator(selector);
  await input.click();
  await input.fill(value);
}
