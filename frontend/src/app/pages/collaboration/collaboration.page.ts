import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonInput, IonBadge,
  IonSkeletonText,
  AlertController, ToastController, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline, personRemoveOutline, mailOutline, peopleOutline, refreshOutline, sendOutline, personAddOutline, calendarOutline, chevronDownOutline } from 'ionicons/icons';
import {
  CollaborationService,
  Collaborator,
  Invite
} from '../../features/collaboration/collaboration.service';
import { CollaboratorMenuComponent } from '../../shared/collaborator-menu/collaborator-menu.component';

const STATUS_IT: Record<string, string> = {
  PENDING: 'In attesa',
  ACCEPTED: 'Accettato',
  REJECTED: 'Rifiutato',
  REVOKED: 'Revocato'
};

@Component({
  selector: 'app-collaboration',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonInput, IonBadge,
    IonSkeletonText,
    CollaboratorMenuComponent
  ],
  styles: [`
    .collab-content {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Invite card */
    .invite-card {
      background: var(--ion-card-background);
      border-radius: 16px;
      padding: 20px;
      box-shadow: var(--app-shadow);
    }
    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--ion-text-color);
      margin: 0 0 4px;
    }
    .card-subtitle {
      font-size: 0.8rem;
      color: var(--ion-color-medium);
      margin: 0 0 16px;
    }
    .invite-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .invite-input-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      background: var(--ion-color-light);
      border-radius: 10px;
      border: 2px solid transparent;
      padding: 0 12px;
      transition: border-color 0.2s;
    }
    .invite-input-wrap:focus-within {
      border-color: var(--ion-color-primary);
      background: #fff;
    }
    .invite-input-wrap ion-icon {
      color: var(--ion-color-medium);
      font-size: 16px;
      flex-shrink: 0;
    }
    .invite-input-wrap ion-input {
      --padding-start: 8px;
      --background: transparent;
      --color: var(--ion-text-color);
      font-size: 0.9rem;
    }
    .send-btn {
      --background: var(--ion-color-primary);
      --border-radius: 10px;
      --box-shadow: none;
      height: 44px;
      flex-shrink: 0;
    }

    /* Section block */
    .section-block {
      background: var(--ion-card-background);
      border-radius: 16px;
      box-shadow: var(--app-shadow);
      overflow: hidden;
    }
    .section-head {
      display: flex;
      align-items: center;
      padding: 14px 16px 10px;
      gap: 8px;
      border-bottom: 1px solid var(--ion-border-color);
    }
    .section-head ion-icon {
      font-size: 18px;
      color: var(--ion-color-primary);
    }
    .section-head-title {
      font-weight: 700;
      font-size: 0.92rem;
      flex: 1;
      color: var(--ion-text-color);
    }
    .section-count {
      font-size: 0.75rem;
      font-weight: 700;
      background: rgba(46,125,50,0.12);
      color: var(--ion-color-primary);
      border-radius: 20px;
      padding: 2px 8px;
    }

    /* Collaborator row */
    .collab-row {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 12px;
      border-bottom: 1px solid var(--ion-border-color);
    }
    .collab-row:last-child { border-bottom: none; }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .collab-info { flex: 1; overflow: hidden; }
    .collab-email {
      font-weight: 600;
      font-size: 0.88rem;
      color: var(--ion-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .collab-date {
      font-size: 0.75rem;
      color: var(--ion-color-medium);
      margin-top: 2px;
    }

    .status-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 20px;
      flex-shrink: 0;
    }
    .status-pending  { background: rgba(251,192,45,0.15); color: #b8860b; }
    .status-accepted { background: rgba(56,142,60,0.12); color: #388E3C; }
    .status-rejected { background: rgba(211,47,47,0.1); color: #D32F2F; }
    .status-revoked  { background: rgba(117,117,117,0.12); color: #757575; }

    .action-btn-group {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }

    /* Received invite row */
    .received-row {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 10px;
      border-bottom: 1px solid var(--ion-border-color);
    }
    .received-row:last-child { border-bottom: none; }
    .received-info { flex: 1; overflow: hidden; }
    .received-from {
      font-size: 0.75rem;
      color: var(--ion-color-medium);
      margin-bottom: 1px;
    }
    .received-email {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--ion-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .accept-btn {
      --background: rgba(56,142,60,0.1);
      --color: #388E3C;
      --border-radius: 8px;
      --box-shadow: none;
      height: 36px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .reject-btn {
      --background: rgba(211,47,47,0.08);
      --color: #D32F2F;
      --border-radius: 8px;
      --box-shadow: none;
      height: 36px;
      font-size: 0.8rem;
      font-weight: 700;
    }

    /* Collapsed invite row */
    .invite-collapsed {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--ion-card-background);
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: var(--app-shadow);
      cursor: pointer;
      color: var(--ion-color-primary);
      font-size: 0.88rem;
      font-weight: 600;
      border: 1px dashed rgba(var(--ion-color-primary-rgb), 0.3);
    }
    .invite-collapsed ion-icon { font-size: 18px; flex-shrink: 0; }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      gap: 12px;
      text-align: center;
    }
    .empty-icon {
      font-size: 64px;
      opacity: 0.2;
      color: var(--ion-color-primary);
    }
    .empty-state h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--ion-color-dark);
      margin: 0;
    }
    .empty-state p {
      font-size: 0.875rem;
      color: var(--ion-color-medium);
      margin: 0;
      max-width: 260px;
      line-height: 1.5;
    }
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Collaboratori</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" style="--color:white" (click)="loadAll()">
            <ion-icon name="refresh-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="collab-content">

        <!-- Skeleton -->
        <ng-container *ngIf="loading">
          <div style="background:var(--ion-card-background); border-radius:16px; overflow:hidden; box-shadow:var(--app-shadow);">
            <ion-skeleton-text animated style="height:110px; margin:0;"></ion-skeleton-text>
          </div>
          <div style="background:var(--ion-card-background); border-radius:16px; overflow:hidden; box-shadow:var(--app-shadow);">
            <ion-skeleton-text animated style="height:64px; margin:0;" *ngFor="let x of [1,2]"></ion-skeleton-text>
          </div>
        </ng-container>

        <ng-container *ngIf="!loading">
          <!-- Invite card — collapsed to a single button when collaborators already exist -->
          <div class="invite-card" *ngIf="collaborators.length === 0 || showInviteForm">
            <p class="card-title">Invita un collaboratore</p>
            <p class="card-subtitle">Il collaboratore potrà visualizzare e modificare il tuo menù</p>
            <div class="invite-row">
              <div class="invite-input-wrap">
                <ion-icon name="mail-outline"></ion-icon>
                <ion-input
                  type="email"
                  placeholder="email@esempio.it"
                  [(ngModel)]="inviteEmail"
                  (keyup.enter)="sendInvite()">
                </ion-input>
              </div>
              <ion-button class="send-btn" (click)="sendInvite()" [disabled]="!isValidEmail(inviteEmail)">
                <ion-icon name="send-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </div>
            <ion-button *ngIf="collaborators.length > 0" fill="clear" color="medium" size="small"
              style="margin-top:8px;" (click)="showInviteForm = false">
              Chiudi
            </ion-button>
          </div>
          <div class="invite-collapsed" *ngIf="collaborators.length > 0 && !showInviteForm"
            (click)="showInviteForm = true">
            <ion-icon name="person-add-outline"></ion-icon>
            <span>Invita un altro collaboratore</span>
            <ion-icon name="chevron-down-outline" style="margin-left:auto; color:var(--ion-color-medium);"></ion-icon>
          </div>

          <!-- Received invites -->
          <div class="section-block" *ngIf="receivedInvites.length > 0">
            <div class="section-head">
              <ion-icon name="person-add-outline"></ion-icon>
              <span class="section-head-title">Inviti ricevuti</span>
              <span class="section-count">{{ receivedInvites.length }}</span>
            </div>
            <div class="received-row" *ngFor="let inv of receivedInvites">
              <div class="avatar" [style.background]="getAvatarGradient(inv.senderEmail)">{{ getInitials(inv.senderEmail) }}</div>
              <div class="received-info">
                <div class="received-from">Invito da</div>
                <div class="received-email">{{ inv.senderEmail }}</div>
                <div class="collab-date">{{ inv.createdAt | date:'dd/MM/yyyy' }}</div>
              </div>
              <div class="action-btn-group">
                <ion-button class="accept-btn" fill="solid" size="small" (click)="accept(inv.id)">
                  Accetta
                </ion-button>
                <ion-button class="reject-btn" fill="solid" size="small" (click)="reject(inv.id)">
                  Rifiuta
                </ion-button>
              </div>
            </div>
          </div>

          <!-- Active collaborators -->
          <div class="section-block" *ngIf="collaborators.length > 0">
            <div class="section-head">
              <ion-icon name="people-outline"></ion-icon>
              <span class="section-head-title">Collaboratori attivi</span>
              <span class="section-count">{{ collaborators.length }}</span>
            </div>
            <div class="collab-row" *ngFor="let c of collaborators">
              <div class="avatar" [style.background]="getAvatarGradient(c.email)">{{ getInitials(c.email) }}</div>
              <div class="collab-info">
                <div class="collab-email">{{ c.email }}</div>
              </div>
              <div style="display: flex; gap: 2px; flex-shrink: 0;">
                <ion-button fill="clear" color="primary" size="small" (click)="viewMenu(c)" title="Vedi menù di {{ c.email }}" style="--border-radius: 8px; height: 34px;">
                  <ion-icon name="calendar-outline" slot="icon-only"></ion-icon>
                </ion-button>
                <ion-button fill="clear" color="danger" size="small" (click)="disconnect(c)" title="Rimuovi collaboratore">
                  <ion-icon name="person-remove-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
            </div>
          </div>

          <!-- Sent invites -->
          <div class="section-block" *ngIf="sentInvites.length > 0">
            <div class="section-head">
              <ion-icon name="mail-outline"></ion-icon>
              <span class="section-head-title">Inviti inviati</span>
              <span class="section-count">{{ sentInvites.length }}</span>
            </div>
            <div class="collab-row" *ngFor="let inv of sentInvites">
              <div class="avatar" [style.background]="getAvatarGradient(inv.receiverEmail)">{{ getInitials(inv.receiverEmail) }}</div>
              <div class="collab-info">
                <div class="collab-email">{{ inv.receiverEmail }}</div>
                <div class="collab-date">{{ inv.createdAt | date:'dd/MM/yyyy' }}</div>
              </div>
              <span class="status-badge" [ngClass]="getStatusClass(inv.status)">
                {{ getStatusLabel(inv.status) }}
              </span>
              <ion-button
                *ngIf="inv.status === 'PENDING'"
                fill="clear"
                color="medium"
                size="small"
                (click)="revoke(inv.id)">
                <ion-icon name="close-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </div>
          </div>

          <!-- Empty state -->
          <div class="empty-state"
            *ngIf="collaborators.length === 0 && sentInvites.length === 0 && receivedInvites.length === 0">
            <ion-icon name="people-outline" class="empty-icon"></ion-icon>
            <h3>Nessun collaboratore</h3>
            <p>Invita qualcuno per pianificare i pasti insieme e condividere il menù settimanale.</p>
          </div>
        </ng-container>

      </div>
    </ion-content>
  `
})
export class CollaborationPage implements OnInit {
  inviteEmail = '';
  collaborators: Collaborator[] = [];
  sentInvites: Invite[] = [];
  receivedInvites: Invite[] = [];
  loading = true;
  showInviteForm = false;

  constructor(
    private collaborationService: CollaborationService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
    addIcons({ checkmarkOutline, closeOutline, personRemoveOutline, mailOutline, peopleOutline, refreshOutline, sendOutline, personAddOutline, calendarOutline, chevronDownOutline });
  }

  ngOnInit() {
    this.loadAll();
  }

  ionViewWillEnter() {
    if (!this.loading) {
      Promise.all([this.loadCollaborators(), this.loadInvites()]);
    }
  }

  async loadAll() {
    this.loading = true;
    try {
      await Promise.all([
        this.loadCollaborators(),
        this.loadInvites()
      ]);
    } finally {
      this.loading = false;
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
          this.receivedInvites = data.received.filter((i: any) =>
            i.status?.toLowerCase() === 'pending'
          );
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

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
  }

  getInitials(email: string): string {
    if (!email) return '?';
    const parts = email.split('@')[0].split(/[._\-]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return email.substring(0, 2).toUpperCase();
  }

  getAvatarGradient(email: string): string {
    const palettes = [
      'linear-gradient(135deg, #2E7D32, #4CAF50)',
      'linear-gradient(135deg, #F57C00, #FFA000)',
      'linear-gradient(135deg, #7B1FA2, #AB47BC)',
      'linear-gradient(135deg, #1565C0, #1E88E5)',
      'linear-gradient(135deg, #00695C, #00897B)',
      'linear-gradient(135deg, #C62828, #E53935)',
    ];
    let hash = 0;
    for (let i = 0; i < (email || '').length; i++) {
      hash = (hash * 31 + email.charCodeAt(i)) & 0xffffffff;
    }
    return palettes[Math.abs(hash) % palettes.length];
  }

  async disconnect(c: Collaborator) {
    const alert = await this.alertCtrl.create({
      header: 'Rimuovi collaboratore',
      message: `Rimuovere ${c.email} dai collaboratori? La lista della spesa non sarà più condivisa.`,
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Rimuovi', role: 'destructive',
          handler: () => {
            this.collaborationService.disconnect(c.id).subscribe({
              next: () => {
                this.collaborators = this.collaborators.filter(x => x.id !== c.id);
                this.showToast('Collaboratore rimosso', 'medium');
              },
              error: async (e) => {
                await this.showToast(e.error?.message || 'Errore rimuovendo collaboratore', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async viewMenu(c: Collaborator) {
    const modal = await this.modalCtrl.create({
      component: CollaboratorMenuComponent,
      componentProps: { collaboratorId: c.id, collaboratorEmail: c.email }
    });
    await modal.present();
  }

  getStatusLabel(status: string): string {
    return STATUS_IT[status] || status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':  return 'status-pending';
      case 'ACCEPTED': return 'status-accepted';
      case 'REJECTED': return 'status-rejected';
      case 'REVOKED':  return 'status-revoked';
      default: return 'status-revoked';
    }
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
