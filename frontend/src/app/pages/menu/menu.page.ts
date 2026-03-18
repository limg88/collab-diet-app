import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonChip,
  IonSkeletonText,
  ModalController, ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trashOutline, logOutOutline, keyOutline, sunny, restaurant, cafe, iceCream, moon, fastFood } from 'ionicons/icons';
import { MenuService, WeeklyMenu, MealItem } from '../../features/menu/menu.service';
import { IngredientsService, Ingredient, MealType } from '../../features/ingredients/ingredients.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { IngredientPickerComponent } from '../../shared/ingredient-picker/ingredient-picker.component';
import { ChangePasswordModalComponent } from '../../shared/change-password-modal/change-password-modal.component';

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
    IonIcon, IonChip,
    IonSkeletonText,
    IngredientPickerComponent, ChangePasswordModalComponent
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

    /* ── Day title bar ── */
    .day-title-row {
      display: flex;
      align-items: center;
      padding: 14px 16px 8px;
      gap: 8px;
    }
    .day-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--ion-color-dark);
    }
    .day-date-label {
      font-size: 0.88rem;
      font-weight: 400;
      color: var(--ion-color-medium);
    }
    .today-badge {
      font-size: 0.72rem;
      background: rgba(245,124,0,0.12);
      color: #F57C00;
      border-radius: 6px;
      padding: 2px 8px;
      font-weight: 700;
    }
    .day-title-spacer { flex: 1; }
    .meals-counter {
      font-size: 0.73rem;
      color: var(--ion-color-medium);
      font-weight: 600;
    }
    .compact-chip {
      --background: rgba(46,125,50,0.08);
      --color: var(--ion-color-primary);
      height: 24px;
      font-size: 0.7rem;
      font-weight: 700;
      margin: 0;
      cursor: pointer;
    }

    /* ── Meal section ── */
    .meal-section {
      margin: 0 12px 10px;
      border-radius: var(--app-border-radius);
      background: var(--ion-card-background);
      box-shadow: var(--app-shadow);
      overflow: hidden;
      border-left: 4px solid transparent;
    }
    .meal-header {
      display: flex;
      align-items: center;
      padding: 10px 12px 10px 12px;
      gap: 10px;
    }
    .meal-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .meal-icon-wrap ion-icon {
      font-size: 17px;
      color: white;
    }
    .meal-title {
      font-weight: 700;
      font-size: 0.92rem;
      flex: 1;
      color: var(--ion-text-color);
    }
    .meal-count-badge {
      font-size: 0.7rem;
      font-weight: 700;
      background: rgba(0,0,0,0.06);
      color: var(--ion-color-medium);
      border-radius: 20px;
      padding: 1px 7px;
    }
    .add-btn {
      --padding-start: 6px;
      --padding-end: 6px;
      height: 30px;
    }

    /* ── Meal items ── */
    .meal-items-list {
      border-top: 1px solid var(--ion-border-color);
    }
    .menu-item-row {
      display: flex;
      align-items: center;
      padding: 9px 10px 9px 14px;
      gap: 8px;
      border-bottom: 1px solid var(--ion-border-color);
    }
    .menu-item-row:last-child { border-bottom: none; }
    .item-name {
      flex: 1;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--ion-text-color);
      min-width: 0;
    }
    .item-qty {
      font-size: 0.76rem;
      font-weight: 700;
      background: rgba(46,125,50,0.09);
      color: var(--ion-color-primary);
      border-radius: 20px;
      padding: 2px 9px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .item-del-btn {
      --padding-start: 4px;
      --padding-end: 4px;
      height: 28px;
      flex-shrink: 0;
      opacity: 0.25;
      transition: opacity 0.15s;
    }
    .menu-item-row:hover .item-del-btn,
    .item-del-btn:focus,
    .item-del-btn:active {
      opacity: 1;
    }

    .meal-empty {
      padding: 10px 14px;
      font-size: 0.8rem;
      color: var(--ion-color-medium);
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
          <ion-button (click)="openChangePassword()" fill="clear" style="--color:rgba(255,255,255,0.6); --padding-start:8px; --padding-end:8px;" title="Cambia password">
            <ion-icon name="key-outline" slot="icon-only" style="font-size:18px;"></ion-icon>
          </ion-button>
          <ion-button (click)="logout()" fill="clear" style="--color:rgba(255,255,255,0.6); --padding-start:8px; --padding-end:8px;" title="Esci dall'account">
            <ion-icon name="log-out-outline" slot="icon-only" style="font-size:18px;"></ion-icon>
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
        <div class="day-title-row">
          <span class="day-name">{{ selectedDay.full }}</span>
          <span class="day-date-label">{{ getDayShortDate(selectedDay.dayOfWeek) }}</span>
          <span class="today-badge" *ngIf="selectedDay.isToday">Oggi</span>
          <span class="day-title-spacer"></span>
          <span class="meals-counter">{{ visibleMealsCount }} pasti</span>
          <ion-chip
            class="compact-chip"
            [title]="hideEmptyMeals ? 'Mostra tutti i pasti, anche quelli vuoti' : 'Mostra solo i pasti pianificati'"
            (click)="hideEmptyMeals = !hideEmptyMeals">
            {{ hideEmptyMeals ? 'Mostra vuoti' : 'Nascondi vuoti' }}
          </ion-chip>
        </div>

        <ng-container *ngFor="let meal of selectedDay.meals">
          <div class="meal-section" [style.border-left-color]="meal.color" *ngIf="!hideEmptyMeals || meal.items.length > 0">
            <div class="meal-header">
              <div class="meal-icon-wrap" [style.background]="meal.color">
                <ion-icon [name]="meal.icon"></ion-icon>
              </div>
              <span class="meal-title">{{ meal.label }}</span>
              <span class="meal-count-badge" *ngIf="meal.items.length > 0">{{ meal.items.length }}</span>
              <ion-button
                class="add-btn"
                fill="clear"
                color="primary"
                size="small"
                (click)="openAddItem(selectedDay.dayOfWeek, meal.mealType)">
                <ion-icon name="add" slot="icon-only"></ion-icon>
              </ion-button>
            </div>

            <div class="meal-items-list" *ngIf="meal.items.length > 0">
              <div class="menu-item-row" *ngFor="let item of meal.items">
                <span class="item-name">{{ item.ingredient?.name ?? item.ingredientName ?? '—' }}</span>
                <span class="item-qty">{{ item.quantity }} {{ item.unit }}</span>
                <ion-button class="item-del-btn" fill="clear" color="danger" size="small" (click)="removeItem(item.id)">
                  <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
            </div>

            <p class="meal-empty" *ngIf="meal.items.length === 0">Nessun alimento pianificato</p>
          </div>
        </ng-container>
      </ng-container>
    </ion-content>
  `
})
export class MenuPage implements OnInit {
  days: DayView[] = [];
  selectedDow = 1;
  loading = true;
  addingItem = false;
  hideEmptyMeals = true;
  ingredients: Ingredient[] = [];
  private menu: WeeklyMenu | null = null;
  private weekStartDate = new Date();

  get selectedDay(): DayView | undefined {
    return this.days.find(d => d.dayOfWeek === this.selectedDow);
  }

  get visibleMealsCount(): number {
    return this.selectedDay?.meals.filter(m => m.items.length > 0).length ?? 0;
  }

  constructor(
    private menuService: MenuService,
    private ingredientsService: IngredientsService,
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ add, trashOutline, logOutOutline, keyOutline, sunny, restaurant, cafe, iceCream, moon, fastFood });
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

  getDayShortDate(dow: number): string {
    const date = new Date(this.weekStartDate);
    date.setDate(this.weekStartDate.getDate() + (dow - 1));
    const months = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
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
      const alert = await this.alertCtrl.create({
        header: 'Nessun ingrediente',
        message: 'Aggiungi prima gli ingredienti per poter pianificare i pasti.',
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Vai agli ingredienti',
            handler: () => { this.router.navigateByUrl('/ingredients'); }
          }
        ]
      });
      await alert.present();
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
        this.showToast('✅ Aggiunto: ' + (this.ingredients.find(i => i.id === ingredientId)?.name ?? ''), 'success');
      },
      error: async (e) => {
        this.addingItem = false;
        await this.showToast(e.error?.message || 'Errore aggiungendo alimento', 'danger');
      }
    });
  }

  async removeItem(itemId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Rimuovi alimento',
      message: 'Rimuovere questo alimento dal pasto?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Rimuovi',
          role: 'destructive',
          handler: () => {
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
        }
      ]
    });
    await alert.present();
  }

  async openChangePassword() {
    const modal = await this.modalCtrl.create({ component: ChangePasswordModalComponent });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'saved') {
      await this.showToast('Password aggiornata con successo', 'success');
    }
  }

  logout() { this.authService.logout(); }

  private async showToast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, color, position: 'top' });
    await t.present();
  }
}
