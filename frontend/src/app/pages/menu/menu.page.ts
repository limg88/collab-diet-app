import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonList, IonItem, IonLabel, IonIcon, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent,
  AlertController, LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, logOut } from 'ionicons/icons';
import { MenuService, WeeklyMenu, MealItem } from '../../features/menu/menu.service';
import { IngredientsService, Ingredient, MealType } from '../../features/ingredients/ingredients.service';
import { AuthService } from '../../core/services/auth.service';

const DAY_NAMES = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: 'Colazione',
  MORNING_SNACK: 'Spuntino mattina',
  LUNCH: 'Pranzo',
  AFTERNOON_SNACK: 'Merenda',
  DINNER: 'Cena',
  NIGHT_SNACK: 'Spuntino sera'
};
const ALL_MEAL_TYPES: MealType[] = ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER', 'NIGHT_SNACK'];

interface DayView {
  dayOfWeek: number;
  name: string;
  meals: MealView[];
}

interface MealView {
  mealType: MealType;
  label: string;
  items: MealItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonList, IonItem, IonLabel, IonIcon, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Menù Settimanale</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()" fill="clear">
            <ion-icon name="log-out" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div *ngFor="let day of days" class="ion-margin-bottom">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ day.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div *ngFor="let meal of day.meals" class="meal-slot ion-margin-bottom">
              <div class="meal-header">
                <strong>{{ meal.label }}</strong>
                <ion-button size="small" fill="outline" (click)="openAddItem(day.dayOfWeek, meal.mealType)">
                  <ion-icon name="add" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
              <ion-list *ngIf="meal.items.length > 0" lines="none">
                <ion-item *ngFor="let item of meal.items">
                  <ion-label>
                    {{ item.ingredientName }} — {{ item.quantity }} {{ item.unit }}
                  </ion-label>
                  <ion-button slot="end" fill="clear" color="danger" (click)="removeItem(item.id)">
                    <ion-icon name="trash" slot="icon-only"></ion-icon>
                  </ion-button>
                </ion-item>
              </ion-list>
              <p *ngIf="meal.items.length === 0" class="ion-padding-start" style="color: var(--ion-color-medium); font-size: 0.85em;">
                Nessun alimento
              </p>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .meal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
      border-bottom: 1px solid var(--ion-color-light);
      margin-bottom: 4px;
    }
  `]
})
export class MenuPage implements OnInit {
  days: DayView[] = [];
  ingredients: Ingredient[] = [];
  private menu: WeeklyMenu | null = null;

  constructor(
    private menuService: MenuService,
    private ingredientsService: IngredientsService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, trash, logOut });
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const loading = await this.loadingCtrl.create({ message: 'Caricamento...' });
    await loading.present();
    try {
      await Promise.all([
        this.loadMenu(),
        this.loadIngredients()
      ]);
    } finally {
      await loading.dismiss();
    }
  }

  private loadMenu(): Promise<void> {
    return new Promise((resolve) => {
      this.menuService.getCurrentMenu().subscribe({
        next: (menu) => {
          this.menu = menu;
          this.buildDayViews(menu);
          resolve();
        },
        error: () => {
          this.buildEmptyDayViews();
          resolve();
        }
      });
    });
  }

  private loadIngredients(): Promise<void> {
    return new Promise((resolve) => {
      this.ingredientsService.list().subscribe({
        next: (list) => {
          this.ingredients = list.filter(i => !i.isDeleted);
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  private buildDayViews(menu: WeeklyMenu) {
    this.days = DAY_NAMES.map((name, idx) => {
      const dow = idx + 1;
      const dayData = menu.days?.find(d => d.dayOfWeek === dow);
      return {
        dayOfWeek: dow,
        name,
        meals: ALL_MEAL_TYPES.map(mt => {
          const mealData = dayData?.meals?.find(m => m.mealType === mt);
          return {
            mealType: mt,
            label: MEAL_LABELS[mt],
            items: mealData?.items ?? []
          };
        })
      };
    });
  }

  private buildEmptyDayViews() {
    this.days = DAY_NAMES.map((name, idx) => ({
      dayOfWeek: idx + 1,
      name,
      meals: ALL_MEAL_TYPES.map(mt => ({
        mealType: mt,
        label: MEAL_LABELS[mt],
        items: []
      }))
    }));
  }

  async openAddItem(dayOfWeek: number, mealType: MealType) {
    if (this.ingredients.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Aggiungi prima degli ingredienti',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const ingredientInputs = this.ingredients.map(ing => ({
      type: 'radio' as const,
      label: `${ing.name} (${ing.defaultUnit})`,
      value: ing.id
    }));

    const alert = await this.alertCtrl.create({
      header: 'Aggiungi alimento',
      inputs: [
        ...ingredientInputs,
        {
          type: 'number',
          name: 'quantity',
          placeholder: 'Quantità',
          min: 1
        }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Aggiungi',
          handler: (data) => {
            const ingredientId = data as string;
            const ing = this.ingredients.find(i => i.id === ingredientId);
            if (!ingredientId || !ing) return false;
            this.addItem(dayOfWeek, mealType, ingredientId, ing.defaultQty, ing.defaultUnit);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  addItem(dayOfWeek: number, mealType: MealType, ingredientId: string, quantity: number, unit: string) {
    this.menuService.addItem({
      dayOfWeek,
      mealType,
      ingredientId,
      quantity,
      unit: unit as 'gr' | 'ml' | 'unit'
    }).subscribe({
      next: (item) => {
        const day = this.days.find(d => d.dayOfWeek === dayOfWeek);
        if (day) {
          const meal = day.meals.find(m => m.mealType === mealType);
          if (meal) {
            meal.items = [...meal.items, item];
          }
        }
      },
      error: async (e) => {
        const toast = await this.toastCtrl.create({
          message: e.error?.message || 'Errore aggiungendo alimento',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  removeItem(itemId: string) {
    this.menuService.removeItem(itemId).subscribe({
      next: () => {
        for (const day of this.days) {
          for (const meal of day.meals) {
            const idx = meal.items.findIndex(i => i.id === itemId);
            if (idx !== -1) {
              meal.items = meal.items.filter(i => i.id !== itemId);
              return;
            }
          }
        }
      },
      error: async (e) => {
        const toast = await this.toastCtrl.create({
          message: e.error?.message || 'Errore eliminando alimento',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
