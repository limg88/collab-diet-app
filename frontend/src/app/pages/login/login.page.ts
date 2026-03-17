import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import {
  IonContent, IonButton, IonInput, IonIcon, IonText, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, leafOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,
    IonContent, IonButton, IonInput, IonIcon, IonText, IonSpinner],
  styles: [`
    ion-content {
      --background: linear-gradient(160deg, #2E7D32 0%, #1B5E20 50%, #F57C00 100%);
    }
    .auth-container {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 20px;
    }
    .brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40px;
      color: white;
    }
    .brand-icon {
      font-size: 64px;
      margin-bottom: 12px;
    }
    .brand h1 {
      font-size: 2rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .brand p {
      font-size: 0.9rem;
      opacity: 0.85;
      margin: 4px 0 0;
    }
    .card {
      width: 100%;
      max-width: 400px;
      background: white;
      border-radius: 20px;
      padding: 32px 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    }
    .card h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 24px;
    }
    .input-group {
      margin-bottom: 16px;
    }
    .input-group label {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .input-wrapper {
      display: flex;
      align-items: center;
      background: #F5F5F5;
      border-radius: 10px;
      border: 2px solid transparent;
      padding: 0 12px;
      transition: border-color 0.2s;
    }
    .input-wrapper:focus-within {
      border-color: #2E7D32;
      background: #fff;
    }
    .input-wrapper ion-icon {
      color: #aaa;
      font-size: 18px;
      flex-shrink: 0;
    }
    .input-wrapper ion-input {
      --padding-start: 8px;
      --padding-end: 0;
      --background: transparent;
      --color: #1a1a1a;
      flex: 1;
    }
    .btn-primary {
      --background: #2E7D32;
      --background-activated: #1B5E20;
      --border-radius: 10px;
      --box-shadow: 0 4px 12px rgba(46,125,50,0.4);
      height: 52px;
      font-weight: 700;
      font-size: 1rem;
      margin: 24px 0 0;
    }
    .link-btn {
      --color: #2E7D32;
      font-size: 0.875rem;
      margin-top: 8px;
    }
    .error-msg {
      background: rgba(211, 47, 47, 0.08);
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 16px;
      font-size: 0.875rem;
      color: #D32F2F;
      font-weight: 500;
    }
  `],
  template: `
    <ion-content>
      <div class="auth-container">
        <div class="brand">
          <ion-icon name="leaf-outline" class="brand-icon"></ion-icon>
          <h1>CollabDiet</h1>
          <p>Pianifica i tuoi pasti insieme</p>
        </div>

        <div class="card">
          <h2>Bentornato 👋</h2>

          <div class="input-group">
            <label>Email</label>
            <div class="input-wrapper">
              <ion-icon name="mail-outline"></ion-icon>
              <ion-input type="email" placeholder="la-tua@email.com"
                [(ngModel)]="email" (keyup.enter)="login()"></ion-input>
            </div>
          </div>

          <div class="input-group">
            <label>Password</label>
            <div class="input-wrapper">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <ion-input [type]="showPassword ? 'text' : 'password'" placeholder="••••••••"
                [(ngModel)]="password" (keyup.enter)="login()"></ion-input>
              <ion-button fill="clear" size="small" style="--color:#aaa; --padding-start:0; --padding-end:0; height:36px; flex-shrink:0;" (click)="showPassword = !showPassword">
                <ion-icon [name]="showPassword ? 'eye-off-outline' : 'eye-outline'" slot="icon-only" style="font-size:18px;"></ion-icon>
              </ion-button>
            </div>
          </div>

          <div class="error-msg" *ngIf="error">{{ error }}</div>

          <ion-button expand="block" class="btn-primary" (click)="login()" [disabled]="loading">
            <ion-spinner *ngIf="loading" name="crescent" style="margin-right:8px;"></ion-spinner>
            {{ loading ? 'Accesso...' : 'Accedi' }}
          </ion-button>

          <ion-button expand="block" fill="clear" class="link-btn" routerLink="/register">
            Non hai un account? <strong>&nbsp;Registrati</strong>
          </ion-button>
        </div>
      </div>
    </ion-content>
  `
})
export class LoginPage {
  email = ''; password = ''; error = ''; loading = false;
  showPassword = false;
  constructor(private auth: AuthService, private router: Router) {
    addIcons({ mailOutline, lockClosedOutline, leafOutline, eyeOutline, eyeOffOutline });
  }
  login() {
    this.error = '';
    if (!this.email || !this.password) { this.error = 'Inserisci email e password'; return; }
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => { this.loading = false; this.router.navigateByUrl('/menu'); },
      error: (e) => { this.loading = false; this.error = e.error?.message || 'Credenziali non valide'; }
    });
  }
}
