import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

export type Unit = 'gr' | 'ml' | 'unit';
export type MealType = 'BREAKFAST' | 'MORNING_SNACK' | 'LUNCH' | 'AFTERNOON_SNACK' | 'DINNER' | 'NIGHT_SNACK';

export interface Ingredient {
  id: string;
  name: string;
  category?: string;
  defaultUnit: Unit;
  defaultQty: number;
  allowedMealTypes?: MealType[];
  isDeleted: boolean;
}

@Injectable({ providedIn: 'root' })
export class IngredientsService {
  constructor(private api: ApiService) {}
  list() { return this.api.get<Ingredient[]>('/ingredients'); }
  create(dto: Partial<Ingredient>) { return this.api.post<Ingredient>('/ingredients', dto); }
  update(id: string, dto: Partial<Ingredient>) { return this.api.patch<Ingredient>(`/ingredients/${id}`, dto); }
  delete(id: string) { return this.api.delete(`/ingredients/${id}`); }
}
