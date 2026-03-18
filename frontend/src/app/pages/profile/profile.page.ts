import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonInput, IonSelect,
  IonSelectOption, IonSkeletonText, IonSpinner,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, scaleOutline, bodyOutline, saveOutline, addOutline,
  chevronDownOutline, timeOutline, trashOutline, checkmarkOutline,
  fitnessOutline, calendarOutline, barbellOutline
} from 'ionicons/icons';
import { ProfileService, UserProfile, WeightRecord, BodyMeasurementRecord } from '../../features/profile/profile.service';
import { AuthService } from '../../core/services/auth.service';

interface MeasField {
  key: keyof BodyMeasurementRecord;
  label: string;
  side?: 'L' | 'R';
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonInput, IonSelect,
    IonSelectOption, IonSkeletonText, IonSpinner,
  ],
  styles: [`
    /* ─── Avatar header ─── */
    .profile-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
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
    .hero-name {
      font-size: 1.2rem; font-weight: 700; color: white;
      text-align: center; margin-bottom: 2px;
    }
    .hero-email { font-size: 0.8rem; color: rgba(255,255,255,0.75); text-align: center; }

    /* ─── BMI card ─── */
    .bmi-row {
      display: flex; gap: 12px; margin: 16px 14px 0;
    }
    .stat-card {
      flex: 1; background: var(--ion-card-background);
      border-radius: 14px; padding: 14px 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07);
      display: flex; flex-direction: column; align-items: center;
      gap: 4px;
    }
    .stat-label {
      font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.8px; color: var(--ion-color-medium);
    }
    .stat-value {
      font-size: 1.5rem; font-weight: 800; color: var(--ion-text-color);
      line-height: 1;
    }
    .stat-unit { font-size: 0.75rem; color: var(--ion-color-medium); font-weight: 500; }
    .bmi-chip {
      margin-top: 3px; padding: 2px 10px; border-radius: 20px;
      font-size: 0.7rem; font-weight: 700;
    }
    .bmi-under  { background: rgba(var(--ion-color-warning-rgb),0.15); color: var(--ion-color-warning-shade); }
    .bmi-normal { background: rgba(var(--ion-color-success-rgb),0.15); color: var(--ion-color-success-shade); }
    .bmi-over   { background: rgba(var(--ion-color-danger-rgb),0.15);  color: var(--ion-color-danger-shade); }

    /* ─── Accordion sections ─── */
    ion-accordion-group {
      margin: 16px 14px 0;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07);
    }
    ion-accordion { --background: var(--ion-card-background); }
    ion-accordion ion-item[slot="header"] {
      --background: var(--ion-card-background);
      --border-width: 0;
    }
    ion-accordion .section-header-icon {
      font-size: 20px; margin-right: 10px; color: var(--ion-color-primary);
    }
    .section-content { padding: 0 14px 16px; }

    /* ─── Form rows ─── */
    .form-row {
      display: flex; gap: 10px; margin-bottom: 12px;
    }
    .form-field {
      flex: 1; display: flex; flex-direction: column; gap: 4px;
    }
    .field-label {
      font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.6px; color: var(--ion-color-medium); padding-left: 2px;
    }
    .field-input {
      background: var(--ion-color-light); border-radius: 10px;
      --padding-start: 10px; --padding-end: 10px;
      --padding-top: 10px; --padding-bottom: 10px;
      font-size: 0.9rem;
    }
    .field-select {
      background: var(--ion-color-light); border-radius: 10px;
      padding: 10px; font-size: 0.9rem; width: 100%;
      --padding-start: 10px;
    }
    .save-btn { margin-top: 8px; width: 100%; }

    /* ─── Weight entry ─── */
    .weight-entry {
      display: flex; gap: 10px; align-items: flex-end; margin-bottom: 12px;
    }
    .weight-entry .form-field { flex: 1; }
    .weight-entry ion-button { height: 42px; flex-shrink: 0; margin-bottom: 0; }

    /* ─── History list ─── */
    .history-section-title {
      font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.8px; color: var(--ion-color-medium);
      padding: 8px 0 6px; border-top: 1px solid var(--ion-border-color); margin-top: 4px;
    }
    .history-list { display: flex; flex-direction: column; gap: 6px; }
    .history-item {
      display: flex; align-items: center;
      background: var(--ion-color-light); border-radius: 10px;
      padding: 8px 12px; gap: 10px;
    }
    .history-value {
      font-weight: 700; font-size: 0.95rem; color: var(--ion-text-color); flex: 1;
    }
    .history-date { font-size: 0.72rem; color: var(--ion-color-medium); }
    .history-empty {
      font-size: 0.82rem; color: var(--ion-color-medium);
      text-align: center; padding: 10px 0; font-style: italic;
    }

    /* ─── Body measurements visual ─── */
    .body-visual {
      position: relative;
      margin: 8px auto 16px;
      width: 100%; max-width: 360px;
      min-height: 480px;
      display: flex; align-items: center; justify-content: center;
    }
    .body-silhouette {
      position: absolute;
      left: 50%; top: 0;
      transform: translateX(-50%);
      width: 120px; height: 480px;
      opacity: 0.18;
    }
    /* silhouette via CSS */
    .body-silhouette-shape {
      position: absolute; left: 50%; transform: translateX(-50%);
      background: var(--ion-color-primary);
    }
    .sil-head   { width: 44px; height: 44px; border-radius: 50%; top: 0px; }
    .sil-neck   { width: 20px; height: 20px; top: 40px; }
    .sil-torso  { width: 72px; height: 160px; top: 56px; border-radius: 8px 8px 14px 14px; }
    .sil-hips   { width: 80px; height: 48px; top: 208px; border-radius: 4px 4px 14px 14px; }
    .sil-leg-l  { width: 30px; height: 140px; top: 250px; left: calc(50% - 38px); transform: none; border-radius: 4px 4px 10px 10px; }
    .sil-leg-r  { width: 30px; height: 140px; top: 250px; left: calc(50% + 8px);  transform: none; border-radius: 4px 4px 10px 10px; }
    .sil-arm-l  { width: 22px; height: 130px; top: 60px; left: calc(50% - 60px); transform: none; border-radius: 6px 6px 10px 10px; }
    .sil-arm-r  { width: 22px; height: 130px; top: 60px; left: calc(50% + 38px);  transform: none; border-radius: 6px 6px 10px 10px; }

    .meas-grid {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
    }
    /* measurement chip — positioned absolutely */
    .meas-chip {
      position: absolute;
      pointer-events: all;
      background: var(--ion-card-background);
      border: 1.5px solid var(--ion-border-color);
      border-radius: 8px;
      padding: 4px 8px;
      min-width: 68px;
      box-shadow: 0 1px 5px rgba(0,0,0,0.1);
      cursor: pointer;
    }
    .meas-chip:active { background: var(--ion-color-light); }
    .meas-chip-label { font-size: 0.62rem; color: var(--ion-color-medium); font-weight: 600; }
    .meas-chip-side { font-size: 0.6rem; font-weight: 700; }
    .meas-chip-side.L { color: var(--ion-color-primary); }
    .meas-chip-side.R { color: var(--ion-color-danger); }
    .meas-chip-value { font-size: 0.82rem; font-weight: 700; color: var(--ion-text-color); }
    .meas-chip-value.zero { color: var(--ion-color-medium); }
    .meas-connector {
      position: absolute; background: var(--ion-border-color); height: 1px;
    }

    /* positions — left side */
    .chip-collo   { top: 28px;  left: 55%; }
    .chip-spalle  { top: 78px;  left: 4%;  }
    .chip-petto   { top: 120px; left: 55%; }
    .chip-braccioL { top: 100px; left: 4%; }
    .chip-braccioR { top: 100px; left: 55%; }
    .chip-vita    { top: 175px; left: 4%;  }
    .chip-fianchi { top: 220px; left: 55%; }
    .chip-cosciaL { top: 295px; left: 4%;  }
    .chip-cosciaR { top: 295px; left: 55%; }
    .chip-polpaccioL { top: 375px; left: 4%;  }
    .chip-polpaccioR { top: 375px; left: 55%; }

    .visual-hint {
      text-align: center; font-size: 0.72rem; color: var(--ion-color-medium);
      padding-bottom: 8px; font-style: italic;
    }

    /* ─── Latest measurements table ─── */
    .meas-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    .meas-table th {
      font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.6px; color: var(--ion-color-medium);
      text-align: left; padding: 4px 6px; border-bottom: 1px solid var(--ion-border-color);
    }
    .meas-table td {
      font-size: 0.82rem; padding: 5px 6px;
      border-bottom: 1px solid rgba(0,0,0,0.04);
    }
    .meas-table td.val { font-weight: 700; }
    .meas-table tr:last-child td { border-bottom: none; }
    .meas-table .date-col { color: var(--ion-color-medium); font-size: 0.72rem; }

    .spacer { height: 24px; }
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

      <!-- BMI / stat cards -->
      <div class="bmi-row" *ngIf="!loading">
        <div class="stat-card">
          <span class="stat-label">Peso</span>
          <span class="stat-value">{{ latestWeight ?? '—' }}</span>
          <span class="stat-unit">kg</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Altezza</span>
          <span class="stat-value">{{ profile?.heightCm ?? '—' }}</span>
          <span class="stat-unit">cm</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">BMI</span>
          <span class="stat-value">{{ bmiValue ?? '—' }}</span>
          <div [class]="'bmi-chip ' + bmiClass" *ngIf="bmiValue">{{ bmiLabel }}</div>
        </div>
      </div>

      <!-- Skeleton -->
      <div style="margin:16px 14px 0;" *ngIf="loading">
        <ion-skeleton-text animated style="height:80px; border-radius:14px;"></ion-skeleton-text>
      </div>

      <!-- ════ ACCORDION ════ -->
      <ion-accordion-group *ngIf="!loading" [multiple]="true" [value]="['personal']">

        <!-- ── 1. Dati personali ── -->
        <ion-accordion value="personal">
          <ion-item slot="header">
            <ion-icon name="person-outline" class="section-header-icon" slot="start"></ion-icon>
            <ion-label><b>Dati personali</b></ion-label>
          </ion-item>
          <div slot="content" class="section-content">
            <div class="form-row">
              <div class="form-field">
                <div class="field-label">Nome</div>
                <ion-input class="field-input" [(ngModel)]="draftPersonal.firstName" placeholder="Nome"></ion-input>
              </div>
              <div class="form-field">
                <div class="field-label">Cognome</div>
                <ion-input class="field-input" [(ngModel)]="draftPersonal.lastName" placeholder="Cognome"></ion-input>
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <div class="field-label">Data di nascita</div>
                <ion-input class="field-input" type="date" [(ngModel)]="draftPersonal.birthDate"></ion-input>
              </div>
              <div class="form-field">
                <div class="field-label">Genere</div>
                <ion-select class="field-select" [(ngModel)]="draftPersonal.gender" placeholder="Seleziona">
                  <ion-select-option value="M">Maschio</ion-select-option>
                  <ion-select-option value="F">Femmina</ion-select-option>
                  <ion-select-option value="OTHER">Altro</ion-select-option>
                </ion-select>
              </div>
            </div>
            <ion-button class="save-btn" expand="block" (click)="savePersonal()" [disabled]="savingPersonal">
              <ion-spinner *ngIf="savingPersonal" name="crescent" slot="start" style="width:16px;height:16px;margin-right:6px;"></ion-spinner>
              <ion-icon *ngIf="!savingPersonal" name="save-outline" slot="start"></ion-icon>
              Salva dati personali
            </ion-button>
          </div>
        </ion-accordion>

        <!-- ── 2. Peso e altezza ── -->
        <ion-accordion value="body">
          <ion-item slot="header">
            <ion-icon name="scale-outline" class="section-header-icon" slot="start"></ion-icon>
            <ion-label><b>Peso e altezza</b></ion-label>
          </ion-item>
          <div slot="content" class="section-content">
            <!-- Height -->
            <div class="form-row" style="margin-bottom:16px;">
              <div class="form-field">
                <div class="field-label">Altezza (cm)</div>
                <ion-input class="field-input" type="number" [(ngModel)]="draftHeight" placeholder="es. 175" min="50" max="250"></ion-input>
              </div>
              <div style="display:flex;align-items:flex-end;">
                <ion-button (click)="saveHeight()" [disabled]="savingHeight" style="height:42px;margin-bottom:0;">
                  <ion-spinner *ngIf="savingHeight" name="crescent" style="width:14px;height:14px;"></ion-spinner>
                  <ion-icon *ngIf="!savingHeight" name="save-outline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
            </div>

            <!-- New weight entry -->
            <div class="field-label" style="margin-bottom:6px;">Aggiungi peso</div>
            <div class="weight-entry">
              <div class="form-field">
                <ion-input class="field-input" type="number" [(ngModel)]="newWeightKg" placeholder="kg" min="20" max="300" step="0.1"></ion-input>
              </div>
              <ion-button (click)="addWeight()" [disabled]="savingWeight">
                <ion-spinner *ngIf="savingWeight" name="crescent" style="width:14px;height:14px;"></ion-spinner>
                <ion-icon *ngIf="!savingWeight" name="add-outline" slot="start"></ion-icon>
                Salva
              </ion-button>
            </div>

            <!-- Weight history -->
            <div class="history-section-title">Storico pesi</div>
            <div class="history-list">
              <div class="history-empty" *ngIf="weightHistory.length === 0">Nessun dato registrato</div>
              <div class="history-item" *ngFor="let w of weightHistory">
                <ion-icon name="scale-outline" style="font-size:16px;color:var(--ion-color-primary);flex-shrink:0;"></ion-icon>
                <span class="history-value">{{ w.weightKg | number:'1.1-1' }} kg</span>
                <span class="history-date">{{ w.recordedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>
          </div>
        </ion-accordion>

        <!-- ── 3. Misure corporee ── -->
        <ion-accordion value="measurements">
          <ion-item slot="header">
            <ion-icon name="body-outline" class="section-header-icon" slot="start"></ion-icon>
            <ion-label><b>Misure corporee</b></ion-label>
          </ion-item>
          <div slot="content" class="section-content">

            <div class="visual-hint">Tocca una misura per modificarla</div>

            <!-- Body visual with measurement chips -->
            <div class="body-visual">
              <!-- Silhouette -->
              <div style="position:absolute;left:50%;transform:translateX(-50%);top:0;width:120px;height:480px;">
                <div class="body-silhouette-shape sil-head"></div>
                <div class="body-silhouette-shape sil-neck"></div>
                <div class="body-silhouette-shape sil-torso"></div>
                <div class="body-silhouette-shape sil-hips"></div>
                <div class="body-silhouette-shape sil-leg-l"></div>
                <div class="body-silhouette-shape sil-leg-r"></div>
                <div class="body-silhouette-shape sil-arm-l"></div>
                <div class="body-silhouette-shape sil-arm-r"></div>
              </div>

              <!-- Measurement chips -->
              <div class="meas-grid">
                <div class="meas-chip chip-collo"   (click)="editMeasurement('collo', 'Collo')">
                  <div class="meas-chip-label">Collo</div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.collo">{{ measDraft.collo ? (measDraft.collo + 'cm') : '—' }}</div>
                </div>
                <div class="meas-chip chip-spalle"  (click)="editMeasurement('spalle', 'Spalle')">
                  <div class="meas-chip-label">Spalle</div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.spalle">{{ measDraft.spalle ? (measDraft.spalle + 'cm') : '—' }}</div>
                </div>
                <div class="meas-chip chip-petto"   (click)="editMeasurement('petto', 'Petto')">
                  <div class="meas-chip-label">Petto</div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.petto">{{ measDraft.petto ? (measDraft.petto + 'cm') : '—' }}</div>
                </div>
                <div class="meas-chip chip-braccioL" (click)="editMeasurement('braccioL', 'Braccio')">
                  <div style="display:flex;align-items:center;gap:3px;">
                    <span class="meas-chip-label">Braccio</span>
                    <span class="meas-chip-side L">L</span>
                  </div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.braccioL">{{ measDraft.braccioL ? (measDraft.braccioL + 'cm') : '—' }}</div>
                </div>
                <div class="meas-chip chip-braccioR" (click)="editMeasurement('braccioR', 'Braccio')">
                  <div style="display:flex;align-items:center;gap:3px;">
                    <span class="meas-chip-label">Braccio</span>
                    <span class="meas-chip-side R">R</span>
                  </div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.braccioR">{{ measDraft.braccioR ? (measDraft.braccioR + 'cm') : '—' }}</div>
                </div>
                <div class="meas-chip chip-vita"    (click)="editMeasurement('vita', 'Vita')">
                  <div class="meas-chip-label">Vita</div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.vita">{{ measDraft.vita ? (measDraft.vita + 'cm') : '—' }}</div>
                </div>
                <div class="meas-chip chip-fianchi" (click)="editMeasurement('fianchi', 'Fianchi')">
                  <div class="meas-chip-label">Fianchi</div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.fianchi">{{ measDraft.fianchi ? (measDraft.fianchi + 'cm') : '—' }}</div>
                </div>
                <div class="meas-chip chip-cosciaL" (click)="editMeasurement('cosciaL', 'Coscia')">
                  <div style="display:flex;align-items:center;gap:3px;">
                    <span class="meas-chip-label">Coscia</span>
                    <span class="meas-chip-side L">L</span>
                  </div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.cosciaL">{{ measDraft.cosciaL ? (measDraft.cosciaL + 'cm') : '—' }}</div>
                </div>
                <div class="meas-chip chip-cosciaR" (click)="editMeasurement('cosciaR', 'Coscia')">
                  <div style="display:flex;align-items:center;gap:3px;">
                    <span class="meas-chip-label">Coscia</span>
                    <span class="meas-chip-side R">R</span>
                  </div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.cosciaR">{{ measDraft.cosciaR ? (measDraft.cosciaR + 'cm') : '—' }}</div>
                </div>
                <div class="meas-chip chip-polpaccioL" (click)="editMeasurement('polpaccioL', 'Polpaccio')">
                  <div style="display:flex;align-items:center;gap:3px;">
                    <span class="meas-chip-label">Polpaccio</span>
                    <span class="meas-chip-side L">L</span>
                  </div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.polpaccioL">{{ measDraft.polpaccioL ? (measDraft.polpaccioL + 'cm') : '—' }}</div>
                </div>
                <div class="meas-chip chip-polpaccioR" (click)="editMeasurement('polpaccioR', 'Polpaccio')">
                  <div style="display:flex;align-items:center;gap:3px;">
                    <span class="meas-chip-label">Polpaccio</span>
                    <span class="meas-chip-side R">R</span>
                  </div>
                  <div class="meas-chip-value" [class.zero]="!measDraft.polpaccioR">{{ measDraft.polpaccioR ? (measDraft.polpaccioR + 'cm') : '—' }}</div>
                </div>
              </div>
            </div>

            <!-- Save all measurements -->
            <ion-button class="save-btn" expand="block" color="primary" (click)="saveMeasurements()" [disabled]="savingMeasurements">
              <ion-spinner *ngIf="savingMeasurements" name="crescent" slot="start" style="width:16px;height:16px;margin-right:6px;"></ion-spinner>
              <ion-icon *ngIf="!savingMeasurements" name="checkmark-outline" slot="start"></ion-icon>
              Salva misure
            </ion-button>

            <!-- Measurements history -->
            <div class="history-section-title" style="margin-top:16px;">Storico misure</div>
            <div class="history-empty" *ngIf="measurementsHistory.length === 0">Nessuna misura registrata</div>

            <div *ngIf="measurementsHistory.length > 0">
              <table class="meas-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Vita</th>
                    <th>Fianchi</th>
                    <th>Petto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let m of measurementsHistory">
                    <td class="date-col">{{ m.recordedAt | date:'dd/MM/yy' }}</td>
                    <td class="val">{{ m.vita ? (m.vita + 'cm') : '—' }}</td>
                    <td class="val">{{ m.fianchi ? (m.fianchi + 'cm') : '—' }}</td>
                    <td class="val">{{ m.petto ? (m.petto + 'cm') : '—' }}</td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top:10px;" *ngIf="showAllHistory">
                <table class="meas-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Collo</th>
                      <th>Braccio L</th>
                      <th>Braccio R</th>
                      <th>Coscia L</th>
                      <th>Coscia R</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let m of measurementsHistory">
                      <td class="date-col">{{ m.recordedAt | date:'dd/MM/yy' }}</td>
                      <td class="val">{{ m.collo ? (m.collo + 'cm') : '—' }}</td>
                      <td class="val">{{ m.braccioL ? (m.braccioL + 'cm') : '—' }}</td>
                      <td class="val">{{ m.braccioR ? (m.braccioR + 'cm') : '—' }}</td>
                      <td class="val">{{ m.cosciaL ? (m.cosciaL + 'cm') : '—' }}</td>
                      <td class="val">{{ m.cosciaR ? (m.cosciaR + 'cm') : '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ion-button fill="clear" size="small" style="margin-top:4px;" (click)="showAllHistory = !showAllHistory">
                {{ showAllHistory ? 'Mostra meno' : 'Mostra tutte le misure' }}
              </ion-button>
            </div>
          </div>
        </ion-accordion>

      </ion-accordion-group>

      <div class="spacer"></div>
    </ion-content>
  `
})
export class ProfilePage implements OnInit {
  loading = true;
  profile: UserProfile | null = null;
  weightHistory: WeightRecord[] = [];
  measurementsHistory: BodyMeasurementRecord[] = [];

  savingPersonal = false;
  savingHeight = false;
  savingWeight = false;
  savingMeasurements = false;
  showAllHistory = false;

  draftPersonal = { firstName: '', lastName: '', birthDate: '', gender: '' as any };
  draftHeight: number | null = null;
  newWeightKg: number | null = null;
  measDraft: Partial<BodyMeasurementRecord> = {};

  get userEmail(): string { return this.authService.userEmail ?? ''; }

  get displayName(): string {
    const fn = this.profile?.firstName?.trim();
    const ln = this.profile?.lastName?.trim();
    if (fn && ln) return `${fn} ${ln}`;
    if (fn) return fn;
    return this.userEmail;
  }

  get latestWeight(): number | null {
    if (!this.weightHistory.length) return null;
    return Number(this.weightHistory[0].weightKg);
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
    addIcons({
      personOutline, scaleOutline, bodyOutline, saveOutline, addOutline,
      chevronDownOutline, timeOutline, trashOutline, checkmarkOutline,
      fitnessOutline, calendarOutline, barbellOutline
    });
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
        if (h.length > 0) this.measDraft = { ...h[0] };
        check();
      },
      error: () => check()
    });
  }

  savePersonal() {
    this.savingPersonal = true;
    const dto: any = {
      firstName: this.draftPersonal.firstName || null,
      lastName: this.draftPersonal.lastName || null,
      birthDate: this.draftPersonal.birthDate || null,
      gender: this.draftPersonal.gender || null,
    };
    this.profileService.updateProfile(dto).subscribe({
      next: (p) => {
        this.profile = p;
        this.savingPersonal = false;
        this.toast('Dati personali salvati', 'success');
      },
      error: () => { this.savingPersonal = false; this.toast('Errore nel salvataggio', 'danger'); }
    });
  }

  saveHeight() {
    const h = Number(this.draftHeight);
    if (!h || h < 50 || h > 250) { this.toast('Altezza non valida', 'warning'); return; }
    this.savingHeight = true;
    this.profileService.updateProfile({ heightCm: h }).subscribe({
      next: (p) => { this.profile = p; this.savingHeight = false; this.toast('Altezza salvata', 'success'); },
      error: () => { this.savingHeight = false; this.toast('Errore', 'danger'); }
    });
  }

  addWeight() {
    const w = Number(this.newWeightKg);
    if (!w || w < 20 || w > 300) { this.toast('Peso non valido', 'warning'); return; }
    this.savingWeight = true;
    this.profileService.addWeight(w).subscribe({
      next: (rec) => {
        this.weightHistory = [rec, ...this.weightHistory];
        this.newWeightKg = null;
        this.savingWeight = false;
        this.toast('Peso registrato', 'success');
      },
      error: () => { this.savingWeight = false; this.toast('Errore', 'danger'); }
    });
  }

  async editMeasurement(field: keyof BodyMeasurementRecord, label: string) {
    const current = (this.measDraft as any)[field];
    const alert = await this.alertCtrl.create({
      header: label,
      inputs: [{
        name: 'value', type: 'number', placeholder: 'cm',
        value: current ? String(current) : '',
        min: 0, max: 300,
      }],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'OK',
          handler: (data) => {
            const val = data.value === '' ? null : Number(data.value);
            (this.measDraft as any)[field] = val;
          }
        }
      ]
    });
    await alert.present();
  }

  saveMeasurements() {
    const dto: any = {};
    const keys: (keyof BodyMeasurementRecord)[] = [
      'collo','spalle','petto','braccioL','braccioR',
      'vita','fianchi','cosciaL','cosciaR','polpaccioL','polpaccioR'
    ];
    keys.forEach(k => { dto[k] = (this.measDraft as any)[k] ?? null; });

    const hasAny = keys.some(k => dto[k] !== null && dto[k] !== undefined);
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
    const t = await this.toastCtrl.create({ message, duration: 2000, color, position: 'top' });
    await t.present();
  }
}
