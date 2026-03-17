import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonList, IonItem, IonLabel, IonIcon, IonSkeletonText,
  ModalController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, sunny, restaurant, cafe, iceCream, moon, fastFood } from 'ionicons/icons';
import { MenuService, WeeklyMenu, MealItem } from '../../features/menu/menu.service';
import { MealType } from '../../features/ingredients/ingredients.service';

const DAY_NAMES_SHORT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const DAY_NAMES_FULL = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

const MEAL_CONFIG: Record<MealType, { label: string; icon: string; color: string }> = {
  BREAKFAST:       { label: 'Colazione',    icon: 'cafe',       color: '#F57C00' },
  MORNING_SNACK:   { label: 'Spuntino',     icon: 'sunny',      color: '#FBC02D' },
  LUNCH:           { label: 'Pranzo',       icon: 'restaurant', color: '#2E7D32' },
  AFTERNOON_SNACK: { label: 'Merenda',      icon: 'ice-cream',  color: '#7B1FA2' },
  DINNER:          { label: 'Cena',         icon: 'moon',       color: '#1565C0' },
  NIGHT_SNACK:     { label: 'Spuntino sera',icon: 'fast-food',  color: '#546E7A' },
};
const ALL_MEAL_TYPES: MealType[] = ['BREAKFAST','MORNING_SNACK','LUNCH','AFTERNOON_SNACK','DINNER','NIGHT_SNACK'];

interface MealView { mealType: MealType; label: string; icon: string; color: string; items: MealItem[]; }
interface DayView { dayOfWeek: number; short: string; full: string; meals: MealView[]; isToday: boolean; }

@Component({
  selector: 'app-collaborator-menu',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonList, IonItem, IonLabel, IonIcon, IonSkeletonText
  ],
  styles: [`
    ion-toolbar { --background: var(--ion-color-primary); --color: white; }
    ion-title { color: white; font-size: 0.95rem; }
    ion-buttons ion-button { --color: white; }

    .day-selector-bar {
      background: var(--ion-color-primary);
      padding: 6px 8px 10px;
      display: flex;
      gap: 4px;
    }
    .day-pill {
      flex: 1;
      min-width: 40px;
      max-width: 58px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 4px;
      border-radius: 10px;
      cursor: pointer;
      background: rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.8);
      border: 2px solid transparent;
    }
    .day-pill.selected { background: white; color: var(--ion-color-primary); border-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .day-pill .day-abbr { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; }
    .day-pill .day-num { font-size: 1rem; font-weight: 700; line-height: 1.2; }
    .today-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--ion-color-secondary); margin-top: 2px; }

    .day-title { padding: 16px 16px 8px; font-size: 1.05rem; font-weight: 700; color: var(--ion-color-dark); }
    .readonly-badge { font-size: 0.7rem; background: rgba(245,124,0,0.12); color: #F57C00; border-radius: 6px; padding: 2px 8px; margin-left: 8px; font-weight: 600; }

    .meal-section { margin: 0 12px 12px; border-radius: 12px; background: white; box-shadow: var(--app-shadow); overflow: hidden; }
    .meal-header { display: flex; align-items: center; padding: 12px 14px; gap: 10px; border-bottom: 1px solid #f0f0f0; }
    .meal-icon-wrap { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .meal-icon-wrap ion-icon { font-size: 18px; color: white; }
    .meal-title { font-weight: 700; font-size: 0.95rem; flex: 1; color: #1a1a1a; }
    .meal-count { font-size: 0.75rem; color: var(--ion-color-medium); }

    .meal-item-row { --padding-start: 14px; --padding-end: 14px; --inner-padding-end: 0; --min-height: 44px; }
    .item-name { font-size: 0.9rem; color: #333; }
    .item-qty { display: inline-block; background: rgba(46,125,50,0.1); color: var(--ion-color-primary); border-radius: 6px; padding: 1px 8px; font-size: 0.78rem; font-weight: 600; margin-left: 6px; }

    .meal-empty { padding: 10px 14px; font-size: 0.82rem; color: var(--ion-color-medium); font-style: italic; }

    .skeleton-wrap { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
    .skeleton-card { height: 80px; border-radius: 12px; }

    .error-state { padding: 48px 24px; text-align: center; color: var(--ion-color-medium); }
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Menù di {{ collaboratorEmail }}</ion-title>
      </ion-toolbar>
      <div class="day-selector-bar" *ngIf="!loading && !error">
        <div
          *ngFor="let day of days"
          class="day-pill"
          [class.selected]="selectedDow === day.dayOfWeek"
          (click)="selectedDow = day.dayOfWeek">
          <span class="day-abbr">{{ day.short }}</span>
          <span class="day-num">{{ getDayNumber(day.dayOfWeek) }}</span>
          <div class="today-dot" *ngIf="day.isToday"></div>
        </div>
      </div>
    </ion-header>

    <ion-content>
      <!-- Skeleton -->
      <ng-container *ngIf="loading">
        <div class="skeleton-wrap">
          <ion-skeleton-text animated class="skeleton-card" style="margin-top:8px"></ion-skeleton-text>
          <ion-skeleton-text animated class="skeleton-card"></ion-skeleton-text>
          <ion-skeleton-text animated class="skeleton-card"></ion-skeleton-text>
        </div>
      </ng-container>

      <!-- Error -->
      <div class="error-state" *ngIf="!loading && error">
        <p>Impossibile caricare il menù del collaboratore.</p>
      </div>

      <!-- Day content -->
      <ng-container *ngIf="!loading && !error && selectedDay">
        <div class="day-title">
          {{ selectedDay.full }}
          <span class="readonly-badge" *ngIf="selectedDay.isToday">Oggi</span>
        </div>

        <div *ngFor="let meal of selectedDay.meals" class="meal-section">
          <div class="meal-header">
            <div class="meal-icon-wrap" [style.background]="meal.color">
              <ion-icon [name]="meal.icon"></ion-icon>
            </div>
            <span class="meal-title">{{ meal.label }}</span>
            <span class="meal-count" *ngIf="meal.items.length > 0">{{ meal.items.length }} alim.</span>
          </div>

          <ion-list lines="inset" *ngIf="meal.items.length > 0">
            <ion-item class="meal-item-row" *ngFor="let item of meal.items">
              <ion-label>
                <span class="item-name">{{ item.ingredient?.name ?? item.ingredientName ?? '—' }}</span>
                <span class="item-qty">{{ item.quantity }} {{ item.unit }}</span>
              </ion-label>
            </ion-item>
          </ion-list>

          <p class="meal-empty" *ngIf="meal.items.length === 0">Nessun alimento pianificato</p>
        </div>
      </ng-container>
    </ion-content>
  `
})
export class CollaboratorMenuComponent implements OnInit {
  @Input() collaboratorId!: string;
  @Input() collaboratorEmail = '';

  days: DayView[] = [];
  selectedDow = 1;
  loading = true;
  error = false;

  private weekStartDate = new Date();

  get selectedDay(): DayView | undefined {
    return this.days.find(d => d.dayOfWeek === this.selectedDow);
  }

  constructor(
    private menuService: MenuService,
    private modalCtrl: ModalController
  ) {
    addIcons({ closeOutline, sunny, restaurant, cafe, iceCream, moon, fastFood });
  }

  ngOnInit() {
    this.initWeekStart();
    this.initDays();
    const todayDay = this.days.find(d => d.isToday);
    if (todayDay) this.selectedDow = todayDay.dayOfWeek;
    this.loadMenu();
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

  getDayNumber(dow: number): string {
    const date = new Date(this.weekStartDate);
    date.setDate(this.weekStartDate.getDate() + (dow - 1));
    return String(date.getDate());
  }

  private loadMenu() {
    this.loading = true;
    this.error = false;
    this.menuService.getCollaboratorMenu(this.collaboratorId).subscribe({
      next: (menu: WeeklyMenu) => {
        this.applyMenu(menu);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  private applyMenu(menu: WeeklyMenu) {
    for (const day of this.days) {
      const dayData = menu.days?.find((d: any) => d.dayOfWeek === day.dayOfWeek);
      for (const meal of day.meals) {
        const mealData = dayData?.meals?.find((m: any) => m.mealType === meal.mealType);
        meal.items = mealData?.items ?? [];
      }
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
