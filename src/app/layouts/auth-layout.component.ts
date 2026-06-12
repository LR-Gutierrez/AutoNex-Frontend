import { Component } from '@angular/core';
import { IonContent, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [IonContent, IonRouterOutlet],
  template: `
    <ion-content class="ion-padding">
      <ion-router-outlet></ion-router-outlet>
    </ion-content>
  `,
})
export class AuthLayoutComponent {}
