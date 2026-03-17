import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon,
  IonButtons, IonCheckbox, IonChip, IonFooter,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkOutline } from 'ionicons/icons';
import { Ingredient, Unit, MealType } from '../../features/ingredients/ingredients.service';

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: 'Colazione',
  MORNING_SNACK: 'Spuntino mattina',
  LUNCH: 'Pranzo',
  AFTERNOON_SNACK: 'Merenda',
  DINNER: 'Cena',
  NIGHT_SNACK: 'Spuntino sera'
};
const ALL_MEAL_TYPES: MealType[] = ['BREAKFAST','MORNING_SNACK','LUNCH','AFTERNOON_SNACK','DINNER','NIGHT_SNACK'];

@Component({
  selector: 'app-ingredient-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon,
    IonButtons, IonCheckbox, IonChip, IonFooter
  ],
  styles: [`
    ion-toolbar { --background: var(--ion-color-primary); --color: white; }
    ion-title { color: white; }
    ion-buttons ion-button { --color: white; }

    .form-section {
      padding: 8px 0 0;
    }
    .section-label {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--ion-color-medium);
      padding: 12px 16px 4px;
    }
    ion-item {
      --padding-start: 16px;
    }
    .cat-suggestions {
      padding: 4px 12px 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .cat-chip {
      --background: rgba(46,125,50,0.1);
      --color: var(--ion-color-primary);
      font-size: 0.8rem;
      height: 28px;
      cursor: pointer;
    }
    .meal-types {
      padding: 4px 16px 8px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
    }
    .meal-type-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 4px;
    }
    .meal-type-label {
      font-size: 0.875rem;
      color: #333;
    }
    .error-msg {
      padding: 8px 16px;
      font-size: 0.82rem;
      color: var(--ion-color-danger);
      font-weight: 500;
    }
    ion-footer {
      padding: 12px;
      background: white;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
    }
    .save-btn {
      --background: var(--ion-color-primary);
      --border-radius: 10px;
      font-weight: 700;
    }
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ ingredient ? 'Modifica Ingrediente' : 'Nuovo Ingrediente' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="form-section">
        <p class="section-label">Dati principali</p>
        <ion-list lines="inset">
          <ion-item>
            <ion-label position="stacked">Nome *</ion-label>
            <ion-input
              [(ngModel)]="form.name"
              placeholder="es. Pasta, Latte, Uova"
              clearInput>
            </ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Categoria</ion-label>
            <ion-input
              [(ngModel)]="form.category"
              placeholder="es. Cereali, Latticini, Verdure"
              clearInput>
            </ion-input>
          </ion-item>
        </ion-list>

        <!-- Category suggestions -->
        <div class="cat-suggestions" *ngIf="existingCategories.length > 0">
          <ion-chip
            class="cat-chip"
            *ngFor="let cat of existingCategories"
            (click)="selectCategory(cat)">
            {{ cat }}
          </ion-chip>
        </div>

        <ion-list lines="inset">
          <ion-item>
            <ion-label position="stacked">Unità di misura *</ion-label>
            <ion-select
              [(ngModel)]="form.defaultUnit"
              interface="action-sheet"
              [interfaceOptions]="{ header: 'Seleziona unità' }">
              <ion-select-option value="gr">Grammi (gr)</ion-select-option>
              <ion-select-option value="ml">Millilitri (ml)</ion-select-option>
              <ion-select-option value="unit">Pezzi (unit)</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Quantità default *</ion-label>
            <ion-input
              type="number"
              [(ngModel)]="form.defaultQty"
              placeholder="es. 100"
              min="0.1"
              step="any">
            </ion-input>
          </ion-item>
        </ion-list>
      </div>

      <div class="form-section">
        <p class="section-label">Tipologie di pasto</p>
        <p style="padding: 0 16px 4px; font-size: 0.8rem; color: var(--ion-color-medium);">
          Lascia tutto deselezionato per usare questo ingrediente in tutti i pasti.
        </p>
        <div class="meal-types">
          <div class="meal-type-row" *ngFor="let mt of allMealTypes">
            <ion-checkbox
              [checked]="isMealTypeSelected(mt)"
              (ionChange)="toggleMealType(mt, $event)"
              color="primary">
            </ion-checkbox>
            <span class="meal-type-label">{{ mealLabels[mt] }}</span>
          </div>
        </div>
      </div>

      <p class="error-msg" *ngIf="error">{{ error }}</p>
    </ion-content>

    <ion-footer>
      <ion-button expand="block" class="save-btn" (click)="save()" [disabled]="saving">
        {{ saving ? 'Salvataggio...' : (ingredient ? 'Salva modifiche' : 'Crea ingrediente') }}
      </ion-button>
    </ion-footer>
  `
})
export class IngredientFormComponent implements OnInit {
  @Input() ingredient?: Ingredient;
  @Input() existingCategories: string[] = [];

  form = {
    name: '',
    category: '',
    defaultUnit: 'gr' as Unit,
    defaultQty: 100,
    allowedMealTypes: [] as MealType[]
  };

  allMealTypes = ALL_MEAL_TYPES;
  mealLabels = MEAL_LABELS;
  error = '';
  saving = false;

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, checkmarkOutline });
  }

  ngOnInit() {
    if (this.ingredient) {
      this.form = {
        name: this.ingredient.name,
        category: this.ingredient.category || '',
        defaultUnit: this.ingredient.defaultUnit,
        defaultQty: Number(this.ingredient.defaultQty),
        allowedMealTypes: [...(this.ingredient.allowedMealTypes || [])]
      };
    }
  }

  selectCategory(cat: string) {
    this.form.category = cat;
  }

  isMealTypeSelected(mt: MealType): boolean {
    return this.form.allowedMealTypes.includes(mt);
  }

  toggleMealType(mt: MealType, event: CustomEvent) {
    const checked = (event as CustomEvent<{ checked: boolean }>).detail.checked;
    if (checked) {
      if (!this.form.allowedMealTypes.includes(mt)) {
        this.form.allowedMealTypes = [...this.form.allowedMealTypes, mt];
      }
    } else {
      this.form.allowedMealTypes = this.form.allowedMealTypes.filter(t => t !== mt);
    }
  }

  save() {
    this.error = '';
    if (!this.form.name?.trim()) { this.error = 'Il nome è obbligatorio'; return; }
    const qty = Number(this.form.defaultQty);
    if (isNaN(qty) || qty <= 0) { this.error = 'La quantità deve essere > 0'; return; }

    const result: Partial<Ingredient> = {
      name: this.form.name.trim(),
      category: this.form.category?.trim() || undefined,
      defaultUnit: this.form.defaultUnit,
      defaultQty: qty,
      allowedMealTypes: this.form.allowedMealTypes.length > 0 ? this.form.allowedMealTypes : undefined
    };

    this.modalCtrl.dismiss(result, 'save');
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
