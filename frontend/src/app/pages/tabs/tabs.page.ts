import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, nutrition, cartOutline, peopleOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [RouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="menu" href="/menu">
          <ion-icon name="calendar-outline"></ion-icon>
          <ion-label>Menù</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="shopping" href="/shopping">
          <ion-icon name="cart-outline"></ion-icon>
          <ion-label>Spesa</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="ingredients" href="/ingredients">
          <ion-icon name="nutrition"></ion-icon>
          <ion-label>Ingredienti</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="collaboration" href="/collaboration">
          <ion-icon name="people-outline"></ion-icon>
          <ion-label>Collabora</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile" href="/profile">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Profilo</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
})
export class TabsPage {
  constructor() { addIcons({ calendarOutline, nutrition, cartOutline, peopleOutline, personOutline }); }
}
