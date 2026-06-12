import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonIcon,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="6" size-md="3">
            <ion-card class="h-full" routerLink="/clients">
              <ion-card-content class="text-center">
                <ion-icon name="people-outline" class="text-3xl" color="primary"></ion-icon>
                <ion-label class="block text-2xl font-bold mt-2">--</ion-label>
                <ion-label class="text-sm text-gray-500">Clientes</ion-label>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="6" size-md="3">
            <ion-card class="h-full" routerLink="/vehicles">
              <ion-card-content class="text-center">
                <ion-icon name="car-outline" class="text-3xl" color="primary"></ion-icon>
                <ion-label class="block text-2xl font-bold mt-2">--</ion-label>
                <ion-label class="text-sm text-gray-500">Vehículos</ion-label>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="6" size-md="3">
            <ion-card class="h-full" routerLink="/service-orders">
              <ion-card-content class="text-center">
                <ion-icon name="clipboard-outline" class="text-3xl" color="primary"></ion-icon>
                <ion-label class="block text-2xl font-bold mt-2">--</ion-label>
                <ion-label class="text-sm text-gray-500">Órdenes</ion-label>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="6" size-md="3">
            <ion-card class="h-full" routerLink="/financial-records">
              <ion-card-content class="text-center">
                <ion-icon name="cash-outline" class="text-3xl" color="primary"></ion-icon>
                <ion-label class="block text-2xl font-bold mt-2">--</ion-label>
                <ion-label class="text-sm text-gray-500">Finanzas</ion-label>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Bienvenido a AutoNex</ion-card-title>
          <ion-card-subtitle>Sistema de Gestión para Taller Mecánico</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <p>Selecciona un módulo del menú lateral para comenzar a trabajar.</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export class DashboardComponent {
  constructor() {
    addIcons(allIcons);
  }
}
