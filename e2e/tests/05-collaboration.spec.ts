import { test, expect } from '@playwright/test';
import { uniqueEmail, registerUser, loginUser } from './helpers/api';
import { loginViaUI } from './helpers/auth';

const PASSWORD = 'Test1234!';

test.describe('Collaborazione', () => {
  let emailA: string;
  let emailB: string;
  let tokenB: string;

  test.beforeEach(async ({ request }) => {
    emailA = uniqueEmail();
    emailB = uniqueEmail();
    await registerUser(request, { email: emailA, password: PASSWORD });
    tokenB = await registerUser(request, { email: emailB, password: PASSWORD });
  });

  test('pagina collaborazione carica correttamente', async ({ page, request }) => {
    await loginViaUI(page, emailA, PASSWORD);
    await page.locator('ion-tab-button[tab="collaboration"]').click();
    await expect(page).toHaveURL(/\/collaboration/);
    await expect(page.locator('ion-title')).toContainText('Collaboratori');
  });

  test('invia invito di collaborazione', async ({ page, request }) => {
    await loginViaUI(page, emailA, PASSWORD);
    await page.locator('ion-tab-button[tab="collaboration"]').click();

    await page.locator('ion-input[type="email"]').click();
    await page.locator('ion-input[type="email"]').fill(emailB);
    await page.getByRole('button', { name: 'Invia Invito' }).click();

    // Should show success toast
    await expect(page.locator('ion-toast')).toBeVisible({ timeout: 5000 });
  });

  test('errore invitando email non registrata', async ({ page }) => {
    await loginViaUI(page, emailA, PASSWORD);
    await page.locator('ion-tab-button[tab="collaboration"]').click();

    await page.locator('ion-input[type="email"]').click();
    await page.locator('ion-input[type="email"]').fill('nonexistent@nowhere.test');
    await page.getByRole('button', { name: 'Invia Invito' }).click();

    await expect(page.locator('ion-toast[color="danger"]')).toBeVisible({ timeout: 5000 });
  });

  test('accetta invito ricevuto', async ({ page, request }) => {
    // User A sends invite to User B via API
    const API_BASE = 'http://localhost:3000/api/v1';
    const tokenA = await loginUser(request, { email: emailA, password: PASSWORD });
    await request.post(`${API_BASE}/collaboration/invite`, {
      data: { email: emailB },
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    // User B logs in and accepts
    await loginViaUI(page, emailB, PASSWORD);
    await page.locator('ion-tab-button[tab="collaboration"]').click();

    // Pending invites section should show invite from A
    await expect(page.locator('.invite-card').filter({ hasText: emailA })).toBeVisible({ timeout: 8000 });
    await page.locator('.invite-card').filter({ hasText: emailA })
      .getByRole('button', { name: /accetta/i }).click();

    // Collaborator should now appear
    await expect(page.locator('.collaborator-item').filter({ hasText: emailA })).toBeVisible({ timeout: 5000 });
  });

  test('rifiuta invito ricevuto', async ({ page, request }) => {
    const API_BASE = 'http://localhost:3000/api/v1';
    const tokenA = await loginUser(request, { email: emailA, password: PASSWORD });
    await request.post(`${API_BASE}/collaboration/invite`, {
      data: { email: emailB },
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    await loginViaUI(page, emailB, PASSWORD);
    await page.locator('ion-tab-button[tab="collaboration"]').click();

    await expect(page.locator('.invite-card').filter({ hasText: emailA })).toBeVisible({ timeout: 8000 });
    await page.locator('.invite-card').filter({ hasText: emailA })
      .getByRole('button', { name: /rifiuta/i }).click();

    await expect(page.locator('.collaborator-item')).not.toBeVisible({ timeout: 5000 });
  });

  test('pulsante vedi menù visibile per collaboratore accettato', async ({ page, request }) => {
    const API_BASE = 'http://localhost:3000/api/v1';
    const tokenA = await loginUser(request, { email: emailA, password: PASSWORD });

    await request.post(`${API_BASE}/collaboration/invite`, {
      data: { email: emailB },
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    const invitesRes = await request.get(`${API_BASE}/collaboration/invites`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const { received } = await invitesRes.json();
    await request.patch(`${API_BASE}/collaboration/invites/${received[0].id}/accept`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });

    // A logs in and should see B with "Vedi menù" button
    await loginViaUI(page, emailA, PASSWORD);
    await page.locator('ion-tab-button[tab="collaboration"]').click();

    const collabRow = page.locator('.collab-row').filter({ hasText: emailB });
    await expect(collabRow).toBeVisible({ timeout: 8000 });
    await expect(collabRow.getByRole('button', { name: /vedi menù/i })).toBeVisible();
  });

  test('apre menù del collaboratore in modale', async ({ page, request }) => {
    const API_BASE = 'http://localhost:3000/api/v1';
    const tokenA = await loginUser(request, { email: emailA, password: PASSWORD });

    await request.post(`${API_BASE}/collaboration/invite`, {
      data: { email: emailB },
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    const invitesRes = await request.get(`${API_BASE}/collaboration/invites`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const { received } = await invitesRes.json();
    await request.patch(`${API_BASE}/collaboration/invites/${received[0].id}/accept`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });

    await loginViaUI(page, emailA, PASSWORD);
    await page.locator('ion-tab-button[tab="collaboration"]').click();

    const collabRow = page.locator('.collab-row').filter({ hasText: emailB });
    await expect(collabRow).toBeVisible({ timeout: 8000 });
    await collabRow.getByRole('button', { name: /vedi menù/i }).click();

    // Collaborator menu modal opens
    await expect(page.locator('ion-modal')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('ion-modal ion-title')).toContainText(emailB);
    await expect(page.locator('ion-modal .day-pill')).toHaveCount(7, { timeout: 5000 });
  });

  test('invito rifiutato non ricompare dopo refresh', async ({ page, request }) => {
    const API_BASE = 'http://localhost:3000/api/v1';
    const tokenA = await loginUser(request, { email: emailA, password: PASSWORD });
    await request.post(`${API_BASE}/collaboration/invite`, {
      data: { email: emailB },
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    // User B logs in and rejects
    await loginViaUI(page, emailB, PASSWORD);
    await page.locator('ion-tab-button[tab="collaboration"]').click();

    // Find and reject the invite
    const inviteSection = page.locator('.received-section');
    await expect(inviteSection).toBeVisible({ timeout: 8000 });
    await page.getByRole('button', { name: /rifiuta/i }).first().click();

    // Reload page
    await page.reload();
    await page.locator('ion-tab-button[tab="collaboration"]').click();
    await page.waitForTimeout(2000);

    // Rejected invite should NOT appear in received pending invites
    const receivedSection = page.locator('.received-section');
    // Either section is gone (no pending) or doesn't contain emailA as sender
    const isVisible = await receivedSection.isVisible();
    if (isVisible) {
      await expect(receivedSection).not.toContainText(emailA);
    }
  });
});
