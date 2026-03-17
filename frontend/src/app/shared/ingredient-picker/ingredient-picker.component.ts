import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonButtons, IonInput,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, arrowBackOutline } from 'ionicons/icons';
import { Ingredient, MealType } from '../../features/ingredients/ingredients.service';

@Component({
  selector: 'app-ingredient-picker',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonButtons, IonInput
  ],
  styles: [`
    ion-toolbar { --background: var(--ion-color-primary); --color: white; }
    ion-title { color: white; }
    ion-buttons ion-button { --color: white; }
    .ing-row {
      --padding-start: 16px;
      --min-height: 52px;
      cursor: pointer;
    }
    .ing-row:active { --background: rgba(46,125,50,0.08); }
    .ing-name { font-weight: 600; font-size: 0.95rem; }
    .ing-meta { font-size: 0.8rem; color: var(--ion-color-medium); margin-top: 2px; }
    .unit-dot {
      display: inline-block;
      width: 8px; height: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .empty { text-align: center; padding: 40px 20px; color: var(--ion-color-medium); }
    .qty-step { padding: 32px 24px; display: flex; flex-direction: column; gap: 24px; }
    .qty-ingredient-card { background: rgba(46,125,50,0.06); border-radius: 12px; padding: 16px; }
    .qty-ing-name { font-weight: 700; font-size: 1.1rem; color: #1a1a1a; }
    .qty-ing-unit { font-size: 0.82rem; color: var(--ion-color-medium); margin-top: 3px; }
    .qty-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--ion-color-medium); margin-bottom: 8px; }
    .qty-input-wrap { background: white; border: 2px solid var(--ion-color-primary); border-radius: 12px; padding: 8px 16px; display: flex; align-items: center; gap: 8px; }
    .qty-main-input { font-size: 1.6rem; font-weight: 700; color: var(--ion-color-primary); --padding-start: 0; text-align: center; flex: 1; }
    .qty-unit-label { font-size: 1rem; font-weight: 600; color: #888; flex-shrink: 0; }
    .confirm-btn { --background: var(--ion-color-primary); --border-radius: 12px; font-weight: 700; font-size: 1rem; height: 52px; }
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" *ngIf="selectedIngredient">
          <ion-button (click)="backToList()">
            <ion-icon name="arrow-back-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ selectedIngredient ? selectedIngredient.name : mealLabel }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar style="--background: var(--ion-color-primary);" *ngIf="!selectedIngredient">
        <ion-searchbar
          placeholder="Cerca ingrediente..."
          [(ngModel)]="query"
          (ionInput)="filter()"
          style="--background: rgba(255,255,255,0.15); --color: white; --placeholder-color: rgba(255,255,255,0.7); --icon-color: rgba(255,255,255,0.8); --border-radius: 10px; --box-shadow: none;">
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="!selectedIngredient">
      <ion-list lines="inset">
        <ion-item
          class="ing-row"
          *ngFor="let ing of filtered"
          (click)="select(ing)"
          button detail="false">
          <ion-label>
            <div class="ing-name">{{ ing.name }}</div>
            <div class="ing-meta">
              <span class="unit-dot" [style.background]="unitColor(ing.defaultUnit)"></span>
              {{ ing.defaultQty }} {{ ing.defaultUnit }}
              <span *ngIf="ing.category"> · {{ ing.category }}</span>
            </div>
          </ion-label>
        </ion-item>
      </ion-list>
      <div class="empty" *ngIf="filtered.length === 0">
        <p>Nessun ingrediente trovato</p>
      </div>
    </ion-content>
    <ion-content *ngIf="selectedIngredient">
      <div class="qty-step">
        <div class="qty-ingredient-card">
          <div class="qty-ing-name">{{ selectedIngredient.name }}</div>
          <div class="qty-ing-unit">{{ selectedIngredient.defaultUnit }}</div>
        </div>
        <div>
          <p class="qty-label">Quantità</p>
          <div class="qty-input-wrap">
            <ion-input type="number" [(ngModel)]="selectedQty" min="0.1" step="any" inputmode="decimal" class="qty-main-input"></ion-input>
            <span class="qty-unit-label">{{ selectedIngredient.defaultUnit }}</span>
          </div>
        </div>
        <ion-button expand="block" class="confirm-btn" (click)="confirm()">
          ✓ Aggiungi al pasto
        </ion-button>
      </div>
    </ion-content>
  `
})
export class IngredientPickerComponent implements OnInit {
  @Input() ingredients: Ingredient[] = [];
  @Input() mealLabel = 'Aggiungi alimento';
  @Input() mealType?: MealType;

  query = '';
  filtered: Ingredient[] = [];
  selectedIngredient: Ingredient | null = null;
  selectedQty = 100;

  private readonly unitColors: Record<string, string> = {
    gr: '#2E7D32', ml: '#1565C0', unit: '#7B1FA2'
  };

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, arrowBackOutline });
  }

  ngOnInit() {
    const base = this.mealType
      ? this.ingredients.filter(i =>
          !i.allowedMealTypes?.length || i.allowedMealTypes.includes(this.mealType!)
        )
      : this.ingredients;
    this.filtered = [...base];
    this._base = base;
  }

  private _base: Ingredient[] = [];

  filter() {
    const q = this.query.toLowerCase();
    this.filtered = this._base.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.category || '').toLowerCase().includes(q)
    );
  }

  select(ing: Ingredient) {
    this.selectedIngredient = ing;
    this.selectedQty = ing.defaultQty;
  }

  backToList() {
    this.selectedIngredient = null;
  }

  confirm() {
    if (!this.selectedIngredient) return;
    this.modalCtrl.dismiss({ ingredient: this.selectedIngredient, quantity: this.selectedQty }, 'selected');
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  unitColor(unit: string): string {
    return this.unitColors[unit] || '#757575';
  }
}
