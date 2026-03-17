import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonFab, IonFabButton,
  IonCheckbox, IonInput, IonProgressBar, IonSkeletonText, IonSearchbar,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trashOutline, refreshOutline, cartOutline, checkmarkCircle,
  storefrontOutline, peopleOutline, pencilOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { ShoppingService, ShoppingItem } from '../../features/shopping/shopping.service';
import { Unit } from '../../features/ingredients/ingredients.service';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonIcon, IonFab, IonFabButton,
    IonCheckbox, IonInput, IonProgressBar, IonSkeletonText, IonSearchbar
  ],
  styles: [`
    /* ─── Filter bar ─── */
    ion-toolbar.filter-toolbar {
      --background: var(--ion-color-light);
      --border-width: 0;
      --padding-start: 0;
      --padding-end: 0;
      --min-height: 50px;
    }
    .filter-inner {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px 8px;
    }
    .filter-inner ion-searchbar {
      flex: 1;
      --background: var(--ion-card-background);
      --border-radius: 10px;
      --box-shadow: 0 1px 6px rgba(0,0,0,0.08);
      --height: 36px;
      padding: 0;
    }
    .vis-btn {
      --border-radius: 20px;
      --padding-start: 8px;
      --padding-end: 8px;
      --box-shadow: none;
      height: 34px;
      flex-shrink: 0;
    }

    /* ─── Progress card ─── */
    .progress-card {
      margin: 12px 12px 0;
      background: var(--ion-card-background);
      border-radius: 14px;
      padding: 14px 16px 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07);
    }
    .progress-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .progress-label {
      flex: 1;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--ion-color-medium);
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .progress-fraction {
      font-size: 1rem;
      font-weight: 800;
      color: var(--ion-color-primary);
    }
    .progress-pct {
      font-size: 0.78rem;
      color: var(--ion-color-medium);
      font-weight: 600;
      background: rgba(0,0,0,0.05);
      border-radius: 10px;
      padding: 1px 7px;
    }
    .progress-done-msg {
      margin-top: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--ion-color-success);
      text-align: center;
    }

    /* ─── Section header ─── */
    .section-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 18px 16px 6px;
    }
    .section-head-label {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: var(--ion-color-medium);
    }
    .section-count {
      font-size: 0.7rem;
      font-weight: 700;
      background: rgba(0,0,0,0.06);
      color: var(--ion-color-medium);
      border-radius: 20px;
      padding: 1px 8px;
    }
    .section-line {
      flex: 1;
      height: 1px;
      background: rgba(0,0,0,0.07);
      border-radius: 1px;
    }

    /* ─── List wrap ─── */
    .list-wrap {
      margin: 0 12px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07);
      background: var(--ion-card-background);
    }

    /* ─── Shop row ─── */
    .shop-row {
      display: flex;
      align-items: flex-start;
      padding: 11px 12px 11px 10px;
      gap: 10px;
      border-bottom: 1px solid var(--ion-border-color);
      background: var(--ion-item-background);
      transition: opacity 0.2s, background 0.2s;
    }
    .shop-row:last-child { border-bottom: none; }
    .shop-row.purchased { opacity: 0.45; }

    .shop-check {
      --size: 22px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* body */
    .shop-body {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }
    .shop-content { flex: 1; min-width: 0; }

    /* main line: name + pills */
    .shop-main-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      min-height: 24px;
    }
    .item-name {
      flex: 1;
      font-weight: 600;
      font-size: 0.92rem;
      color: var(--ion-text-color);
      min-width: 60px;
      line-height: 1.3;
    }
    .item-name.crossed {
      text-decoration: line-through;
      color: var(--ion-color-medium);
    }

    /* qty / covered pills */
    .qty-pill {
      font-size: 0.78rem;
      font-weight: 700;
      color: #e65100;
      background: rgba(245,124,0,0.1);
      border-radius: 20px;
      padding: 2px 9px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .covered-pill {
      font-size: 0.72rem;
      font-weight: 700;
      background: rgba(46,125,50,0.1);
      color: var(--ion-color-primary);
      border-radius: 20px;
      padding: 2px 9px;
      flex-shrink: 0;
    }

    /* stock compact */
    .stock-wrap {
      display: flex;
      align-items: center;
      gap: 3px;
      background: var(--ion-color-light);
      border-radius: 8px;
      padding: 3px 7px 3px 5px;
      flex-shrink: 0;
    }
    .stock-icon { font-size: 12px; color: var(--ion-color-medium); flex-shrink: 0; }
    .stock-input {
      width: 38px;
      --padding-start: 2px;
      --padding-end: 2px;
      --padding-top: 0;
      --padding-bottom: 0;
      font-size: 0.8rem;
      font-weight: 600;
      --background: transparent;
      text-align: center;
    }

    /* collab bar */
    .collab-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px;
      margin-top: 5px;
      padding-top: 4px;
      border-top: 1px solid var(--ion-border-color);
    }
    .collab-icon { font-size: 11px; color: var(--ion-color-secondary); flex-shrink: 0; }
    .collab-tag {
      font-size: 0.7rem;
      color: #bf360c;
      background: rgba(245,124,0,0.08);
      border-radius: 4px;
      padding: 1px 6px;
    }
    .collab-stock-tag {
      font-size: 0.7rem;
      color: #7B1FA2;
      background: rgba(123,31,162,0.07);
      border-radius: 4px;
      padding: 1px 6px;
    }
    .import-btn {
      --color: #7B1FA2;
      --padding-start: 5px;
      --padding-end: 5px;
      height: 20px;
      font-size: 0.68rem;
      font-weight: 700;
    }

    /* extra actions */
    .shop-actions {
      display: flex;
      align-items: flex-start;
      flex-shrink: 0;
      margin-top: -4px;
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
      <ion-toolbar class="filter-toolbar">
        <div class="filter-inner">
          <ion-searchbar
            placeholder="Cerca nella lista..."
            [(ngModel)]="searchQuery"
            (ionInput)="searchQuery = $event.detail.value ?? ''">
          </ion-searchbar>
          <ion-button
            class="vis-btn"
            fill="solid"
            size="small"
            [color]="hidePurchased ? 'primary' : 'light'"
            (click)="hidePurchased = !hidePurchased">
            <ion-icon [name]="hidePurchased ? 'eye-outline' : 'eye-off-outline'" slot="icon-only"></ion-icon>
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Skeleton -->
      <ng-container *ngIf="loading">
        <div style="margin:12px; border-radius:14px; overflow:hidden;">
          <ion-skeleton-text animated style="height:72px; margin:0;"></ion-skeleton-text>
        </div>
        <div style="margin:12px; border-radius:12px; overflow:hidden; margin-top:20px;">
          <ion-skeleton-text animated style="height:56px; margin:0; border-bottom:1px solid #f2f2f2;"
            *ngFor="let x of [1,2,3,4]"></ion-skeleton-text>
        </div>
      </ng-container>

      <ng-container *ngIf="!loading">

        <!-- Progress card -->
        <div class="progress-card" *ngIf="allItems.length > 0">
          <div class="progress-header">
            <span class="progress-label">Acquisti</span>
            <span class="progress-fraction">{{ purchasedCount }} / {{ allItems.length }}</span>
            <span class="progress-pct">
              {{ allItems.length > 0 ? (purchasedCount / allItems.length * 100 | number:'1.0-0') : 0 }}%
            </span>
          </div>
          <ion-progress-bar
            [value]="allItems.length > 0 ? purchasedCount / allItems.length : 0"
            color="success">
          </ion-progress-bar>
          <div class="progress-done-msg" *ngIf="purchasedCount > 0 && purchasedCount === allItems.length">
            🎉 Lista completata!
          </div>
        </div>

        <!-- MENU items -->
        <ng-container *ngIf="menuItems.length > 0">
          <div class="section-head">
            <span class="section-head-label">Dal Menù</span>
            <span class="section-count">{{ menuItems.length }}</span>
            <div class="section-line"></div>
          </div>
          <div class="list-wrap">
            <div class="shop-row" [class.purchased]="item.isPurchased" *ngFor="let item of menuItems">
              <ion-checkbox
                class="shop-check"
                [checked]="item.isPurchased"
                (ionChange)="togglePurchased(item)"
                color="success">
              </ion-checkbox>
              <div class="shop-body">
                <div class="shop-content">
                  <div class="shop-main-row">
                    <span class="item-name" [class.crossed]="item.isPurchased">{{ item.name }}</span>
                    <span class="covered-pill" *ngIf="getQtyToBuy(item) === 0 && !item.isPurchased">✓ Coperto</span>
                    <span class="qty-pill" *ngIf="getQtyToBuy(item) > 0">{{ getQtyToBuy(item) }} {{ item.unit }}</span>
                    <div class="stock-wrap">
                      <ion-icon name="storefront-outline" class="stock-icon"></ion-icon>
                      <ion-input
                        type="number"
                        class="stock-input"
                        [value]="item.stockQty"
                        (ionChange)="updateStock(item, $event)"
                        placeholder="0"
                        min="0">
                      </ion-input>
                    </div>
                  </div>
                  <div class="collab-bar" *ngIf="hasCollaboratorData(item) || item.collaboratorStockQty > 0">
                    <ion-icon name="people-outline" class="collab-icon"></ion-icon>
                    <span class="collab-tag" *ngFor="let c of item.collaboratorBreakdown">
                      {{ c.email.split('@')[0] }}: {{ c.qty }}{{ item.unit }}
                    </span>
                    <ng-container *ngIf="item.collaboratorStockQty > 0">
                      <span class="collab-stock-tag">📦 {{ item.collaboratorStockQty }}{{ item.unit }}</span>
                      <ion-button class="import-btn" fill="clear" size="small"
                        [disabled]="importingStock.has(item.id)"
                        (click)="importCollaboratorStock(item)">Importa</ion-button>
                    </ng-container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- FUORI_MENU items -->
        <ng-container *ngIf="extraItems.length > 0">
          <div class="section-head">
            <span class="section-head-label">Extra</span>
            <span class="section-count">{{ extraItems.length }}</span>
            <div class="section-line"></div>
          </div>
          <div class="list-wrap">
            <div class="shop-row" [class.purchased]="item.isPurchased" *ngFor="let item of extraItems">
              <ion-checkbox
                class="shop-check"
                [checked]="item.isPurchased"
                (ionChange)="togglePurchased(item)"
                color="success">
              </ion-checkbox>
              <div class="shop-body">
                <div class="shop-content">
                  <div class="shop-main-row">
                    <span class="item-name" [class.crossed]="item.isPurchased">{{ item.name }}</span>
                    <span class="covered-pill" *ngIf="getQtyToBuy(item) === 0 && !item.isPurchased">✓ Coperto</span>
                    <span class="qty-pill" *ngIf="getQtyToBuy(item) > 0">{{ getQtyToBuy(item) }} {{ item.unit }}</span>
                    <div class="stock-wrap">
                      <ion-icon name="storefront-outline" class="stock-icon"></ion-icon>
                      <ion-input
                        type="number"
                        class="stock-input"
                        [value]="item.stockQty"
                        (ionChange)="updateStock(item, $event)"
                        placeholder="0"
                        min="0">
                      </ion-input>
                    </div>
                  </div>
                </div>
                <div class="shop-actions">
                  <ion-button fill="clear" color="primary" size="small" (click)="openEditExtra(item)">
                    <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" color="danger" size="small" (click)="deleteExtra(item.id)">
                    <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                </div>
              </div>
            </div>
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
  importingStock: Set<string> = new Set();
  searchQuery = '';
  hidePurchased = false;

  get filteredItems(): ShoppingItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.allItems;
    return this.allItems.filter(i => i.name.toLowerCase().includes(q));
  }

  get menuItems() {
    return this.filteredItems.filter(i => i.source === 'MENU' && (!this.hidePurchased || !i.isPurchased));
  }
  get extraItems() {
    return this.filteredItems.filter(i => i.source === 'FUORI_MENU' && (!this.hidePurchased || !i.isPurchased));
  }
  get purchasedCount() { return this.allItems.filter(i => i.isPurchased).length; }

  constructor(
    private shoppingService: ShoppingService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, trashOutline, refreshOutline, cartOutline, checkmarkCircle,
      storefrontOutline, peopleOutline, pencilOutline, eyeOutline, eyeOffOutline });
  }

  ngOnInit() { this.loadList(); }

  ionViewWillEnter() {
    if (!this.loading) {
      this.shoppingService.getList().subscribe({
        next: (items) => { this.allItems = items; },
        error: () => {}
      });
    }
  }

  async loadList() {
    this.loading = true;
    this.shoppingService.getList().subscribe({
      next: (items) => { this.allItems = items; this.loading = false; },
      error: async () => { this.loading = false; await this.showToast('Errore caricando la lista', 'danger'); }
    });
  }

  getQtyToBuy(item: ShoppingItem): number { return Math.max(0, item.totalQty - item.stockQty); }

  hasCollaboratorData(item: ShoppingItem): boolean {
    return !!(item.collaboratorBreakdown?.length);
  }

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

  importCollaboratorStock(item: ShoppingItem) {
    if (!item.collaboratorStockQty || item.collaboratorStockQty <= 0) return;
    const newStock = Number(item.stockQty) + Number(item.collaboratorStockQty);
    this.importingStock = new Set([...this.importingStock, item.id]);
    this.shoppingService.updateItem(item.id, { stockQty: newStock }).subscribe({
      next: (res) => {
        this.importingStock = new Set([...this.importingStock].filter(id => id !== item.id));
        this.allItems = this.allItems.map(i => i.id === item.id ? { ...i, stockQty: res.stockQty } : i);
        this.showToast('Scorta collaboratore importata', 'success');
      },
      error: async (e) => {
        this.importingStock = new Set([...this.importingStock].filter(id => id !== item.id));
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

  async openEditExtra(item: ShoppingItem) {
    const alert = await this.alertCtrl.create({
      header: 'Modifica Extra',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nome *', value: item.name },
        { name: 'unit', type: 'text', placeholder: 'Unità: gr / ml / unit', value: item.unit },
        { name: 'totalQty', type: 'number', placeholder: 'Quantità', value: String(item.totalQty), min: 0.01 }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Salva',
          handler: (data) => {
            if (!data.name?.trim()) { this.showToast('Il nome è obbligatorio', 'warning'); return false; }
            const qty = parseFloat(data.totalQty);
            if (isNaN(qty) || qty <= 0) { this.showToast('La quantità deve essere > 0', 'warning'); return false; }
            const validUnits = ['gr', 'ml', 'unit'];
            const unit = validUnits.includes(data.unit) ? data.unit : item.unit;
            this.applyExtraEdit(item.id, { name: data.name.trim(), unit: unit as any, totalQty: qty });
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  applyExtraEdit(id: string, dto: Partial<ShoppingItem>) {
    this.shoppingService.updateItem(id, dto).subscribe({
      next: (updated) => {
        this.allItems = this.allItems.map(i => i.id === id ? { ...i, ...updated } : i);
        this.showToast('Extra aggiornato', 'success');
      },
      error: async (e) => { await this.showToast(e.error?.message || 'Errore aggiornando extra', 'danger'); }
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
