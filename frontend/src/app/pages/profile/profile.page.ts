import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
  IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonInput, IonSelect,
  IonSelectOption, IonSkeletonText, IonSpinner,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, scaleOutline, bodyOutline, saveOutline, addOutline,
  checkmarkOutline, chevronDownOutline
} from 'ionicons/icons';
import { ProfileService, UserProfile, WeightRecord, BodyMeasurementRecord } from '../../features/profile/profile.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
    IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonInput, IonSelect,
    IonSelectOption, IonSkeletonText, IonSpinner,
  ],
  styles: [`
    .profile-hero {
      display: flex; flex-direction: column; align-items: center;
      padding: 28px 20px 20px;
      background: linear-gradient(160deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%);
    }
    .avatar-circle {
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(255,255,255,0.25);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 10px;
    }
    .avatar-circle ion-icon { font-size: 38px; color: white; }
    .hero-name { font-size: 1.15rem; font-weight: 700; color: white; text-align: center; margin-bottom: 2px; }
    .hero-email { font-size: 0.8rem; color: rgba(255,255,255,0.75); text-align: center; }

    .bmi-row { display: flex; gap: 10px; margin: 16px 14px 0; }
    .stat-card {
      flex: 1; background: var(--ion-card-background);
      border-radius: 14px; padding: 12px 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07);
      display: flex; flex-direction: column; align-items: center; gap: 2px;
    }
    .stat-label { font-size: 0.63rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--ion-color-medium); }
    .stat-value { font-size: 1.45rem; font-weight: 800; color: var(--ion-text-color); line-height: 1.1; }
    .stat-unit { font-size: 0.72rem; color: var(--ion-color-medium); }
    .bmi-chip { margin-top: 2px; padding: 2px 8px; border-radius: 20px; font-size: 0.67rem; font-weight: 700; text-align: center; }
    .bmi-under  { background: rgba(var(--ion-color-warning-rgb),0.15); color: var(--ion-color-warning-shade); }
    .bmi-normal { background: rgba(var(--ion-color-success-rgb),0.15); color: var(--ion-color-success-shade); }
    .bmi-over   { background: rgba(var(--ion-color-danger-rgb),0.15);  color: var(--ion-color-danger-shade); }

    .sections-wrap { margin: 14px 14px 0; display: flex; flex-direction: column; gap: 10px; }

    .section-card {
      background: var(--ion-card-background);
      border-radius: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07);
      overflow: hidden;
    }
    .section-header {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 16px;
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid var(--ion-border-color);
    }
    .section-header ion-icon { font-size: 20px; color: var(--ion-color-primary); flex-shrink: 0; }
    .section-header-title { flex: 1; font-weight: 700; font-size: 0.95rem; }
    .section-chevron {
      font-size: 14px; color: var(--ion-color-medium);
      transition: transform 0.2s;
    }
    .section-chevron.open { transform: rotate(180deg); }
    .section-body { padding: 14px 14px 16px; }

    .field-label {
      font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.6px; color: var(--ion-color-medium);
      margin-bottom: 4px; padding-left: 2px;
    }
    .field-wrap {
      background: var(--ion-color-light);
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .field-wrap ion-input {
      --padding-start: 12px; --padding-end: 12px;
      --padding-top: 10px; --padding-bottom: 10px;
      font-size: 0.92rem;
    }
    .field-wrap ion-select {
      padding: 10px 12px;
      font-size: 0.92rem;
      width: 100%;
    }
    .form-row { display: flex; gap: 10px; }
    .form-row .form-col { flex: 1; min-width: 0; }

    .inline-row { display: flex; gap: 8px; align-items: flex-end; margin-bottom: 12px; }
    .inline-row .field-wrap { flex: 1; margin-bottom: 0; }
    .inline-row ion-button { height: 42px; flex-shrink: 0; }

    .full-btn { width: 100%; margin-top: 4px; }

    .divider {
      font-size: 0.67rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.8px; color: var(--ion-color-medium);
      border-top: 1px solid var(--ion-border-color);
      padding: 10px 0 6px; margin: 8px 0 6px;
    }
    .history-list { display: flex; flex-direction: column; gap: 6px; }
    .history-item {
      display: flex; align-items: center; gap: 10px;
      background: var(--ion-color-light); border-radius: 10px; padding: 8px 12px;
    }
    .history-val { font-weight: 700; font-size: 0.95rem; flex: 1; }
    .history-date { font-size: 0.7rem; color: var(--ion-color-medium); }
    .empty-msg { font-size: 0.82rem; color: var(--ion-color-medium); text-align: center; padding: 8px 0; font-style: italic; }

    /* ── Body measurements visual ── */
    .meas-hint { text-align: center; font-size: 0.72rem; color: var(--ion-color-medium); font-style: italic; margin-bottom: 10px; }
    .body-canvas {
      position: relative;
      width: 100%;
      height: 500px;
      margin-bottom: 14px;
    }
    .sil-wrap {
      position: absolute;
      left: 50%; transform: translateX(-50%);
      top: 0; width: 100px; height: 500px;
      opacity: 0.13;
    }
    .sil { position: absolute; background: var(--ion-color-primary); left: 50%; transform: translateX(-50%); }
    .sil-head   { width: 40px; height: 40px; border-radius: 50%; top: 0; }
    .sil-neck   { width: 18px; height: 18px; top: 37px; }
    .sil-torso  { width: 68px; height: 155px; top: 52px; border-radius: 8px 8px 14px 14px; }
    .sil-hips   { width: 78px; height: 46px; top: 200px; border-radius: 4px 4px 14px 14px; }
    .sil-leg-l  { width: 29px; height: 140px; top: 242px; left: calc(50% - 34px); transform: none; border-radius: 4px 4px 10px 10px; }
    .sil-leg-r  { width: 29px; height: 140px; top: 242px; left: calc(50% + 5px);  transform: none; border-radius: 4px 4px 10px 10px; }
    .sil-arm-l  { width: 20px; height: 125px; top: 56px; left: calc(50% - 52px); transform: none; border-radius: 6px 6px 10px 10px; }
    .sil-arm-r  { width: 20px; height: 125px; top: 56px; left: calc(50% + 32px); transform: none; border-radius: 6px 6px 10px 10px; }

    .chip {
      position: absolute;
      background: var(--ion-card-background);
      border: 1.5px solid var(--ion-border-color);
      border-radius: 8px;
      padding: 5px 8px;
      min-width: 72px;
      max-width: 90px;
      box-shadow: 0 1px 5px rgba(0,0,0,0.1);
      cursor: pointer;
    }
    .chip:active { opacity: 0.7; }
    .chip-name-row { display: flex; align-items: center; gap: 2px; }
    .chip-name { font-size: 0.6rem; color: var(--ion-color-medium); font-weight: 600; }
    .chip-side-L { font-size: 0.58rem; font-weight: 800; color: var(--ion-color-primary); }
    .chip-side-R { font-size: 0.58rem; font-weight: 800; color: var(--ion-color-danger); }
    .chip-val { font-size: 0.84rem; font-weight: 700; color: var(--ion-text-color); }
    .chip-val.empty { color: var(--ion-color-medium); }

    /* right side: left:55% — left side: right:55% */
    .c-L { right: 55%; text-align: right; }
    .c-R { left: 55%; }
    .c-C { left: 50%; transform: translateX(-50%); }

    .c-collo   { top: 6px; }
    .c-spalle  { top: 60px; }
    .c-petto   { top: 106px; }
    .c-braccioL { top: 126px; }
    .c-braccioR { top: 155px; }
    .c-vita    { top: 190px; }
    .c-fianchi { top: 220px; }
    .c-cosciaL { top: 285px; }
    .c-cosciaR { top: 285px; }
    .c-polpaccioL { top: 370px; }
    .c-polpaccioR { top: 370px; }

    /* measurements history table */
    .mh-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; margin-top: 4px; }
    .mh-table th {
      font-size: 0.63rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
      color: var(--ion-color-medium); text-align: left; padding: 4px 5px;
      border-bottom: 1px solid var(--ion-border-color);
    }
    .mh-table td { padding: 5px 5px; border-bottom: 1px solid rgba(0,0,0,0.04); }
    .mh-table tr:last-child td { border-bottom: none; }
    .mh-table .dc { color: var(--ion-color-medium); font-size: 0.7rem; }
    .mh-table .vc { font-weight: 700; }

    .spacer { height: 28px; }
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Profilo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <!-- Hero -->
      <div class="profile-hero">
        <div class="avatar-circle">
          <ion-icon name="person-outline"></ion-icon>
        </div>
        <div class="hero-name">{{ displayName }}</div>
        <div class="hero-email">{{ userEmail }}</div>
      </div>

      <!-- Stat cards -->
      <ng-container *ngIf="!loading">
        <div class="bmi-row">
          <div class="stat-card">
            <span class="stat-label">Peso</span>
            <span class="stat-value">{{ latestWeight != null ? (latestWeight | number:'1.1-1') : '—' }}</span>
            <span class="stat-unit">kg</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Altezza</span>
            <span class="stat-value">{{ profile?.heightCm ? (profile!.heightCm | number:'1.0-0') : '—' }}</span>
            <span class="stat-unit">cm</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">BMI</span>
            <span class="stat-value">{{ bmiValue ?? '—' }}</span>
            <div [class]="'bmi-chip ' + bmiClass" *ngIf="bmiValue">{{ bmiLabel }}</div>
          </div>
        </div>
      </ng-container>

      <!-- Skeleton -->
      <div style="margin:16px 14px 0; display:flex; flex-direction:column; gap:10px;" *ngIf="loading">
        <ion-skeleton-text animated style="height:72px; border-radius:14px;"></ion-skeleton-text>
        <ion-skeleton-text animated style="height:48px; border-radius:14px;"></ion-skeleton-text>
        <ion-skeleton-text animated style="height:48px; border-radius:14px;"></ion-skeleton-text>
      </div>

      <!-- Sections -->
      <div class="sections-wrap" *ngIf="!loading">

        <!-- ─── 1. Dati personali ─── -->
        <div class="section-card">
          <div class="section-header" (click)="openPersonal = !openPersonal">
            <ion-icon name="person-outline"></ion-icon>
            <span class="section-header-title">Dati personali</span>
            <ion-icon name="chevron-down-outline" class="section-chevron" [class.open]="openPersonal"></ion-icon>
          </div>
          <div class="section-body" *ngIf="openPersonal">
            <div class="form-row">
              <div class="form-col">
                <div class="field-label">Nome</div>
                <div class="field-wrap">
                  <ion-input
                    [value]="draftPersonal.firstName"
                    (ionInput)="draftPersonal.firstName = $event.detail.value ?? ''"
                    placeholder="Nome">
                  </ion-input>
                </div>
              </div>
              <div class="form-col">
                <div class="field-label">Cognome</div>
                <div class="field-wrap">
                  <ion-input
                    [value]="draftPersonal.lastName"
                    (ionInput)="draftPersonal.lastName = $event.detail.value ?? ''"
                    placeholder="Cognome">
                  </ion-input>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <div class="field-label">Data di nascita</div>
                <div class="field-wrap">
                  <ion-input
                    type="date"
                    [value]="draftPersonal.birthDate"
                    (ionChange)="draftPersonal.birthDate = $event.detail.value ?? ''">
                  </ion-input>
                </div>
              </div>
              <div class="form-col">
                <div class="field-label">Genere</div>
                <div class="field-wrap">
                  <ion-select
                    [(ngModel)]="draftPersonal.gender"
                    placeholder="Seleziona"
                    interface="action-sheet">
                    <ion-select-option value="M">Maschio</ion-select-option>
                    <ion-select-option value="F">Femmina</ion-select-option>
                    <ion-select-option value="OTHER">Altro</ion-select-option>
                  </ion-select>
                </div>
              </div>
            </div>
            <ion-button class="full-btn" expand="block" (click)="savePersonal()" [disabled]="savingPersonal">
              <ion-spinner *ngIf="savingPersonal" name="crescent" slot="start" style="width:16px;height:16px;margin-right:6px;"></ion-spinner>
              <ion-icon *ngIf="!savingPersonal" name="save-outline" slot="start"></ion-icon>
              Salva dati personali
            </ion-button>
          </div>
        </div>

        <!-- ─── 2. Peso e altezza ─── -->
        <div class="section-card">
          <div class="section-header" (click)="openBody = !openBody">
            <ion-icon name="scale-outline"></ion-icon>
            <span class="section-header-title">Peso e altezza</span>
            <ion-icon name="chevron-down-outline" class="section-chevron" [class.open]="openBody"></ion-icon>
          </div>
          <div class="section-body" *ngIf="openBody">

            <!-- Altezza -->
            <div class="field-label">Altezza (cm)</div>
            <div class="inline-row">
              <div class="field-wrap">
                <ion-input
                  type="number"
                  inputmode="decimal"
                  placeholder="es. 175"
                  [value]="draftHeight ?? ''"
                  (ionInput)="draftHeight = toNum($event.detail.value)">
                </ion-input>
              </div>
              <ion-button (click)="saveHeight()" [disabled]="savingHeight" style="height:42px;">
                <ion-spinner *ngIf="savingHeight" name="crescent" style="width:14px;height:14px;"></ion-spinner>
                <ion-icon *ngIf="!savingHeight" name="save-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </div>

            <!-- Peso -->
            <div class="field-label">Registra peso</div>
            <div class="inline-row">
              <div class="field-wrap">
                <ion-input
                  type="number"
                  inputmode="decimal"
                  placeholder="kg"
                  step="0.1"
                  [value]="newWeightInput"
                  (ionInput)="newWeightInput = $event.detail.value ?? ''">
                </ion-input>
              </div>
              <ion-button (click)="addWeight()" [disabled]="savingWeight">
                <ion-spinner *ngIf="savingWeight" name="crescent" style="width:14px;height:14px;"></ion-spinner>
                <ion-icon *ngIf="!savingWeight" name="add-outline" slot="start"></ion-icon>
                Salva
              </ion-button>
            </div>

            <!-- Storico pesi -->
            <div class="divider">Storico pesi</div>
            <div class="empty-msg" *ngIf="weightHistory.length === 0">Nessun dato registrato</div>
            <div class="history-list">
              <div class="history-item" *ngFor="let w of weightHistory">
                <ion-icon name="scale-outline" style="font-size:15px;color:var(--ion-color-primary);flex-shrink:0;"></ion-icon>
                <span class="history-val">{{ w.weightKg | number:'1.1-1' }} kg</span>
                <span class="history-date">{{ w.recordedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── 3. Misure corporee ─── -->
        <div class="section-card">
          <div class="section-header" (click)="openMeasurements = !openMeasurements">
            <ion-icon name="body-outline"></ion-icon>
            <span class="section-header-title">Misure corporee</span>
            <ion-icon name="chevron-down-outline" class="section-chevron" [class.open]="openMeasurements"></ion-icon>
          </div>
          <div class="section-body" *ngIf="openMeasurements">

            <div class="meas-hint">Tocca una misura per modificarla, poi premi "Salva misure"</div>

            <!-- Body canvas -->
            <div class="body-canvas">
              <!-- Silhouette -->
              <div class="sil-wrap">
                <div class="sil sil-head"></div>
                <div class="sil sil-neck"></div>
                <div class="sil sil-torso"></div>
                <div class="sil sil-hips"></div>
                <div class="sil sil-leg-l"></div>
                <div class="sil sil-leg-r"></div>
                <div class="sil sil-arm-l"></div>
                <div class="sil sil-arm-r"></div>
              </div>

              <!-- Chips — left side (c-L = right:55%) -->
              <div class="chip c-L c-spalle" (click)="editMeas('spalle', 'Spalle')">
                <div class="chip-name-row"><span class="chip-name">Spalle</span></div>
                <div class="chip-val" [class.empty]="!measDraft['spalle']">{{ fmtMeas('spalle') }}</div>
              </div>
              <div class="chip c-L c-braccioL" (click)="editMeas('braccioL', 'Braccio')">
                <div class="chip-name-row"><span class="chip-name">Braccio</span><span class="chip-side-L">&nbsp;L</span></div>
                <div class="chip-val" [class.empty]="!measDraft['braccioL']">{{ fmtMeas('braccioL') }}</div>
              </div>
              <div class="chip c-L c-vita" (click)="editMeas('vita', 'Vita')">
                <div class="chip-name-row"><span class="chip-name">Vita</span></div>
                <div class="chip-val" [class.empty]="!measDraft['vita']">{{ fmtMeas('vita') }}</div>
              </div>
              <div class="chip c-L c-cosciaL" (click)="editMeas('cosciaL', 'Coscia')">
                <div class="chip-name-row"><span class="chip-name">Coscia</span><span class="chip-side-L">&nbsp;L</span></div>
                <div class="chip-val" [class.empty]="!measDraft['cosciaL']">{{ fmtMeas('cosciaL') }}</div>
              </div>
              <div class="chip c-L c-polpaccioL" (click)="editMeas('polpaccioL', 'Polpaccio')">
                <div class="chip-name-row"><span class="chip-name">Polpaccio</span><span class="chip-side-L">&nbsp;L</span></div>
                <div class="chip-val" [class.empty]="!measDraft['polpaccioL']">{{ fmtMeas('polpaccioL') }}</div>
              </div>

              <!-- Chips — center-right (c-C) -->
              <div class="chip c-C c-collo" (click)="editMeas('collo', 'Collo')" style="left:auto;right:0;transform:none;left:55%;">
                <div class="chip-name-row"><span class="chip-name">Collo</span></div>
                <div class="chip-val" [class.empty]="!measDraft['collo']">{{ fmtMeas('collo') }}</div>
              </div>

              <!-- Chips — right side (c-R = left:55%) -->
              <div class="chip c-R c-petto" (click)="editMeas('petto', 'Petto')">
                <div class="chip-name-row"><span class="chip-name">Petto</span></div>
                <div class="chip-val" [class.empty]="!measDraft['petto']">{{ fmtMeas('petto') }}</div>
              </div>
              <div class="chip c-R c-braccioR" (click)="editMeas('braccioR', 'Braccio')">
                <div class="chip-name-row"><span class="chip-name">Braccio</span><span class="chip-side-R">&nbsp;R</span></div>
                <div class="chip-val" [class.empty]="!measDraft['braccioR']">{{ fmtMeas('braccioR') }}</div>
              </div>
              <div class="chip c-R c-fianchi" (click)="editMeas('fianchi', 'Fianchi')">
                <div class="chip-name-row"><span class="chip-name">Fianchi</span></div>
                <div class="chip-val" [class.empty]="!measDraft['fianchi']">{{ fmtMeas('fianchi') }}</div>
              </div>
              <div class="chip c-R c-cosciaR" (click)="editMeas('cosciaR', 'Coscia')">
                <div class="chip-name-row"><span class="chip-name">Coscia</span><span class="chip-side-R">&nbsp;R</span></div>
                <div class="chip-val" [class.empty]="!measDraft['cosciaR']">{{ fmtMeas('cosciaR') }}</div>
              </div>
              <div class="chip c-R c-polpaccioR" (click)="editMeas('polpaccioR', 'Polpaccio')">
                <div class="chip-name-row"><span class="chip-name">Polpaccio</span><span class="chip-side-R">&nbsp;R</span></div>
                <div class="chip-val" [class.empty]="!measDraft['polpaccioR']">{{ fmtMeas('polpaccioR') }}</div>
              </div>
            </div>

            <ion-button class="full-btn" expand="block" (click)="saveMeasurements()" [disabled]="savingMeasurements">
              <ion-spinner *ngIf="savingMeasurements" name="crescent" slot="start" style="width:16px;height:16px;margin-right:6px;"></ion-spinner>
              <ion-icon *ngIf="!savingMeasurements" name="checkmark-outline" slot="start"></ion-icon>
              Salva misure
            </ion-button>

            <!-- Measurements history -->
            <div class="divider" style="margin-top:16px;">Storico misure</div>
            <div class="empty-msg" *ngIf="measurementsHistory.length === 0">Nessuna misura registrata</div>
            <ng-container *ngIf="measurementsHistory.length > 0">
              <table class="mh-table">
                <thead>
                  <tr>
                    <th>Data</th><th>Vita</th><th>Fianchi</th><th>Petto</th><th>Collo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let m of measurementsHistory">
                    <td class="dc">{{ m.recordedAt | date:'dd/MM/yy' }}</td>
                    <td class="vc">{{ m.vita ? (m.vita + 'cm') : '—' }}</td>
                    <td class="vc">{{ m.fianchi ? (m.fianchi + 'cm') : '—' }}</td>
                    <td class="vc">{{ m.petto ? (m.petto + 'cm') : '—' }}</td>
                    <td class="vc">{{ m.collo ? (m.collo + 'cm') : '—' }}</td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="showAllMeasHistory" style="margin-top:8px;">
                <table class="mh-table">
                  <thead>
                    <tr><th>Data</th><th>Sp.</th><th>Br.L</th><th>Br.R</th><th>Co.L</th><th>Co.R</th><th>Po.L</th><th>Po.R</th></tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let m of measurementsHistory">
                      <td class="dc">{{ m.recordedAt | date:'dd/MM/yy' }}</td>
                      <td class="vc">{{ m.spalle ?? '—' }}</td>
                      <td class="vc">{{ m.braccioL ?? '—' }}</td>
                      <td class="vc">{{ m.braccioR ?? '—' }}</td>
                      <td class="vc">{{ m.cosciaL ?? '—' }}</td>
                      <td class="vc">{{ m.cosciaR ?? '—' }}</td>
                      <td class="vc">{{ m.polpaccioL ?? '—' }}</td>
                      <td class="vc">{{ m.polpaccioR ?? '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ion-button fill="clear" size="small" (click)="showAllMeasHistory = !showAllMeasHistory" style="margin-top:4px;">
                {{ showAllMeasHistory ? 'Mostra meno' : 'Tutte le misure' }}
              </ion-button>
            </ng-container>

          </div>
        </div>

      </div><!-- /sections-wrap -->

      <div class="spacer"></div>
    </ion-content>
  `
})
export class ProfilePage implements OnInit {
  loading = true;
  profile: UserProfile | null = null;
  weightHistory: WeightRecord[] = [];
  measurementsHistory: BodyMeasurementRecord[] = [];

  openPersonal = true;
  openBody = true;
  openMeasurements = true;
  showAllMeasHistory = false;

  savingPersonal = false;
  savingHeight = false;
  savingWeight = false;
  savingMeasurements = false;

  draftPersonal = { firstName: '', lastName: '', birthDate: '', gender: '' as any };
  draftHeight: number | null = null;
  newWeightInput = '';

  /** Flat draft of current measurement values — always a new object on mutation */
  measDraft: Record<string, number | null> = {
    collo: null, spalle: null, petto: null,
    braccioL: null, braccioR: null,
    vita: null, fianchi: null,
    cosciaL: null, cosciaR: null,
    polpaccioL: null, polpaccioR: null,
  };

  readonly MEAS_KEYS = ['collo','spalle','petto','braccioL','braccioR','vita','fianchi','cosciaL','cosciaR','polpaccioL','polpaccioR'];

  get userEmail(): string { return this.authService.userEmail ?? ''; }

  get displayName(): string {
    const fn = this.profile?.firstName?.trim();
    const ln = this.profile?.lastName?.trim();
    if (fn && ln) return `${fn} ${ln}`;
    if (fn) return fn;
    return this.userEmail;
  }

  get latestWeight(): number | null {
    return this.weightHistory.length ? Number(this.weightHistory[0].weightKg) : null;
  }

  get bmiValue(): string | null {
    const w = this.latestWeight;
    const h = this.profile?.heightCm ? Number(this.profile.heightCm) : null;
    if (!w || !h) return null;
    return (w / ((h / 100) ** 2)).toFixed(1);
  }

  get bmiClass(): string {
    const b = parseFloat(this.bmiValue ?? '');
    if (isNaN(b)) return '';
    if (b < 18.5) return 'bmi-under';
    if (b < 25) return 'bmi-normal';
    return 'bmi-over';
  }

  get bmiLabel(): string {
    const b = parseFloat(this.bmiValue ?? '');
    if (isNaN(b)) return '';
    if (b < 18.5) return 'Sottopeso';
    if (b < 25) return 'Normopeso';
    if (b < 30) return 'Sovrappeso';
    return 'Obeso';
  }

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {
    addIcons({ personOutline, scaleOutline, bodyOutline, saveOutline, addOutline, checkmarkOutline, chevronDownOutline });
  }

  ngOnInit() { this.loadAll(); }
  ionViewWillEnter() { if (!this.loading) this.loadAll(); }

  loadAll() {
    this.loading = true;
    let done = 0;
    const check = () => { if (++done === 3) this.loading = false; };

    this.profileService.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.draftPersonal = {
          firstName: p.firstName ?? '',
          lastName: p.lastName ?? '',
          birthDate: p.birthDate ?? '',
          gender: p.gender ?? ''
        };
        this.draftHeight = p.heightCm ? Number(p.heightCm) : null;
        check();
      },
      error: () => check()
    });

    this.profileService.getWeightHistory().subscribe({
      next: (h) => { this.weightHistory = h; check(); },
      error: () => check()
    });

    this.profileService.getMeasurementsHistory().subscribe({
      next: (h) => {
        this.measurementsHistory = h;
        if (h.length > 0) {
          const last = h[0];
          this.measDraft = {};
          this.MEAS_KEYS.forEach(k => { this.measDraft[k] = (last as any)[k] ?? null; });
        }
        check();
      },
      error: () => check()
    });
  }

  toNum(v: string | null | undefined): number | null {
    if (v === null || v === undefined || v === '') return null;
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
  }

  fmtMeas(key: string): string {
    const v = this.measDraft[key];
    return v != null ? `${v}cm` : '—';
  }

  savePersonal() {
    this.savingPersonal = true;
    const dto: any = {
      firstName: this.draftPersonal.firstName?.trim() || null,
      lastName: this.draftPersonal.lastName?.trim() || null,
      birthDate: this.draftPersonal.birthDate || null,
      gender: this.draftPersonal.gender || null,
    };
    this.profileService.updateProfile(dto).subscribe({
      next: (p) => { this.profile = p; this.savingPersonal = false; this.toast('Dati personali salvati', 'success'); },
      error: () => { this.savingPersonal = false; this.toast('Errore nel salvataggio', 'danger'); }
    });
  }

  saveHeight() {
    const h = this.draftHeight;
    if (!h || h < 50 || h > 250) { this.toast('Altezza non valida (50–250 cm)', 'warning'); return; }
    this.savingHeight = true;
    this.profileService.updateProfile({ heightCm: h }).subscribe({
      next: (p) => { this.profile = p; this.savingHeight = false; this.toast('Altezza salvata', 'success'); },
      error: () => { this.savingHeight = false; this.toast('Errore', 'danger'); }
    });
  }

  addWeight() {
    const w = parseFloat(this.newWeightInput);
    if (isNaN(w) || w < 20 || w > 300) { this.toast('Peso non valido (20–300 kg)', 'warning'); return; }
    this.savingWeight = true;
    this.profileService.addWeight(w).subscribe({
      next: (rec) => {
        this.weightHistory = [rec, ...this.weightHistory];
        this.newWeightInput = '';
        this.savingWeight = false;
        this.toast('Peso registrato', 'success');
      },
      error: () => { this.savingWeight = false; this.toast('Errore', 'danger'); }
    });
  }

  async editMeas(key: string, label: string) {
    const current = this.measDraft[key];
    const alert = await this.alertCtrl.create({
      header: label,
      message: 'Inserisci la misura in cm',
      inputs: [{
        name: 'v', type: 'number', placeholder: 'cm',
        value: current != null ? String(current) : '',
        min: 0, max: 500,
        attributes: { inputmode: 'decimal' }
      }],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'OK',
          handler: (data) => {
            const raw = data.v;
            const val = (raw === '' || raw === null || raw === undefined) ? null : parseFloat(raw);
            // Create new object to trigger change detection
            this.measDraft = { ...this.measDraft, [key]: (val != null && !isNaN(val)) ? val : null };
          }
        }
      ]
    });
    await alert.present();
  }

  saveMeasurements() {
    const dto: any = {};
    this.MEAS_KEYS.forEach(k => { dto[k] = this.measDraft[k] ?? null; });

    const hasAny = this.MEAS_KEYS.some(k => dto[k] != null);
    if (!hasAny) { this.toast('Inserisci almeno una misura', 'warning'); return; }

    this.savingMeasurements = true;
    this.profileService.addMeasurements(dto).subscribe({
      next: (rec) => {
        this.measurementsHistory = [rec, ...this.measurementsHistory];
        this.savingMeasurements = false;
        this.toast('Misure salvate', 'success');
      },
      error: () => { this.savingMeasurements = false; this.toast('Errore nel salvataggio', 'danger'); }
    });
  }

  private async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2200, color, position: 'top' });
    await t.present();
  }
}
