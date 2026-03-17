import { APIRequestContext } from '@playwright/test';

const API_BASE = 'http://localhost:3000/api/v1';

export interface TestUser {
  email: string;
  password: string;
  token?: string;
}

export async function registerUser(request: APIRequestContext, user: TestUser): Promise<string> {
  const res = await request.post(`${API_BASE}/auth/register`, {
    data: { email: user.email, password: user.password }
  });
  if (!res.ok()) {
    // User might already exist, try login
    return loginUser(request, user);
  }
  const body = await res.json();
  return body.access_token;
}

export async function loginUser(request: APIRequestContext, user: TestUser): Promise<string> {
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: { email: user.email, password: user.password }
  });
  const body = await res.json();
  if (!body.access_token) throw new Error(`Login failed: ${JSON.stringify(body)}`);
  return body.access_token;
}

export async function createIngredient(
  request: APIRequestContext,
  token: string,
  data: { name: string; defaultUnit: string; defaultQty: number; category?: string }
) {
  const res = await request.post(`${API_BASE}/ingredients`, {
    data,
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function addMenuItemApi(
  request: APIRequestContext,
  token: string,
  data: { dayOfWeek: number; mealType: string; ingredientId: string; quantity?: number; unit?: string }
) {
  const res = await request.post(`${API_BASE}/menu/items`, {
    data,
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export function uniqueEmail(): string {
  return `test_${Date.now()}_${Math.floor(Math.random() * 1000)}@playwright.test`;
}
