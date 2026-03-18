import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonInput, IonButton, IonIcon, IonButtons, IonFooter,
  IonSpinner, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { ApiService } from '../../core/services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonInput, IonButton, IonIcon, IonButtons, IonFooter, IonSpinner
  ],
  styles: [`
    ion-toolbar { --background: var(--ion-color-primary); --color: white; }
    ion-title { color: white; }
    ion-buttons ion-button { --color: white; }

    .section-label {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--ion-color-medium);
      padding: 16px 16px 4px;
    }
    ion-item { --padding-start: 16px; }

    .eye-btn {
      --color: var(--ion-color-medium);
      --padding-start: 8px;
      --padding-end: 8px;
      margin: 0;
    }
    .error-msg {
      padding: 8px 16px;
      font-size: 0.82rem;
      color: var(--ion-color-danger);
      font-weight: 500;
    }
    .hint {
      padding: 4px 16px 12px;
      font-size: 0.78rem;
      color: var(--ion-color-medium);
    }
    ion-footer {
      padding: 12px;
      background: var(--ion-card-background);
      box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
    }
    .save-btn {
      --background: var(--ion-color-primary);
      --border-radius: 10px;
      font-weight: 700;
    }
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Cambia password</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <p class="section-label">Credenziali</p>
      <ion-list lines="inset">
        <ion-item>
          <ion-label position="stacked">Password attuale *</ion-label>
          <ion-input
            [(ngModel)]="currentPassword"
            [type]="showCurrent ? 'text' : 'password'"
            placeholder="Inserisci la password attuale"
            autocomplete="current-password">
          </ion-input>
          <ion-button slot="end" fill="clear" class="eye-btn" (click)="showCurrent = !showCurrent">
            <ion-icon slot="icon-only" [name]="showCurrent ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Nuova password *</ion-label>
          <ion-input
            [(ngModel)]="newPassword"
            [type]="showNew ? 'text' : 'password'"
            placeholder="Minimo 6 caratteri"
            autocomplete="new-password">
          </ion-input>
          <ion-button slot="end" fill="clear" class="eye-btn" (click)="showNew = !showNew">
            <ion-icon slot="icon-only" [name]="showNew ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Conferma nuova password *</ion-label>
          <ion-input
            [(ngModel)]="confirmPassword"
            [type]="showConfirm ? 'text' : 'password'"
            placeholder="Ripeti la nuova password"
            autocomplete="new-password">
          </ion-input>
          <ion-button slot="end" fill="clear" class="eye-btn" (click)="showConfirm = !showConfirm">
            <ion-icon slot="icon-only" [name]="showConfirm ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
      <p class="hint">La nuova password deve essere di almeno 6 caratteri.</p>
      <p class="error-msg" *ngIf="error">{{ error }}</p>
    </ion-content>

    <ion-footer>
      <ion-button expand="block" class="save-btn" (click)="save()" [disabled]="saving">
        <ion-spinner *ngIf="saving" name="crescent" style="margin-right:8px;"></ion-spinner>
        {{ saving ? 'Salvataggio...' : 'Aggiorna password' }}
      </ion-button>
    </ion-footer>
  `
})
export class ChangePasswordModalComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  showCurrent = false;
  showNew = false;
  showConfirm = false;
  error = '';
  saving = false;

  constructor(private modalCtrl: ModalController, private api: ApiService) {
    addIcons({ closeOutline, eyeOutline, eyeOffOutline });
  }

  async save() {
    this.error = '';
    if (!this.currentPassword) { this.error = 'Inserisci la password attuale'; return; }
    if (this.newPassword.length < 6) { this.error = 'La nuova password deve essere di almeno 6 caratteri'; return; }
    if (this.newPassword !== this.confirmPassword) { this.error = 'Le password non coincidono'; return; }
    if (this.newPassword === this.currentPassword) { this.error = 'La nuova password deve essere diversa da quella attuale'; return; }

    this.saving = true;
    try {
      await firstValueFrom(
        this.api.patch<void>('/auth/change-password', {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        })
      );
      await this.modalCtrl.dismiss(null, 'saved');
    } catch (err: any) {
      this.error = err?.error?.message || 'Errore durante il cambio password';
    } finally {
      this.saving = false;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
