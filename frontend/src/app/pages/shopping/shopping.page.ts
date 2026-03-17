import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonFab, IonFabButton, IonToggle, IonInput,
  IonListHeader, IonNote, IonBadge,
  AlertController, LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, refresh } from 'ionicons/icons';
import { ShoppingService, ShoppingItem } from '../../features/shopping/shopping.service';
import { Unit } from '../../features/ingredients/ingredients.service';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonFab, IonFabButton, IonToggle, IonInput,
    IonListHeader, IonNote, IonBadge
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Lista della Spesa</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="loadList()">
            <ion-icon name="refresh" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- MENU items -->
      <ion-list *ngIf="menuItems.length > 0">
        <ion-list-header>
          <ion-label>Dal Menù</ion-label>
        </ion-list-header>
        <ion-item *ngFor="let item of menuItems" [class.purchased]="item.isPurchased">
          <ion-toggle
            slot="start"
            [checked]="item.isPurchased"
            (ionChange)="togglePurchased(item)">
          </ion-toggle>
          <ion-label [style.textDecoration]="item.isPurchased ? 'line-through' : 'none'">
            <h2>{{ item.name }}</h2>
            <p>
              Da acquistare: <strong>{{ getQtyToBuy(item) }} {{ item.unit }}</strong>
              | Totale: {{ item.totalQty }} {{ item.unit }}
            </p>
            <p *ngIf="item.mealType" style="font-size:0.8em; color: var(--ion-color-medium);">
              {{ item.mealType }}
            </p>
          </ion-label>
          <div slot="end" style="display:flex; flex-direction: column; align-items: flex-end; gap: 4px;">
            <ion-note>Scorta:</ion-note>
            <ion-input
              type="number"
              [value]="item.stockQty"
              (ionChange)="updateStock(item, $event)"
              style="width: 70px; text-align: right;"
              min="0">
            </ion-input>
          </div>
        </ion-item>
      </ion-list>

      <!-- FUORI_MENU items -->
      <ion-list *ngIf="extraItems.length > 0">
        <ion-list-header>
          <ion-label>Extra</ion-label>
        </ion-list-header>
        <ion-item *ngFor="let item of extraItems" [class.purchased]="item.isPurchased">
          <ion-toggle
            slot="start"
            [checked]="item.isPurchased"
            (ionChange)="togglePurchased(item)">
          </ion-toggle>
          <ion-label [style.textDecoration]="item.isPurchased ? 'line-through' : 'none'">
            <h2>{{ item.name }}</h2>
            <p>{{ item.totalQty }} {{ item.unit }}</p>
          </ion-label>
          <ion-button slot="end" fill="clear" color="danger" (click)="deleteExtra(item.id)">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <div *ngIf="allItems.length === 0" class="ion-text-center ion-padding">
        <p style="color: var(--ion-color-medium);">La lista della spesa è vuota.</p>
        <p style="color: var(--ion-color-medium); font-size: 0.85em;">Pianifica il menù settimanale per generare la lista automaticamente.</p>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="openAddExtra()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`
    .purchased { opacity: 0.6; }
    ion-buttons { display: flex; }
  `]
})
export class ShoppingPage implements OnInit {
  allItems: ShoppingItem[] = [];

  get menuItems() { return this.allItems.filter(i => i.source === 'MENU'); }
  get extraItems() { return this.allItems.filter(i => i.source === 'FUORI_MENU'); }

  constructor(
    private shoppingService: ShoppingService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, trash, refresh });
  }

  ngOnInit() {
    this.loadList();
  }

  async loadList() {
    const loading = await this.loadingCtrl.create({ message: 'Caricamento...' });
    await loading.present();
    this.shoppingService.getList().subscribe({
      next: (items) => {
        this.allItems = items;
        loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
        await this.showToast('Errore caricando la lista', 'danger');
      }
    });
  }

  getQtyToBuy(item: ShoppingItem): number {
    return Math.max(0, item.totalQty - item.stockQty);
  }

  togglePurchased(item: ShoppingItem) {
    const updated = { ...item, isPurchased: !item.isPurchased };
    this.shoppingService.updateItem(item.id, { isPurchased: updated.isPurchased }).subscribe({
      next: (res) => {
        this.allItems = this.allItems.map(i => i.id === item.id ? { ...i, isPurchased: res.isPurchased } : i);
      },
      error: async (e) => {
        await this.showToast(e.error?.message || 'Errore aggiornando stato', 'danger');
      }
    });
  }

  updateStock(item: ShoppingItem, event: CustomEvent) {
    const val = parseFloat((event as CustomEvent<{ value: string }>).detail.value);
    if (isNaN(val) || val < 0) return;
    this.shoppingService.updateItem(item.id, { stockQty: val }).subscribe({
      next: (res) => {
        this.allItems = this.allItems.map(i => i.id === item.id ? { ...i, stockQty: res.stockQty } : i);
      },
      error: async (e) => {
        await this.showToast(e.error?.message || 'Errore aggiornando scorta', 'danger');
      }
    });
  }

  async openAddExtra() {
    const alert = await this.alertCtrl.create({
      header: 'Aggiungi Extra',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nome *' },
        { name: 'unit', type: 'text', placeholder: 'Unità: gr, ml, unit', value: 'unit' },
        { name: 'totalQty', type: 'number', placeholder: 'Quantità', value: '1', min: 1 }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Aggiungi',
          handler: (data) => {
            if (!data.name?.trim()) {
              this.showToast('Il nome è obbligatorio', 'warning');
              return false;
            }
            const qty = parseFloat(data.totalQty);
            if (isNaN(qty) || qty <= 0) {
              this.showToast('La quantità deve essere > 0', 'warning');
              return false;
            }
            const unit = (['gr', 'ml', 'unit'].includes(data.unit)) ? data.unit as Unit : 'unit';
            this.addExtra({
              name: data.name.trim(),
              unit,
              totalQty: qty,
              stockQty: 0,
              isPurchased: false,
              source: 'FUORI_MENU'
            });
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  addExtra(dto: Partial<ShoppingItem>) {
    this.shoppingService.addExtra(dto).subscribe({
      next: (item) => {
        this.allItems = [...this.allItems, item];
        this.showToast('Extra aggiunto', 'success');
      },
      error: async (e) => {
        await this.showToast(e.error?.message || 'Errore aggiungendo extra', 'danger');
      }
    });
  }

  async deleteExtra(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Elimina extra',
      message: 'Sei sicuro?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina',
          role: 'destructive',
          handler: () => {
            this.shoppingService.deleteExtra(id).subscribe({
              next: () => {
                this.allItems = this.allItems.filter(i => i.id !== id);
                this.showToast('Extra eliminato', 'success');
              },
              error: async (e) => {
                await this.showToast(e.error?.message || 'Errore eliminando extra', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    await toast.present();
  }
}
