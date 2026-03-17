import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonBadge,
  IonFab, IonFabButton, IonSkeletonText, IonChip,
  AlertController, ModalController, ToastController, ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, pencilOutline, trashOutline, nutritionOutline } from 'ionicons/icons';
import { IngredientsService, Ingredient, Unit } from '../../features/ingredients/ingredients.service';
import { IngredientFormComponent } from '../../shared/ingredient-form/ingredient-form.component';

const UNIT_COLORS: Record<Unit, string> = {
  gr: '#2E7D32',
  ml: '#1565C0',
  unit: '#7B1FA2'
};

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonBadge,
    IonFab, IonFabButton, IonSkeletonText, IonChip,
    IngredientFormComponent
  ],
  styles: [`
    .count-line {
      padding: 4px 16px 8px;
      font-size: 0.8rem;
      color: var(--ion-color-medium);
    }
    .ing-item {
      --padding-start: 16px;
      --padding-end: 8px;
      --inner-padding-end: 0;
      --border-radius: 0;
      --background: white;
    }
    .ing-name {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--ion-text-color);
    }
    .ing-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 3px;
    }
    .unit-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      color: white;
    }
    .qty-text {
      font-size: 0.82rem;
      color: var(--ion-color-medium);
    }
    .cat-text {
      font-size: 0.78rem;
      color: var(--ion-color-medium);
      background: rgba(0,0,0,0.05);
      padding: 2px 7px;
      border-radius: 5px;
    }
    .action-btns {
      display: flex;
      gap: 0;
    }
    ion-list {
      background: transparent;
      padding: 0;
    }
    ion-list ion-item:first-child {
      border-radius: 12px 12px 0 0;
    }
    ion-list ion-item:last-child {
      border-radius: 0 0 12px 12px;
    }
    ion-list ion-item:only-child {
      border-radius: 12px;
    }
    .list-wrapper {
      margin: 0 12px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--app-shadow);
    }
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Ingredienti</ion-title>
      </ion-toolbar>
      <ion-toolbar style="--background: var(--ion-color-primary);">
        <ion-searchbar
          placeholder="Cerca ingrediente..."
          [(ngModel)]="searchQuery"
          (ionInput)="filterIngredients()"
          style="--background: rgba(255,255,255,0.15); --color: white; --placeholder-color: rgba(255,255,255,0.7); --icon-color: rgba(255,255,255,0.8); --border-radius: 10px;">
        </ion-searchbar>
      </ion-toolbar>
      <!-- Filter chips bar -->
      <ion-toolbar style="--background: #f5f5f5; --border-width: 0; min-height: unset;" *ngIf="!loading">
        <div style="display: flex; gap: 6px; padding: 6px 12px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
          <!-- Unit filters -->
          <ion-chip
            *ngFor="let u of ['gr', 'ml', 'unit']"
            [style.--background]="activeUnitFilter === u ? getUnitColor(u) : 'rgba(0,0,0,0.07)'"
            [style.--color]="activeUnitFilter === u ? 'white' : '#555'"
            style="font-size: 0.78rem; height: 28px; flex-shrink: 0;"
            (click)="setUnitFilter(u)">
            {{ u }}
          </ion-chip>
          <!-- Category filter chip -->
          <ion-chip
            *ngIf="existingCategories.length > 0"
            [style.--background]="activeCategoryFilter ? 'var(--ion-color-secondary)' : 'rgba(0,0,0,0.07)'"
            [style.--color]="activeCategoryFilter ? 'white' : '#555'"
            style="font-size: 0.78rem; height: 28px; flex-shrink: 0;"
            (click)="openCategorySheet()">
            {{ activeCategoryFilter ? activeCategoryFilter : 'Categoria ▾' }}
          </ion-chip>
          <!-- Clear filters -->
          <ion-chip
            *ngIf="hasActiveFilters"
            style="--background: rgba(211,47,47,0.1); --color: var(--ion-color-danger); font-size: 0.78rem; height: 28px; flex-shrink: 0;"
            (click)="clearFilters()">
            ✕ Reset
          </ion-chip>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <p class="count-line" *ngIf="!loading">
        {{ filtered.length }} ingredient{{ filtered.length !== 1 ? 'i' : 'e' }}
      </p>

      <!-- Skeleton -->
      <ng-container *ngIf="loading">
        <div style="margin: 8px 12px; display: flex; flex-direction: column; gap: 1px; border-radius: 12px; overflow: hidden;">
          <ion-skeleton-text animated style="height:60px; margin:0;" *ngFor="let x of [1,2,3,4,5]"></ion-skeleton-text>
        </div>
      </ng-container>

      <!-- List -->
      <div class="list-wrapper" *ngIf="!loading && filtered.length > 0">
        <ion-list lines="inset">
          <ion-item class="ing-item" *ngFor="let ing of filtered">
            <ion-label>
              <div class="ing-name">{{ ing.name }}</div>
              <div class="ing-meta">
                <span class="unit-badge" [style.background]="getUnitColor(ing.defaultUnit)">{{ ing.defaultUnit }}</span>
                <span class="qty-text">{{ ing.defaultQty }}</span>
                <span class="cat-text" *ngIf="ing.category">{{ ing.category }}</span>
              </div>
            </ion-label>
            <div slot="end" class="action-btns">
              <ion-button fill="clear" color="primary" size="small" (click)="editIngredient(ing)">
                <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
              </ion-button>
              <ion-button fill="clear" color="danger" size="small" (click)="deleteIngredient(ing.id)">
                <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </div>
          </ion-item>
        </ion-list>
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading && ingredients.length === 0">
        <ion-icon name="nutrition-outline" class="empty-icon"></ion-icon>
        <h3>Nessun ingrediente</h3>
        <p>Aggiungi i tuoi ingredienti preferiti per iniziare a pianificare i pasti.</p>
      </div>
      <div class="empty-state" *ngIf="!loading && ingredients.length > 0 && filtered.length === 0">
        <h3>Nessun risultato</h3>
        <p>Nessun ingrediente corrisponde ai filtri selezionati.</p>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="openCreateIngredient()" [disabled]="saving">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `
})
export class IngredientsPage implements OnInit {
  ingredients: Ingredient[] = [];
  filtered: Ingredient[] = [];
  searchQuery = '';
  loading = true;
  saving = false;

  activeUnitFilter: Unit | null = null;
  activeCategoryFilter: string | null = null;

  constructor(
    private ingredientsService: IngredientsService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) {
    addIcons({ add, pencilOutline, trashOutline, nutritionOutline });
  }

  ngOnInit() { this.loadIngredients(); }

  ionViewWillEnter() {
    if (!this.loading) {
      this.ingredientsService.list().subscribe({
        next: (list) => {
          this.ingredients = list.filter(i => !i.isDeleted);
          this.filterIngredients();
        },
        error: () => {}
      });
    }
  }

  getUnitColor(unit: Unit | string): string { return (UNIT_COLORS as Record<string, string>)[unit] || '#757575'; }

  get existingCategories(): string[] {
    const cats = this.ingredients
      .map(i => i.category)
      .filter((c): c is string => !!c);
    return [...new Set(cats)].sort();
  }

  get hasActiveFilters(): boolean {
    return !!(this.activeUnitFilter || this.activeCategoryFilter || this.searchQuery);
  }

  filterIngredients() {
    let result = this.ingredients;
    const q = this.searchQuery.toLowerCase();
    if (q) {
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) || (i.category || '').toLowerCase().includes(q)
      );
    }
    if (this.activeUnitFilter) {
      result = result.filter(i => i.defaultUnit === this.activeUnitFilter);
    }
    if (this.activeCategoryFilter) {
      result = result.filter(i => i.category === this.activeCategoryFilter);
    }
    this.filtered = result;
  }

  setUnitFilter(unit: string) {
    this.activeUnitFilter = this.activeUnitFilter === unit ? null : unit as Unit;
    this.filterIngredients();
  }

  async openCategorySheet() {
    const buttons = this.existingCategories.map(cat => ({
      text: cat,
      cssClass: this.activeCategoryFilter === cat ? 'action-selected' : '',
      handler: () => { this.setCategoryFilter(cat); }
    }));
    buttons.push({
      text: 'Tutte le categorie',
      cssClass: this.activeCategoryFilter === null ? 'action-selected' : '',
      handler: () => { this.setCategoryFilter(null); }
    });
    buttons.push({ text: 'Annulla', role: 'cancel' } as any);
    const sheet = await this.actionSheetCtrl.create({
      header: 'Filtra per categoria',
      buttons
    });
    await sheet.present();
  }

  setCategoryFilter(cat: string | null) {
    this.activeCategoryFilter = this.activeCategoryFilter === cat ? null : cat;
    this.filterIngredients();
  }

  clearFilters() {
    this.activeUnitFilter = null;
    this.activeCategoryFilter = null;
    this.searchQuery = '';
    this.filterIngredients();
  }

  async loadIngredients() {
    this.loading = true;
    this.ingredientsService.list().subscribe({
      next: (list) => {
        this.ingredients = list.filter(i => !i.isDeleted);
        this.filterIngredients();
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        await this.showToast('Errore caricando ingredienti', 'danger');
      }
    });
  }

  async openCreateIngredient() {
    const modal = await this.modalCtrl.create({
      component: IngredientFormComponent,
      componentProps: { existingCategories: this.existingCategories },
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<Partial<Ingredient>>();
    if (role === 'save' && data) {
      this.createIngredient(data);
    }
  }

  createIngredient(dto: Partial<Ingredient>) {
    this.saving = true;
    this.ingredientsService.create(dto).subscribe({
      next: (ing) => {
        this.saving = false;
        this.ingredients = [...this.ingredients, ing];
        this.filterIngredients();
        this.showToast('✅ Ingrediente creato', 'success');
      },
      error: async (e) => {
        this.saving = false;
        await this.showToast(e.error?.message || 'Errore', 'danger');
      }
    });
  }

  async editIngredient(ing: Ingredient) {
    const modal = await this.modalCtrl.create({
      component: IngredientFormComponent,
      componentProps: { ingredient: ing, existingCategories: this.existingCategories },
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<Partial<Ingredient>>();
    if (role === 'save' && data) {
      this.updateIngredient(ing.id, data);
    }
  }

  updateIngredient(id: string, dto: Partial<Ingredient>) {
    this.saving = true;
    this.ingredientsService.update(id, dto).subscribe({
      next: (updated) => {
        this.saving = false;
        this.ingredients = this.ingredients.map(i => i.id === id ? updated : i);
        this.filterIngredients();
        this.showToast('✅ Aggiornato', 'success');
      },
      error: async (e) => {
        this.saving = false;
        await this.showToast(e.error?.message || 'Errore', 'danger');
      }
    });
  }

  async deleteIngredient(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Elimina ingrediente',
      message: 'Sei sicuro? L\'ingrediente sarà disabilitato.',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina', role: 'destructive',
          handler: () => {
            this.ingredientsService.delete(id).subscribe({
              next: () => {
                this.ingredients = this.ingredients.filter(i => i.id !== id);
                this.filterIngredients();
                this.showToast('Ingrediente eliminato', 'medium');
              },
              error: async (e) => { await this.showToast(e.error?.message || 'Errore', 'danger'); }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, color, position: 'top' });
    await t.present();
  }
}
