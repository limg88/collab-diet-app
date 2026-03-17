import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonLabel,
  IonInput, IonButton, IonText
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonCard, IonCardContent, IonItem, IonLabel,
    IonInput, IonButton, IonText
  ],
  template: `
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>
          <h2>Accedi</h2>
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input type="email" [(ngModel)]="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input type="password" [(ngModel)]="password"></ion-input>
          </ion-item>
          <ion-button expand="block" (click)="login()" class="ion-margin-top">Accedi</ion-button>
          <ion-button expand="block" fill="clear" routerLink="/register">Non hai un account? Registrati</ion-button>
          <ion-text color="danger" *ngIf="error"><p>{{ error }}</p></ion-text>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})
export class LoginPage {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('/menu'),
      error: (e) => this.error = e.error?.message || 'Errore di accesso'
    });
  }
}
