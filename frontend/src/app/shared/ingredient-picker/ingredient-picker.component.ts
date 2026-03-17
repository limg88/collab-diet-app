import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonButtons,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Ingredient, MealType } from '../../features/ingredients/ingredients.service';

@Component({
  selector: 'app-ingredient-picker',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonButtons
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
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ mealLabel }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar style="--background: var(--ion-color-primary);">
        <ion-searchbar
          placeholder="Cerca ingrediente..."
          [(ngModel)]="query"
          (ionInput)="filter()"
          style="--background: rgba(255,255,255,0.15); --color: white; --placeholder-color: rgba(255,255,255,0.7); --icon-color: rgba(255,255,255,0.8); --border-radius: 10px; --box-shadow: none;">
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
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
  `
})
export class IngredientPickerComponent implements OnInit {
  @Input() ingredients: Ingredient[] = [];
  @Input() mealLabel = 'Aggiungi alimento';
  @Input() mealType?: MealType;

  query = '';
  filtered: Ingredient[] = [];

  private readonly unitColors: Record<string, string> = {
    gr: '#2E7D32', ml: '#1565C0', unit: '#7B1FA2'
  };

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline });
  }

  ngOnInit() {
    // Filter by allowed meal types if applicable
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
    this.modalCtrl.dismiss(ing, 'selected');
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  unitColor(unit: string): string {
    return this.unitColors[unit] || '#757575';
  }
}
