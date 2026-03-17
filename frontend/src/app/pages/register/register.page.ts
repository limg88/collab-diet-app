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
  selector: 'app-register',
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
          <h2>Registrati</h2>
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input type="email" [(ngModel)]="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input type="password" [(ngModel)]="password"></ion-input>
          </ion-item>
          <ion-button expand="block" (click)="register()" class="ion-margin-top">Registrati</ion-button>
          <ion-button expand="block" fill="clear" routerLink="/login">Hai già un account? Accedi</ion-button>
          <ion-text color="danger" *ngIf="error"><p>{{ error }}</p></ion-text>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})
export class RegisterPage {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.error = '';
    this.auth.register(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('/menu'),
      error: (e) => this.error = e.error?.message || 'Errore di registrazione'
    });
  }
}
