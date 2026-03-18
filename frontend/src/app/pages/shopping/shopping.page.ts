import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonFab, IonFabButton,
  IonCheckbox, IonInput, IonProgressBar, IonSkeletonText, IonSearchbar, IonSpinner,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trashOutline, refreshOutline, cartOutline, checkmarkCircle,
  storefrontOutline, peopleOutline, pencilOutline, eyeOutline, eyeOffOutline,
  addOutline, removeOutline } from 'ionicons/icons';
import { ShoppingService, ShoppingItem } from '../../features/shopping/shopping.service';
import { Unit } from '../../features/ingredients/ingredients.service';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonIcon, IonFab, IonFabButton,
    IonCheckbox, IonInput, IonProgressBar, IonSkeletonText, IonSearchbar, IonSpinner
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

    /* ─── Shop row — two-line layout ─── */
    .shop-row {
      display: flex;
      flex-direction: column;
      padding: 10px 10px 8px 10px;
      gap: 6px;
      border-bottom: 1px solid var(--ion-border-color);
      background: var(--ion-item-background);
      transition: opacity 0.2s;
    }
    .shop-row:last-child { border-bottom: none; }
    .shop-row.purchased { opacity: 0.45; }

    /* ── Primary line: check + name + qty + badges ── */
    .shop-primary {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
    }

    .shop-check {
      --size: 20px;
      flex-shrink: 0;
    }

    /* name — grows, truncates */
    .item-name {
      flex: 1;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--ion-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .item-name.crossed {
      text-decoration: line-through;
      color: var(--ion-color-medium);
    }

    /* quantity in parentheses */
    .item-qty {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--ion-color-medium);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .item-covered {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--ion-color-success);
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* collab user badge — matches collaboration page avatar style */
    .collab-badge {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      color: white;
      font-size: 0.62rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      letter-spacing: 0;
    }

    .item-spinner {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      color: var(--ion-color-medium);
    }
    .stock-toggle-btn {
      --padding-start: 4px;
      --padding-end: 4px;
      height: 22px;
      flex-shrink: 0;
    }
    .stock-toggle-btn ion-icon { font-size: 14px; }

    /* ── Secondary line: stock + collab import + extra actions ── */
    .shop-secondary {
      display: flex;
      align-items: center;
      gap: 6px;
      padding-left: 27px; /* align under name (checkbox width + gap) */
    }

    .import-btn {
      --color: var(--ion-color-tertiary);
      --padding-start: 6px;
      --padding-end: 6px;
      height: 26px;
      font-size: 0.68rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    /* stock compact */
    .stock-wrap {
      display: flex;
      align-items: center;
      gap: 2px;
      background: var(--ion-color-light);
      border-radius: 10px;
      padding: 2px 6px 2px 4px;
      flex-shrink: 0;
    }
    .stock-label {
      font-size: 0.72rem;
      color: var(--ion-color-medium);
      font-weight: 600;
      white-space: nowrap;
    }
    .stock-icon { font-size: 12px; color: var(--ion-color-medium); flex-shrink: 0; margin-right: 2px; }
    .stock-input {
      width: 38px;
      --padding-start: 0;
      --padding-end: 0;
      --padding-top: 0;
      --padding-bottom: 0;
      font-size: 0.85rem;
      font-weight: 700;
      --background: transparent;
      text-align: center;
    }
    .stock-btn {
      --padding-start: 4px;
      --padding-end: 4px;
      height: 28px;
      width: 28px;
      flex-shrink: 0;
    }
    .stock-btn ion-icon { font-size: 15px; }

    /* extra actions */
    .shop-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      gap: 0;
      margin-left: auto;
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
            [color]="hidePurchased ? 'primary' : 'medium'"
            [title]="hidePurchased ? 'Acquistati nascosti — clicca per mostrarli' : 'Mostra solo da acquistare'"
            (click)="hidePurchased = !hidePurchased">
            <ion-icon [name]="hidePurchased ? 'eye-off-outline' : 'eye-outline'" slot="icon-only"></ion-icon>
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
          <ion-skeleton-text animated style="height:56px; margin:0; border-bottom:1px solid var(--ion-border-color);"
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
              <!-- Primary line -->
              <div class="shop-primary">
                <ion-checkbox class="shop-check" [checked]="item.isPurchased" (ionChange)="togglePurchased(item)" color="success"></ion-checkbox>
                <span class="item-name" [class.crossed]="item.isPurchased">{{ item.name }}</span>
                <ng-container *ngIf="!updatingItem.has(item.id); else spinnerTpl">
                  <span class="item-qty" *ngIf="getQtyToBuy(item) > 0">({{ getQtyToBuy(item) }} {{ item.unit }})</span>
                  <span class="item-covered" *ngIf="getQtyToBuy(item) === 0 && !item.isPurchased">✓ coperto</span>
                </ng-container>
                <ng-template #spinnerTpl>
                  <ion-spinner name="crescent" class="item-spinner"></ion-spinner>
                </ng-template>
                <span class="collab-badge" *ngFor="let c of item.collaboratorBreakdown"
                  [title]="c.email"
                  [style.background]="getCollabBadgeColor(c.email)">{{ getEmailInitials(c.email) }}</span>
                <ion-button fill="clear" size="small" class="stock-toggle-btn"
                  *ngIf="item.stockQty === 0 && item.collaboratorStockQty === 0"
                  [color]="expandedStock.has(item.id) ? 'primary' : 'medium'"
                  title="Gestisci scorta in casa"
                  (click)="toggleStockExpand(item.id)">
                  <ion-icon name="storefront-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
              <!-- Secondary line: stock management — when stock present, collab stock available, or user tapped storefront -->
              <div class="shop-secondary" *ngIf="item.stockQty > 0 || item.collaboratorStockQty > 0 || expandedStock.has(item.id)">
                <div class="stock-wrap">
                  <ion-icon name="storefront-outline" class="stock-icon"></ion-icon>
                  <ion-button fill="clear" size="small" class="stock-btn" color="medium" (click)="stepStock(item, -1)">
                    <ion-icon name="remove-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                  <ion-input type="number" class="stock-input"
                    [(ngModel)]="stockDraft[item.id]"
                    (ionBlur)="saveStock(item)"
                    placeholder="0" min="0" inputmode="decimal">
                  </ion-input>
                  <span class="stock-label">{{ item.unit }}</span>
                  <ion-button fill="clear" size="small" class="stock-btn" color="primary" (click)="stepStock(item, 1)">
                    <ion-icon name="add-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                </div>
                <ion-button class="import-btn" fill="clear" size="small" *ngIf="item.collaboratorStockQty > 0"
                  [disabled]="importingStock.has(item.id)"
                  title="Importa scorta collaboratore ({{ item.collaboratorStockQty }} {{ item.unit }})"
                  (click)="importCollaboratorStock(item)">+scorta</ion-button>
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
              <!-- Primary line -->
              <div class="shop-primary">
                <ion-checkbox class="shop-check" [checked]="item.isPurchased" (ionChange)="togglePurchased(item)" color="success"></ion-checkbox>
                <span class="item-name" [class.crossed]="item.isPurchased">{{ item.name }}</span>
                <ng-container *ngIf="!updatingItem.has(item.id); else spinnerTplExtra">
                  <span class="item-qty" *ngIf="getQtyToBuy(item) > 0">({{ getQtyToBuy(item) }} {{ item.unit }})</span>
                  <span class="item-covered" *ngIf="getQtyToBuy(item) === 0 && !item.isPurchased">✓ coperto</span>
                </ng-container>
                <ng-template #spinnerTplExtra>
                  <ion-spinner name="crescent" class="item-spinner"></ion-spinner>
                </ng-template>
                <div class="shop-actions">
                  <ion-button fill="clear" color="primary" size="small" (click)="openEditExtra(item)">
                    <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" color="danger" size="small" (click)="deleteExtra(item.id)">
                    <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" size="small" class="stock-toggle-btn"
                    *ngIf="item.stockQty === 0"
                    [color]="expandedStock.has(item.id) ? 'primary' : 'medium'"
                    title="Gestisci scorta in casa"
                    (click)="toggleStockExpand(item.id)">
                    <ion-icon name="storefront-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                </div>
              </div>
              <!-- Secondary line: stock — when stock present or expanded -->
              <div class="shop-secondary" *ngIf="item.stockQty > 0 || expandedStock.has(item.id)">
                <div class="stock-wrap">
                  <ion-icon name="storefront-outline" class="stock-icon"></ion-icon>
                  <ion-button fill="clear" size="small" class="stock-btn" color="medium" (click)="stepStock(item, -1)">
                    <ion-icon name="remove-outline" slot="icon-only"></ion-icon>
                  </ion-button>
                  <ion-input type="number" class="stock-input"
                    [(ngModel)]="stockDraft[item.id]"
                    (ionBlur)="saveStock(item)"
                    placeholder="0" min="0" inputmode="decimal">
                  </ion-input>
                  <span class="stock-label">{{ item.unit }}</span>
                  <ion-button fill="clear" size="small" class="stock-btn" color="primary" (click)="stepStock(item, 1)">
                    <ion-icon name="add-outline" slot="icon-only"></ion-icon>
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
          <ion-button [routerLink]="'/menu'" style="margin-top:8px;">
            Vai al menù
          </ion-button>
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
  expandedStock: Set<string> = new Set();
  stockDraft: Record<string, number> = {};
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
      storefrontOutline, peopleOutline, pencilOutline, eyeOutline, eyeOffOutline,
      addOutline, removeOutline });
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
      next: (items) => {
        this.allItems = items;
        this.loading = false;
        // init draft values from current stockQty
        items.forEach(i => { this.stockDraft[i.id] = Number(i.stockQty) || 0; });
      },
      error: async () => { this.loading = false; await this.showToast('Errore caricando la lista', 'danger'); }
    });
  }

  getQtyToBuy(item: ShoppingItem): number { return Math.max(0, item.totalQty - item.stockQty); }

  hasCollaboratorData(item: ShoppingItem): boolean {
    return !!(item.collaboratorBreakdown?.length);
  }

  getEmailInitials(email: string): string {
    if (!email) return '?';
    const local = email.split('@')[0];
    const parts = local.split(/[._\-]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return local.substring(0, 2).toUpperCase();
  }

  getCollabBadgeColor(email: string): string {
    const palette = [
      'linear-gradient(135deg,#2E7D32,#4CAF50)',
      'linear-gradient(135deg,#F57C00,#FFA000)',
      'linear-gradient(135deg,#7B1FA2,#AB47BC)',
      'linear-gradient(135deg,#1565C0,#1E88E5)',
      'linear-gradient(135deg,#00695C,#00897B)',
      'linear-gradient(135deg,#C62828,#E53935)',
      'linear-gradient(135deg,#AD1457,#E91E63)',
      'linear-gradient(135deg,#E65100,#FF9800)',
    ];
    let hash = 0;
    for (let i = 0; i < (email || '').length; i++) {
      hash = (hash * 31 + email.charCodeAt(i)) & 0xffffffff;
    }
    return palette[Math.abs(hash) % palette.length];
  }

  toggleStockExpand(id: string) {
    if (this.expandedStock.has(id)) {
      this.expandedStock = new Set([...this.expandedStock].filter(x => x !== id));
    } else {
      this.expandedStock = new Set([...this.expandedStock, id]);
    }
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

  stepStock(item: ShoppingItem, delta: number) {
    const step = item.unit === 'unit' ? 1 : 10;
    const current = Number(this.stockDraft[item.id]) || 0;
    const next = Math.max(0, current + delta * step);
    this.stockDraft = { ...this.stockDraft, [item.id]: next };
    this.saveStock(item);
  }

  saveStock(item: ShoppingItem) {
    const val = Number(this.stockDraft[item.id]);
    if (isNaN(val) || val < 0) return;
    if (val === Number(item.stockQty)) return; // no change
    this.updatingItem = new Set([...this.updatingItem, item.id]);
    this.shoppingService.updateItem(item.id, { stockQty: val }).subscribe({
      next: (res) => {
        this.updatingItem = new Set([...this.updatingItem].filter(id => id !== item.id));
        this.allItems = this.allItems.map(i => i.id === item.id ? { ...i, stockQty: res.stockQty } : i);
        this.stockDraft = { ...this.stockDraft, [item.id]: Number(res.stockQty) };
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
