import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonList, IonItem, IonLabel, IonIcon, IonFab, IonFabButton,
  IonCheckbox, IonInput, IonProgressBar, IonBadge, IonSkeletonText,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trashOutline, refreshOutline, cartOutline, checkmarkCircle, storefrontOutline } from 'ionicons/icons';
import { ShoppingService, ShoppingItem } from '../../features/shopping/shopping.service';
import { Unit } from '../../features/ingredients/ingredients.service';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonList, IonItem, IonLabel, IonIcon, IonFab, IonFabButton,
    IonCheckbox, IonInput, IonProgressBar, IonBadge, IonSkeletonText
  ],
  styles: [`
    .progress-card {
      margin: 12px;
      background: white;
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: var(--app-shadow);
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .progress-title {
      font-weight: 700;
      font-size: 0.9rem;
      color: #333;
    }
    .progress-count {
      font-size: 0.85rem;
      color: var(--ion-color-primary);
      font-weight: 600;
    }

    .section-label {
      padding: 12px 16px 4px;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: var(--ion-color-medium);
    }

    .shop-item {
      --padding-start: 12px;
      --padding-end: 10px;
      --inner-padding-end: 0;
      --background: white;
      --min-height: 56px;
      margin: 0;
    }
    .shop-item.purchased {
      --background: #fafafa;
      opacity: 0.6;
    }

    .item-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: #1a1a1a;
    }
    .item-name.crossed { text-decoration: line-through; }

    .item-sub {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 3px;
    }
    .qty-to-buy {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--ion-color-secondary);
    }
    .qty-total {
      font-size: 0.78rem;
      color: #999;
    }

    .stock-area {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      flex-shrink: 0;
    }
    .stock-label {
      font-size: 0.65rem;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stock-input {
      width: 64px;
      background: #f5f5f5;
      border-radius: 7px;
      text-align: center;
      --padding-start: 4px;
      --padding-end: 4px;
      --padding-top: 3px;
      --padding-bottom: 3px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .list-wrap {
      margin: 0 12px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--app-shadow);
      background: white;
    }
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Lista della Spesa</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" style="--color:white" (click)="loadList()">
            <ion-icon name="refresh-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Skeleton -->
      <ng-container *ngIf="loading">
        <div style="margin:12px; border-radius:12px; overflow:hidden;">
          <ion-skeleton-text animated style="height:72px; margin:0;"></ion-skeleton-text>
        </div>
        <div style="margin:12px; border-radius:12px; overflow:hidden;">
          <ion-skeleton-text animated style="height:60px; margin:0;" *ngFor="let x of [1,2,3,4]"></ion-skeleton-text>
        </div>
      </ng-container>

      <ng-container *ngIf="!loading">
        <!-- Progress card -->
        <div class="progress-card" *ngIf="allItems.length > 0">
          <div class="progress-header">
            <span class="progress-title">Progresso acquisti</span>
            <span class="progress-count">{{ purchasedCount }}/{{ allItems.length }}</span>
          </div>
          <ion-progress-bar
            [value]="allItems.length > 0 ? purchasedCount / allItems.length : 0"
            color="success">
          </ion-progress-bar>
        </div>

        <!-- MENU items -->
        <ng-container *ngIf="menuItems.length > 0">
          <div class="section-label">Dal Menù ({{ menuItems.length }})</div>
          <div class="list-wrap">
            <ion-list lines="inset">
              <ion-item class="shop-item" [class.purchased]="item.isPurchased"
                *ngFor="let item of menuItems">
                <ion-checkbox
                  slot="start"
                  [checked]="item.isPurchased"
                  (ionChange)="togglePurchased(item)"
                  color="success">
                </ion-checkbox>
                <ion-label>
                  <div class="item-name" [class.crossed]="item.isPurchased">{{ item.name }}</div>
                  <div class="item-sub">
                    <span class="qty-to-buy">{{ getQtyToBuy(item) }} {{ item.unit }}</span>
                    <span class="qty-total" *ngIf="item.stockQty > 0">
                      (scorta: {{ item.stockQty }})
                    </span>
                    <span class="qty-total" *ngIf="item.totalQty !== getQtyToBuy(item) && item.stockQty === 0">
                      tot. {{ item.totalQty }}
                    </span>
                  </div>
                </ion-label>
                <div slot="end" class="stock-area">
                  <span class="stock-label">Scorta</span>
                  <ion-input
                    type="number"
                    class="stock-input"
                    [value]="item.stockQty"
                    (ionChange)="updateStock(item, $event)"
                    min="0">
                  </ion-input>
                </div>
              </ion-item>
            </ion-list>
          </div>
        </ng-container>

        <!-- FUORI_MENU items -->
        <ng-container *ngIf="extraItems.length > 0">
          <div class="section-label">Extra ({{ extraItems.length }})</div>
          <div class="list-wrap">
            <ion-list lines="inset">
              <ion-item class="shop-item" [class.purchased]="item.isPurchased"
                *ngFor="let item of extraItems">
                <ion-checkbox
                  slot="start"
                  [checked]="item.isPurchased"
                  (ionChange)="togglePurchased(item)"
                  color="success">
                </ion-checkbox>
                <ion-label>
                  <div class="item-name" [class.crossed]="item.isPurchased">{{ item.name }}</div>
                  <div class="item-sub">
                    <span class="qty-to-buy">{{ getQtyToBuy(item) }} {{ item.unit }}</span>
                    <span class="qty-total" *ngIf="item.stockQty > 0">(scorta: {{ item.stockQty }})</span>
                  </div>
                </ion-label>
                <div slot="end" style="display: flex; align-items: center; gap: 2px;">
                  <div class="stock-area">
                    <span class="stock-label">Scorta</span>
                    <ion-input
                      type="number"
                      class="stock-input"
                      [value]="item.stockQty"
                      (ionChange)="updateStock(item, $event)"
                      min="0">
                    </ion-input>
                  </div>
                  <ion-button fill="clear" color="danger" size="small" (click)="deleteExtra(item.id)">
                    <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                </div>
              </ion-item>
            </ion-list>
          </div>
        </ng-container>

        <!-- Empty state -->
        <div class="empty-state" *ngIf="allItems.length === 0">
          <ion-icon name="cart-outline" class="empty-icon"></ion-icon>
          <h3>Lista vuota</h3>
          <p>Pianifica il menù settimanale per generare automaticamente la lista della spesa.</p>
        </div>
      </ng-container>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="openAddExtra()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `
})
export class ShoppingPage implements OnInit {
  allItems: ShoppingItem[] = [];
  loading = true;
  updatingItem: Set<string> = new Set();

  get menuItems() { return this.allItems.filter(i => i.source === 'MENU'); }
  get extraItems() { return this.allItems.filter(i => i.source === 'FUORI_MENU'); }
  get purchasedCount() { return this.allItems.filter(i => i.isPurchased).length; }

  constructor(
    private shoppingService: ShoppingService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, trashOutline, refreshOutline, cartOutline, checkmarkCircle, storefrontOutline });
  }

  ngOnInit() { this.loadList(); }

  async loadList() {
    this.loading = true;
    this.shoppingService.getList().subscribe({
      next: (items) => { this.allItems = items; this.loading = false; },
      error: async () => { this.loading = false; await this.showToast('Errore caricando la lista', 'danger'); }
    });
  }

  getQtyToBuy(item: ShoppingItem): number { return Math.max(0, item.totalQty - item.stockQty); }

  togglePurchased(item: ShoppingItem) {
    this.updatingItem = new Set([...this.updatingItem, item.id]);
    this.shoppingService.updateItem(item.id, { isPurchased: !item.isPurchased }).subscribe({
      next: (res) => {
        this.updatingItem = new Set([...this.updatingItem].filter(id => id !== item.id));
        this.allItems = this.allItems.map(i => i.id === item.id ? { ...i, isPurchased: res.isPurchased } : i);
      },
      error: async (e) => {
        this.updatingItem = new Set([...this.updatingItem].filter(id => id !== item.id));
        await this.showToast(e.error?.message || 'Errore', 'danger');
      }
    });
  }

  updateStock(item: ShoppingItem, event: Event) {
    const val = parseFloat((event as CustomEvent<{ value: string }>).detail.value);
    if (isNaN(val) || val < 0) return;
    this.updatingItem = new Set([...this.updatingItem, item.id]);
    this.shoppingService.updateItem(item.id, { stockQty: val }).subscribe({
      next: (res) => {
        this.updatingItem = new Set([...this.updatingItem].filter(id => id !== item.id));
        this.allItems = this.allItems.map(i => i.id === item.id ? { ...i, stockQty: res.stockQty } : i);
      },
      error: async (e) => {
        this.updatingItem = new Set([...this.updatingItem].filter(id => id !== item.id));
        await this.showToast(e.error?.message || 'Errore', 'danger');
      }
    });
  }

  async openAddExtra() {
    const alert = await this.alertCtrl.create({
      header: 'Aggiungi Extra',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Articolo *' },
        { name: 'unit', type: 'text', placeholder: 'Unità: gr / ml / unit', value: 'unit' },
        { name: 'totalQty', type: 'number', placeholder: 'Quantità', value: '1', min: 1 }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Aggiungi',
          handler: (data) => {
            if (!data.name?.trim()) { this.showToast('Il nome è obbligatorio', 'warning'); return false; }
            const qty = parseFloat(data.totalQty);
            if (isNaN(qty) || qty <= 0) { this.showToast('La quantità deve essere > 0', 'warning'); return false; }
            const unit: Unit = (['gr', 'ml', 'unit'].includes(data.unit)) ? data.unit as Unit : 'unit';
            this.addExtra({ name: data.name.trim(), unit, totalQty: qty, stockQty: 0, isPurchased: false, source: 'FUORI_MENU' });
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  addExtra(dto: Partial<ShoppingItem>) {
    this.shoppingService.addExtra(dto).subscribe({
      next: (item) => { this.allItems = [...this.allItems, item]; this.showToast('Extra aggiunto', 'success'); },
      error: async (e) => { await this.showToast(e.error?.message || 'Errore', 'danger'); }
    });
  }

  async deleteExtra(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Elimina articolo',
      message: 'Rimuovere questo articolo dalla lista?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Rimuovi', role: 'destructive',
          handler: () => {
            this.shoppingService.deleteExtra(id).subscribe({
              next: () => { this.allItems = this.allItems.filter(i => i.id !== id); this.showToast('Rimosso', 'medium'); },
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
