import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonFab, IonFabButton, IonBadge, IonChip,
  AlertController, LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, create } from 'ionicons/icons';
import { IngredientsService, Ingredient, Unit } from '../../features/ingredients/ingredients.service';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonFab, IonFabButton, IonBadge, IonChip
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Ingredienti</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item *ngFor="let ing of ingredients">
          <ion-label>
            <h2>{{ ing.name }}</h2>
            <p>
              <ion-chip color="primary" outline="true" style="height:20px; font-size:0.75em;">{{ ing.defaultUnit }}</ion-chip>
              <span class="ion-margin-start">Qty: {{ ing.defaultQty }}</span>
              <span *ngIf="ing.category" class="ion-margin-start" style="color: var(--ion-color-medium);">{{ ing.category }}</span>
            </p>
          </ion-label>
          <ion-button slot="end" fill="clear" color="primary" (click)="editIngredient(ing)">
            <ion-icon name="create" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button slot="end" fill="clear" color="danger" (click)="deleteIngredient(ing.id)">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <div *ngIf="ingredients.length === 0" class="ion-text-center ion-padding">
        <p style="color: var(--ion-color-medium);">Nessun ingrediente. Aggiungine uno!</p>
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

  constructor(
    private ingredientsService: IngredientsService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, trash, create });
  }

  ngOnInit() {
    this.loadIngredients();
  }

  async loadIngredients() {
    const loading = await this.loadingCtrl.create({ message: 'Caricamento...' });
    await loading.present();
    this.ingredientsService.list().subscribe({
      next: (list) => {
        this.ingredients = list.filter(i => !i.isDeleted);
        loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
        await this.showToast('Errore caricando ingredienti', 'danger');
      }
    });
  }

  async openCreateIngredient() {
    const alert = await this.alertCtrl.create({
      header: 'Nuovo Ingrediente',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nome *' },
        { name: 'category', type: 'text', placeholder: 'Categoria (opzionale)' },
        {
          name: 'defaultUnit',
          type: 'text',
          placeholder: 'Unità: gr, ml, unit',
          value: 'gr'
        },
        { name: 'defaultQty', type: 'number', placeholder: 'Quantità default', value: '100', min: 1 }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Crea',
          handler: (data) => {
            if (!data.name?.trim()) {
              this.showToast('Il nome è obbligatorio', 'warning');
              return false;
            }
            const qty = parseFloat(data.defaultQty);
            if (isNaN(qty) || qty <= 0) {
              this.showToast('La quantità deve essere > 0', 'warning');
              return false;
            }
            const unit = (['gr', 'ml', 'unit'].includes(data.defaultUnit)) ? data.defaultUnit as Unit : 'gr';
            this.createIngredient({
              name: data.name.trim(),
              category: data.category?.trim() || undefined,
              defaultUnit: unit,
              defaultQty: qty
            });
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
        this.showToast('Ingrediente creato', 'success');
      },
      error: async (e) => {
        await this.showToast(e.error?.message || 'Errore creando ingrediente', 'danger');
      }
    });
  }

  async editIngredient(ing: Ingredient) {
    const alert = await this.alertCtrl.create({
      header: 'Modifica Ingrediente',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nome *', value: ing.name },
        { name: 'category', type: 'text', placeholder: 'Categoria', value: ing.category || '' },
        { name: 'defaultUnit', type: 'text', placeholder: 'gr, ml, unit', value: ing.defaultUnit },
        { name: 'defaultQty', type: 'number', placeholder: 'Quantità', value: String(ing.defaultQty), min: 1 }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Salva',
          handler: (data) => {
            if (!data.name?.trim()) {
              this.showToast('Il nome è obbligatorio', 'warning');
              return false;
            }
            const qty = parseFloat(data.defaultQty);
            if (isNaN(qty) || qty <= 0) {
              this.showToast('La quantità deve essere > 0', 'warning');
              return false;
            }
            const unit = (['gr', 'ml', 'unit'].includes(data.defaultUnit)) ? data.defaultUnit as Unit : ing.defaultUnit;
            this.updateIngredient(ing.id, {
              name: data.name.trim(),
              category: data.category?.trim() || undefined,
              defaultUnit: unit,
              defaultQty: qty
            });
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
        this.showToast('Ingrediente aggiornato', 'success');
      },
      error: async (e) => {
        await this.showToast(e.error?.message || 'Errore aggiornando ingrediente', 'danger');
      }
    });
  }

  async deleteIngredient(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Elimina ingrediente',
      message: 'Sei sicuro di voler eliminare questo ingrediente?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina',
          role: 'destructive',
          handler: () => {
            this.ingredientsService.delete(id).subscribe({
              next: () => {
                this.ingredients = this.ingredients.filter(i => i.id !== id);
                this.showToast('Ingrediente eliminato', 'success');
              },
              error: async (e) => {
                await this.showToast(e.error?.message || 'Errore eliminando ingrediente', 'danger');
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
