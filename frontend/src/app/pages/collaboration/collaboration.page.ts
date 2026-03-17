import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonInput, IonBadge,
  IonSkeletonText,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline, personRemoveOutline, mailOutline, peopleOutline, refreshOutline, sendOutline, personAddOutline } from 'ionicons/icons';
import {
  CollaborationService,
  Collaborator,
  Invite
} from '../../features/collaboration/collaboration.service';

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
    IonSkeletonText
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
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: var(--app-shadow);
    }
    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: #1a1a1a;
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
      background: #F5F5F5;
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
      color: #bbb;
      font-size: 16px;
      flex-shrink: 0;
    }
    .invite-input-wrap ion-input {
      --padding-start: 8px;
      --background: transparent;
      --color: #1a1a1a;
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
      background: white;
      border-radius: 16px;
      box-shadow: var(--app-shadow);
      overflow: hidden;
    }
    .section-head {
      display: flex;
      align-items: center;
      padding: 14px 16px 10px;
      gap: 8px;
      border-bottom: 1px solid #f0f0f0;
    }
    .section-head ion-icon {
      font-size: 18px;
      color: var(--ion-color-primary);
    }
    .section-head-title {
      font-weight: 700;
      font-size: 0.92rem;
      flex: 1;
      color: #1a1a1a;
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
      border-bottom: 1px solid #f8f8f8;
    }
    .collab-row:last-child { border-bottom: none; }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2E7D32, #4CAF50);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }
    .avatar.orange {
      background: linear-gradient(135deg, #F57C00, #FFA000);
    }
    .avatar.purple {
      background: linear-gradient(135deg, #7B1FA2, #AB47BC);
    }

    .collab-info { flex: 1; overflow: hidden; }
    .collab-email {
      font-weight: 600;
      font-size: 0.88rem;
      color: #1a1a1a;
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
      border-bottom: 1px solid #f8f8f8;
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
      color: #1a1a1a;
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
      color: #333;
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
          <div style="background:white; border-radius:16px; overflow:hidden; box-shadow:var(--app-shadow);">
            <ion-skeleton-text animated style="height:110px; margin:0;"></ion-skeleton-text>
          </div>
          <div style="background:white; border-radius:16px; overflow:hidden; box-shadow:var(--app-shadow);">
            <ion-skeleton-text animated style="height:64px; margin:0;" *ngFor="let x of [1,2]"></ion-skeleton-text>
          </div>
        </ng-container>

        <ng-container *ngIf="!loading">
          <!-- Invite card -->
          <div class="invite-card">
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
              <ion-button class="send-btn" (click)="sendInvite()" [disabled]="!inviteEmail.trim()">
                <ion-icon name="send-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </div>
          </div>

          <!-- Received invites -->
          <div class="section-block" *ngIf="receivedInvites.length > 0">
            <div class="section-head">
              <ion-icon name="person-add-outline"></ion-icon>
              <span class="section-head-title">Inviti ricevuti</span>
              <span class="section-count">{{ receivedInvites.length }}</span>
            </div>
            <div class="received-row" *ngFor="let inv of receivedInvites">
              <div class="avatar orange">{{ getInitials(inv.senderEmail) }}</div>
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
              <div class="avatar">{{ getInitials(c.email) }}</div>
              <div class="collab-info">
                <div class="collab-email">{{ c.email }}</div>
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
              <div class="avatar purple">{{ getInitials(inv.receiverEmail) }}</div>
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

  constructor(
    private collaborationService: CollaborationService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ checkmarkOutline, closeOutline, personRemoveOutline, mailOutline, peopleOutline, refreshOutline, sendOutline, personAddOutline });
  }

  ngOnInit() {
    this.loadAll();
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

  getInitials(email: string): string {
    if (!email) return '?';
    const parts = email.split('@')[0].split(/[._\-]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return email.substring(0, 2).toUpperCase();
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
