import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonInput, IonListHeader, IonBadge,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  AlertController, LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark, close, personRemove, mail, people, refresh } from 'ionicons/icons';
import {
  CollaborationService,
  Collaborator,
  Invite
} from '../../features/collaboration/collaboration.service';

@Component({
  selector: 'app-collaboration',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonInput, IonListHeader, IonBadge,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Collaboratori</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="loadAll()">
            <ion-icon name="refresh" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- Invite by email -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Invita un collaboratore</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="none">
            <ion-input
              type="email"
              placeholder="Email del collaboratore"
              [(ngModel)]="inviteEmail"
              (keyup.enter)="sendInvite()">
            </ion-input>
          </ion-item>
          <ion-button expand="block" (click)="sendInvite()" [disabled]="!inviteEmail.trim()">
            <ion-icon name="mail" slot="start"></ion-icon>
            Invia Invito
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Active Collaborators -->
      <ion-card *ngIf="collaborators.length > 0">
        <ion-card-header>
          <ion-card-title>
            <ion-icon name="people"></ion-icon>
            Collaboratori attivi
            <ion-badge color="success" class="ion-margin-start">{{ collaborators.length }}</ion-badge>
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item *ngFor="let c of collaborators">
              <ion-icon name="people" slot="start" color="success"></ion-icon>
              <ion-label>{{ c.email }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Received Invites -->
      <ion-card *ngIf="receivedInvites.length > 0">
        <ion-card-header>
          <ion-card-title>
            Inviti ricevuti
            <ion-badge color="warning" class="ion-margin-start">{{ receivedInvites.length }}</ion-badge>
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item *ngFor="let inv of receivedInvites">
              <ion-label>
                <h2>{{ inv.senderEmail }}</h2>
                <p>{{ inv.createdAt | date:'dd/MM/yyyy' }}</p>
              </ion-label>
              <ion-button slot="end" fill="outline" color="success" size="small" (click)="accept(inv.id)">
                <ion-icon name="checkmark" slot="icon-only"></ion-icon>
              </ion-button>
              <ion-button slot="end" fill="outline" color="danger" size="small" (click)="reject(inv.id)">
                <ion-icon name="close" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Sent Invites -->
      <ion-card *ngIf="sentInvites.length > 0">
        <ion-card-header>
          <ion-card-title>
            Inviti inviati
            <ion-badge color="primary" class="ion-margin-start">{{ sentInvites.length }}</ion-badge>
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item *ngFor="let inv of sentInvites">
              <ion-label>
                <h2>{{ inv.receiverEmail }}</h2>
                <p>
                  <ion-badge [color]="getStatusColor(inv.status)">{{ inv.status }}</ion-badge>
                  &nbsp;{{ inv.createdAt | date:'dd/MM/yyyy' }}
                </p>
              </ion-label>
              <ion-button
                *ngIf="inv.status === 'PENDING'"
                slot="end"
                fill="outline"
                color="medium"
                size="small"
                (click)="revoke(inv.id)">
                <ion-icon name="person-remove" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <div *ngIf="collaborators.length === 0 && sentInvites.length === 0 && receivedInvites.length === 0"
           class="ion-text-center ion-padding">
        <p style="color: var(--ion-color-medium);">Nessun collaboratore ancora. Invia il tuo primo invito!</p>
      </div>

    </ion-content>
  `,
  styles: [`
    ion-buttons { display: flex; }
  `]
})
export class CollaborationPage implements OnInit {
  inviteEmail = '';
  collaborators: Collaborator[] = [];
  sentInvites: Invite[] = [];
  receivedInvites: Invite[] = [];

  constructor(
    private collaborationService: CollaborationService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ checkmark, close, personRemove, mail, people, refresh });
  }

  ngOnInit() {
    this.loadAll();
  }

  async loadAll() {
    const loading = await this.loadingCtrl.create({ message: 'Caricamento...' });
    await loading.present();
    try {
      await Promise.all([
        this.loadCollaborators(),
        this.loadInvites()
      ]);
    } finally {
      await loading.dismiss();
    }
  }

  private loadCollaborators(): Promise<void> {
    return new Promise((resolve) => {
      this.collaborationService.getCollaborators().subscribe({
        next: (list) => { this.collaborators = list; resolve(); },
        error: () => resolve()
      });
    });
  }

  private loadInvites(): Promise<void> {
    return new Promise((resolve) => {
      this.collaborationService.getInvites().subscribe({
        next: (data) => {
          this.sentInvites = data.sent;
          this.receivedInvites = data.received;
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  sendInvite() {
    const email = this.inviteEmail.trim();
    if (!email) return;
    this.collaborationService.sendInvite(email).subscribe({
      next: () => {
        this.inviteEmail = '';
        this.showToast('Invito inviato a ' + email, 'success');
        this.loadInvites();
      },
      error: async (e) => {
        await this.showToast(e.error?.message || 'Errore inviando invito', 'danger');
      }
    });
  }

  accept(id: string) {
    this.collaborationService.accept(id).subscribe({
      next: () => {
        this.showToast('Invito accettato', 'success');
        this.loadAll();
      },
      error: async (e) => {
        await this.showToast(e.error?.message || 'Errore accettando invito', 'danger');
      }
    });
  }

  reject(id: string) {
    this.collaborationService.reject(id).subscribe({
      next: () => {
        this.showToast('Invito rifiutato', 'medium');
        this.receivedInvites = this.receivedInvites.filter(i => i.id !== id);
      },
      error: async (e) => {
        await this.showToast(e.error?.message || 'Errore rifiutando invito', 'danger');
      }
    });
  }

  revoke(id: string) {
    this.collaborationService.revoke(id).subscribe({
      next: () => {
        this.showToast('Invito revocato', 'medium');
        this.sentInvites = this.sentInvites.filter(i => i.id !== id);
      },
      error: async (e) => {
        await this.showToast(e.error?.message || 'Errore revocando invito', 'danger');
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'danger';
      case 'REVOKED': return 'medium';
      default: return 'medium';
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2500, color });
    await toast.present();
  }
}
