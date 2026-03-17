import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { MealType, Unit } from '../ingredients/ingredients.service';

export interface MealItem { id: string; ingredientId: string; ingredientName: string; quantity: number; unit: Unit; }
export interface Meal { id: string; mealType: MealType; items: MealItem[]; }
export interface MenuDay { id: string; dayOfWeek: number; meals: Meal[]; }
export interface WeeklyMenu { id: string; weekStart: string; days: MenuDay[]; }

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private api: ApiService) {}
  getCurrentMenu() { return this.api.get<WeeklyMenu>('/menu/current'); }
  addItem(dto: { dayOfWeek: number; mealType: MealType; ingredientId: string; quantity?: number; unit?: Unit }) {
    return this.api.post<MealItem>('/menu/items', dto);
  }
  updateItem(id: string, quantity: number) { return this.api.patch<MealItem>(`/menu/items/${id}`, { quantity }); }
  removeItem(id: string) { return this.api.delete(`/menu/items/${id}`); }
  getCollaboratorMenu(userId: string) { return this.api.get<WeeklyMenu>(`/menu/collaborator/${userId}`); }
}
