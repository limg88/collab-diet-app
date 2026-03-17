import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Unit } from '../ingredients/ingredients.service';

export interface CollaboratorBreakdown { userId: string; email: string; qty: number; }
export interface ShoppingItem {
  id: string; name: string; category?: string; unit: Unit;
  totalQty: number; stockQty: number; collaboratorStockQty: number;
  isPurchased: boolean;
  source: 'MENU' | 'FUORI_MENU'; mealType?: string;
  collaboratorBreakdown?: CollaboratorBreakdown[];
}

@Injectable({ providedIn: 'root' })
export class ShoppingService {
  constructor(private api: ApiService) {}
  getList() { return this.api.get<ShoppingItem[]>('/shopping'); }
  addExtra(dto: Partial<ShoppingItem>) { return this.api.post<ShoppingItem>('/shopping/extras', dto); }
  updateItem(id: string, dto: Partial<ShoppingItem>) { return this.api.patch<ShoppingItem>(`/shopping/${id}`, dto); }
  deleteExtra(id: string) { return this.api.delete(`/shopping/${id}`); }
}
