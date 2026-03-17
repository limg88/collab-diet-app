import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonBadge,
  IonFab, IonFabButton, IonSkeletonText,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, pencilOutline, trashOutline, nutritionOutline } from 'ionicons/icons';
import { IngredientsService, Ingredient, Unit } from '../../features/ingredients/ingredients.service';

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
    IonFab, IonFabButton, IonSkeletonText
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
      color: #1a1a1a;
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
      color: #666;
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
        <p>Nessun ingrediente corrisponde a "{{ searchQuery }}"</p>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="openCreateIngredient()">
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

  constructor(
    private ingredientsService: IngredientsService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, pencilOutline, trashOutline, nutritionOutline });
  }

  ngOnInit() { this.loadIngredients(); }

  getUnitColor(unit: Unit): string { return UNIT_COLORS[unit] || '#757575'; }

  filterIngredients() {
    const q = this.searchQuery.toLowerCase();
    this.filtered = this.ingredients.filter(i =>
      i.name.toLowerCase().includes(q) || (i.category || '').toLowerCase().includes(q)
    );
  }

  async loadIngredients() {
    this.loading = true;
    this.ingredientsService.list().subscribe({
      next: (list) => {
        this.ingredients = list.filter(i => !i.isDeleted);
        this.filtered = [...this.ingredients];
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        await this.showToast('Errore caricando ingredienti', 'danger');
      }
    });
  }

  async openCreateIngredient() {
    const alert = await this.alertCtrl.create({
      header: 'Nuovo Ingrediente',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nome *' },
        { name: 'category', type: 'text', placeholder: 'Categoria (es. Latticini, Cereali)' },
        { name: 'defaultUnit', type: 'text', placeholder: 'Unità: gr / ml / unit', value: 'gr' },
        { name: 'defaultQty', type: 'number', placeholder: 'Quantità default (es. 100)', value: '100', min: 1 }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Crea',
          handler: (data) => {
            if (!data.name?.trim()) { this.showToast('Il nome è obbligatorio', 'warning'); return false; }
            const qty = parseFloat(data.defaultQty);
            if (isNaN(qty) || qty <= 0) { this.showToast('La quantità deve essere > 0', 'warning'); return false; }
            const unit: Unit = (['gr', 'ml', 'unit'].includes(data.defaultUnit)) ? data.defaultUnit as Unit : 'gr';
            this.createIngredient({ name: data.name.trim(), category: data.category?.trim() || undefined, defaultUnit: unit, defaultQty: qty });
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  createIngredient(dto: Partial<Ingredient>) {
    this.ingredientsService.create(dto).subscribe({
      next: (ing) => {
        this.ingredients = [...this.ingredients, ing];
        this.filterIngredients();
        this.showToast('Ingrediente creato', 'success');
      },
      error: async (e) => { await this.showToast(e.error?.message || 'Errore', 'danger'); }
    });
  }

  async editIngredient(ing: Ingredient) {
    const alert = await this.alertCtrl.create({
      header: `Modifica: ${ing.name}`,
      inputs: [
        { name: 'name', type: 'text', value: ing.name },
        { name: 'category', type: 'text', placeholder: 'Categoria', value: ing.category || '' },
        { name: 'defaultUnit', type: 'text', placeholder: 'Unità: gr / ml / unit', value: ing.defaultUnit },
        { name: 'defaultQty', type: 'number', value: String(ing.defaultQty), min: 1 }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Salva',
          handler: (data) => {
            if (!data.name?.trim()) { this.showToast('Il nome è obbligatorio', 'warning'); return false; }
            const qty = parseFloat(data.defaultQty);
            if (isNaN(qty) || qty <= 0) { this.showToast('La quantità deve essere > 0', 'warning'); return false; }
            const selectedUnit: Unit = (['gr', 'ml', 'unit'].includes(data.defaultUnit)) ? data.defaultUnit as Unit : ing.defaultUnit;
            this.updateIngredient(ing.id, { name: data.name.trim(), category: data.category?.trim() || undefined, defaultUnit: selectedUnit, defaultQty: qty });
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  updateIngredient(id: string, dto: Partial<Ingredient>) {
    this.ingredientsService.update(id, dto).subscribe({
      next: (updated) => {
        this.ingredients = this.ingredients.map(i => i.id === id ? updated : i);
        this.filterIngredients();
        this.showToast('Aggiornato', 'success');
      },
      error: async (e) => { await this.showToast(e.error?.message || 'Errore', 'danger'); }
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
