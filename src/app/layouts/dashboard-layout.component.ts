import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    RouterLink,
  ],
  template: `
    <ion-split-pane contentId="main-content">
      <ion-menu contentId="main-content">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>AutoNex</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            @for (item of menuItems; track item.path) {
              <ion-menu-toggle auto-hide="false">
                <ion-item [routerLink]="item.path" routerDirection="root">
                  <ion-icon [name]="item.icon" slot="start"></ion-icon>
                  <ion-label>{{ item.label }}</ion-label>
                </ion-item>
              </ion-menu-toggle>
            }
          </ion-list>
        </ion-content>
      </ion-menu>

      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  `,
})
export class DashboardLayoutComponent {
  menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'grid-outline' },
    { path: '/clients', label: 'Clientes', icon: 'people-outline' },
    { path: '/vehicles', label: 'Vehículos', icon: 'car-outline' },
    { path: '/suppliers', label: 'Proveedores', icon: 'business-outline' },
    { path: '/consumables', label: 'Consumibles', icon: 'color-palette-outline' },
    { path: '/consumables/low-stock', label: 'Stock Bajo', icon: 'alert-circle-outline' },
    { path: '/tools', label: 'Herramientas', icon: 'build-outline' },
    { path: '/services', label: 'Servicios', icon: 'construct-outline' },
    { path: '/service-orders', label: 'Órdenes', icon: 'clipboard-outline' },
    { path: '/mileage-alerts', label: 'Alertas Km', icon: 'speedometer-outline' },
    { path: '/financial-records', label: 'Finanzas', icon: 'cash-outline' },
    { path: '/notifications', label: 'Notificaciones', icon: 'notifications-outline' },
    { path: '/users', label: 'Usuarios', icon: 'person-add-outline' },
    { path: '/inventory-movements', label: 'Movimientos', icon: 'swap-horizontal-outline' },
  ];

  constructor() {
    addIcons(allIcons);
  }
}
