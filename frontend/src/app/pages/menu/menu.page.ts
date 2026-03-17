import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonList, IonItem, IonLabel, IonIcon, IonChip, IonBadge,
  IonSkeletonText, IonNote,
  ModalController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trashOutline, logOutOutline, sunny, restaurant, cafe, iceCream, moon, fastFood } from 'ionicons/icons';
import { MenuService, WeeklyMenu, MealItem } from '../../features/menu/menu.service';
import { IngredientsService, Ingredient, MealType } from '../../features/ingredients/ingredients.service';
import { AuthService } from '../../core/services/auth.service';
import { IngredientPickerComponent } from '../../shared/ingredient-picker/ingredient-picker.component';

const DAY_NAMES_SHORT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const DAY_NAMES_FULL = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

const MEAL_CONFIG: Record<MealType, { label: string; icon: string; color: string }> = {
  BREAKFAST:        { label: 'Colazione',       icon: 'cafe',       color: '#F57C00' },
  MORNING_SNACK:    { label: 'Spuntino',         icon: 'sunny',      color: '#FBC02D' },
  LUNCH:            { label: 'Pranzo',           icon: 'restaurant', color: '#2E7D32' },
  AFTERNOON_SNACK:  { label: 'Merenda',          icon: 'ice-cream',  color: '#7B1FA2' },
  DINNER:           { label: 'Cena',             icon: 'moon',       color: '#1565C0' },
  NIGHT_SNACK:      { label: 'Spuntino sera',    icon: 'fast-food',  color: '#546E7A' },
};
const ALL_MEAL_TYPES: MealType[] = ['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER', 'NIGHT_SNACK'];

interface MealView { mealType: MealType; label: string; icon: string; color: string; items: MealItem[]; }
interface DayView { dayOfWeek: number; short: string; full: string; meals: MealView[]; isToday: boolean; }

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonList, IonItem, IonLabel, IonIcon, IonChip, IonBadge,
    IonSkeletonText, IonNote,
    IngredientPickerComponent
  ],
  styles: [`
    .day-selector-bar {
      background: var(--ion-color-primary);
      padding: 6px 8px 10px;
      overflow-x: auto;
      overflow-y: hidden;
      display: flex;
      gap: 4px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
    }
    .day-selector-bar::-webkit-scrollbar { display: none; }

    .day-pill {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      min-width: 40px;
      max-width: 58px;
      padding: 6px 4px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.8);
      border: 2px solid transparent;
    }
    .day-pill.selected {
      background: white;
      color: var(--ion-color-primary);
      border-color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .day-pill .day-abbr {
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .day-pill .day-num {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.2;
    }
    .today-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--ion-color-secondary);
      margin-top: 2px;
    }
    .day-pill.selected .today-dot {
      background: var(--ion-color-secondary);
    }

    .day-title {
      padding: 16px 16px 8px;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--ion-color-dark);
    }

    .meal-section {
      margin: 0 12px 12px;
      border-radius: var(--app-border-radius);
      background: white;
      box-shadow: var(--app-shadow);
      overflow: hidden;
    }
    .meal-header {
      display: flex;
      align-items: center;
      padding: 12px 14px;
      gap: 10px;
      border-bottom: 1px solid #f0f0f0;
    }
    .meal-icon-wrap {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .meal-icon-wrap ion-icon {
      font-size: 18px;
      color: white;
    }
    .meal-title {
      font-weight: 700;
      font-size: 0.95rem;
      flex: 1;
      color: #1a1a1a;
    }
    .meal-count {
      font-size: 0.75rem;
      color: var(--ion-color-medium);
      margin-right: 4px;
    }
    .add-btn {
      --padding-start: 6px;
      --padding-end: 6px;
      height: 30px;
    }

    .meal-items-list {
      padding: 0;
    }
    .meal-item-row {
      --padding-start: 14px;
      --padding-end: 10px;
      --inner-padding-end: 0;
      --min-height: 44px;
    }
    .item-name {
      font-size: 0.9rem;
      color: #333;
    }
    .item-qty {
      display: inline-block;
      background: rgba(46,125,50,0.1);
      color: var(--ion-color-primary);
      border-radius: 6px;
      padding: 1px 8px;
      font-size: 0.78rem;
      font-weight: 600;
      margin-left: 6px;
    }

    .meal-empty {
      padding: 10px 14px;
      font-size: 0.82rem;
      color: var(--ion-color-medium);
      font-style: italic;
    }

    .skeleton-day {
      padding: 0 12px;
    }
    .skeleton-card {
      height: 80px;
      border-radius: 12px;
      margin-bottom: 12px;
    }
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Menù Settimanale</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()" fill="clear" style="--color:white">
            <ion-icon name="log-out-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <!-- Day selector -->
      <div class="day-selector-bar">
        <div
          *ngFor="let day of days"
          class="day-pill"
          [class.selected]="selectedDow === day.dayOfWeek"
          (click)="selectDay(day.dayOfWeek)">
          <span class="day-abbr">{{ day.short }}</span>
          <span class="day-num">{{ getDayNumber(day.dayOfWeek) }}</span>
          <div class="today-dot" *ngIf="day.isToday"></div>
        </div>
      </div>
    </ion-header>

    <ion-content>
      <!-- Loading skeletons -->
      <ng-container *ngIf="loading">
        <div class="skeleton-day">
          <ion-skeleton-text animated class="skeleton-card" style="margin-top:16px"></ion-skeleton-text>
          <ion-skeleton-text animated class="skeleton-card"></ion-skeleton-text>
          <ion-skeleton-text animated class="skeleton-card"></ion-skeleton-text>
        </div>
      </ng-container>

      <!-- Day content -->
      <ng-container *ngIf="!loading && selectedDay">
        <div class="day-title">
          {{ selectedDay.full }}
          <span *ngIf="selectedDay.isToday" style="font-size:0.75rem; background: rgba(245,124,0,0.12); color:#F57C00; border-radius:6px; padding:2px 8px; margin-left:8px; font-weight:600;">Oggi</span>
        </div>

        <div *ngFor="let meal of selectedDay.meals" class="meal-section">
          <div class="meal-header">
            <div class="meal-icon-wrap" [style.background]="meal.color">
              <ion-icon [name]="meal.icon"></ion-icon>
            </div>
            <span class="meal-title">{{ meal.label }}</span>
            <span class="meal-count" *ngIf="meal.items.length > 0">{{ meal.items.length }} alim.</span>
            <ion-button
              class="add-btn"
              fill="clear"
              color="primary"
              size="small"
              (click)="openAddItem(selectedDay.dayOfWeek, meal.mealType)">
              <ion-icon name="add" slot="icon-only"></ion-icon>
            </ion-button>
          </div>

          <ion-list class="meal-items-list" lines="inset" *ngIf="meal.items.length > 0">
            <ion-item class="meal-item-row" *ngFor="let item of meal.items">
              <ion-label>
                <span class="item-name">{{ item.ingredient?.name ?? item.ingredientName ?? '—' }}</span>
                <span class="item-qty">{{ item.quantity }} {{ item.unit }}</span>
              </ion-label>
              <ion-button slot="end" fill="clear" color="danger" size="small" (click)="removeItem(item.id)">
                <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>

          <p class="meal-empty" *ngIf="meal.items.length === 0">Nessun alimento pianificato</p>
        </div>
      </ng-container>
    </ion-content>
  `
})
export class MenuPage implements OnInit {
  days: DayView[] = [];
  selectedDow = 1;
  loading = true;
  addingItem = false;
  ingredients: Ingredient[] = [];
  private menu: WeeklyMenu | null = null;
  private weekStartDate = new Date();

  get selectedDay(): DayView | undefined {
    return this.days.find(d => d.dayOfWeek === this.selectedDow);
  }

  constructor(
    private menuService: MenuService,
    private ingredientsService: IngredientsService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, trashOutline, logOutOutline, sunny, restaurant, cafe, iceCream, moon, fastFood });
  }

  ngOnInit() {
    this.initWeekStart();
    this.initDays();
    this.setTodaySelected();
    this.loadData();
  }

  ionViewWillEnter() {
    if (!this.loading) {
      Promise.all([this.loadMenu(), this.loadIngredients()]);
    }
  }

  private initWeekStart() {
    const now = new Date();
    const dow = now.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    this.weekStartDate = new Date(now);
    this.weekStartDate.setDate(now.getDate() + diff);
  }

  private initDays() {
    this.days = DAY_NAMES_SHORT.map((short, i) => {
      const date = new Date(this.weekStartDate);
      date.setDate(this.weekStartDate.getDate() + i);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      return {
        dayOfWeek: i + 1,
        short,
        full: DAY_NAMES_FULL[i],
        isToday,
        meals: ALL_MEAL_TYPES.map(mt => ({
          mealType: mt,
          label: MEAL_CONFIG[mt].label,
          icon: MEAL_CONFIG[mt].icon,
          color: MEAL_CONFIG[mt].color,
          items: []
        }))
      };
    });
  }

  private setTodaySelected() {
    const todayDay = this.days.find(d => d.isToday);
    if (todayDay) this.selectedDow = todayDay.dayOfWeek;
  }

  getDayNumber(dow: number): string {
    const date = new Date(this.weekStartDate);
    date.setDate(this.weekStartDate.getDate() + (dow - 1));
    return String(date.getDate());
  }

  selectDay(dow: number) { this.selectedDow = dow; }

  async loadData() {
    this.loading = true;
    await Promise.all([this.loadMenu(), this.loadIngredients()]);
    this.loading = false;
  }

  private loadMenu(): Promise<void> {
    return new Promise((resolve) => {
      this.menuService.getCurrentMenu().subscribe({
        next: (m) => { this.menu = m; this.applyMenuToViews(m); resolve(); },
        error: () => resolve()
      });
    });
  }

  private loadIngredients(): Promise<void> {
    return new Promise((resolve) => {
      this.ingredientsService.list().subscribe({
        next: (list) => { this.ingredients = list.filter(i => !i.isDeleted); resolve(); },
        error: () => resolve()
      });
    });
  }

  private applyMenuToViews(menu: WeeklyMenu) {
    for (const day of this.days) {
      const dayData = menu.days?.find(d => d.dayOfWeek === day.dayOfWeek);
      for (const meal of day.meals) {
        const mealData = dayData?.meals?.find(m => m.mealType === meal.mealType);
        meal.items = mealData?.items ?? [];
      }
    }
  }

  async openAddItem(dayOfWeek: number, mealType: MealType) {
    if (this.ingredients.length === 0) {
      const toast = await this.toastCtrl.create({
        message: '🌿 Aggiungi prima degli ingredienti nella sezione "Ingredienti"',
        duration: 3000, color: 'warning', position: 'top'
      });
      await toast.present();
      return;
    }

    const modal = await this.modalCtrl.create({
      component: IngredientPickerComponent,
      componentProps: {
        ingredients: this.ingredients,
        mealLabel: `Aggiungi a ${MEAL_CONFIG[mealType].label}`,
        mealType
      },
      breakpoints: [0, 0.6, 0.9],
      initialBreakpoint: 0.9,
      handleBehavior: 'cycle'
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss<{ ingredient: Ingredient; quantity: number }>();

    if (role === 'selected' && data) {
      this.addItem(dayOfWeek, mealType, data.ingredient.id, data.quantity, data.ingredient.defaultUnit);
    }
  }

  addItem(dayOfWeek: number, mealType: MealType, ingredientId: string, quantity: number, unit: string) {
    this.addingItem = true;
    this.menuService.addItem({ dayOfWeek, mealType, ingredientId, quantity, unit: unit as any }).subscribe({
      next: (item) => {
        this.addingItem = false;
        const ing = this.ingredients.find(i => i.id === ingredientId);
        const enriched = { ...item, ingredient: ing ? { id: ing.id, name: ing.name, defaultUnit: ing.defaultUnit, defaultQty: ing.defaultQty } : undefined };
        const day = this.days.find(d => d.dayOfWeek === dayOfWeek);
        const meal = day?.meals.find(m => m.mealType === mealType);
        if (meal) meal.items = [...meal.items, enriched];
        this.showToast('✅ Aggiunto al pasto', 'success');
      },
      error: async (e) => {
        this.addingItem = false;
        await this.showToast(e.error?.message || 'Errore aggiungendo alimento', 'danger');
      }
    });
  }

  removeItem(itemId: string) {
    this.menuService.removeItem(itemId).subscribe({
      next: () => {
        for (const day of this.days)
          for (const meal of day.meals) {
            const idx = meal.items.findIndex(i => i.id === itemId);
            if (idx !== -1) { meal.items = meal.items.filter(i => i.id !== itemId); return; }
          }
      },
      error: async (e) => { await this.showToast(e.error?.message || 'Errore', 'danger'); }
    });
  }

  logout() { this.authService.logout(); }

  private async showToast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, color, position: 'top' });
    await t.present();
  }
}
