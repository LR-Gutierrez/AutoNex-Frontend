import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { AuthService } from '../core/services/auth.service';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { AuthBrandingComponent } from '../shared/components/auth-branding/auth-branding.component';

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
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonButton,
    RouterLink,
    TopbarComponent,
    AuthBrandingComponent,
  ],
  styles: `
    :host {
      display: block;
      height: 100%;
      --app-sidebar-bg: linear-gradient(180deg, #161625 0%, #10101b 100%);
      --app-sidebar-surface: rgba(255, 255, 255, 0.04);
      --app-sidebar-border: rgba(255, 255, 255, 0.08);
      --app-sidebar-text: #b7b7c9;
      --app-sidebar-text-active: #ffffff;
      --app-sidebar-icon: #8e8ea3;
      --app-sidebar-icon-active: var(--ion-color-danger, #ff3b30);
      --app-sidebar-accent: var(--ion-color-danger, #ff3b30);
      --app-sidebar-title: #ffffff;
      --app-sidebar-subtitle: #7c7c92;
    }

    /* Layout principal */
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    ion-split-pane {
      z-index: auto;
      flex: 1;
      --side-width: 280px;
      --side-max-width: 280px;
      --border: 1px solid rgba(255, 255, 255, 0.06);
    }

    ion-menu {
      z-index: 1000;
      --width: 280px;
      --max-width: 280px;
      --min-width: 280px;
    }

    .menu-content {
      --background: var(--app-sidebar-bg);
      --padding-start: 0;
      --padding-end: 0;
      --padding-top: 0;
      --padding-bottom: 0;
    }

    .menu-shell {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      padding: 14px;
      box-sizing: border-box;
    }

    app-auth-branding {
      display: block;
      padding: 14px 10px 22px;
      margin-bottom: 12px;
      flex-shrink: 0;
      --brand-title-color: var(--app-sidebar-title);
      --brand-accent-color: var(--app-sidebar-accent);
      --brand-subtitle2-color: var(--app-sidebar-subtitle);
      --brand-gap: 14px;
    }

    .menu-list {
      background: transparent;
      padding: 6px 0;
      flex: 1 1 auto;
    }

    .menu-toggle {
      display: block;
      margin-bottom: 6px;
    }

    .menu-item {
      --background: transparent;
      --background-hover: rgba(255, 255, 255, 0.03);
      --background-focused: rgba(255, 255, 255, 0.03);
      --background-activated: rgba(255, 255, 255, 0.03);
      --border-color: transparent;
      --inner-border-width: 0;
      --inner-padding-end: 14px;
      --inner-padding-start: 14px;
      --padding-start: 0;
      --min-height: 46px;
      --border-radius: 14px;
      margin: 0;
      position: relative;
      color: var(--app-sidebar-text);
    }

    .menu-item::part(native) {
      border-radius: 14px;
      background: transparent;
      transition:
        background 0.2s ease,
        transform 0.2s ease;
    }

    .menu-item ion-icon {
      font-size: 18px;
      color: var(--app-sidebar-icon);
      margin-right: 14px;
      padding-left: 14px;
      transition: color 0.2s ease;
      flex-shrink: 0;
    }

    .menu-item ion-label {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.01em;
    }

    .menu-item.active {
      color: var(--app-sidebar-text-active);
    }

    .menu-item.active::part(native) {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.07),
        rgba(255, 255, 255, 0.03)
      );
      box-shadow:
        inset -3px 0 0 0 var(--app-sidebar-accent),
        inset 0 0 0 1px rgba(255, 255, 255, 0.03),
        0 10px 24px rgba(0, 0, 0, 0.16);
    }

    .menu-item.active ion-icon {
      color: var(--app-sidebar-icon-active);
    }

    .menu-item.active ion-label {
      font-weight: 600;
    }

    .menu-footer {
      margin-top: 16px;
      padding-top: 12px;
      flex-shrink: 0;
    }

    .footer-button {
      --background: linear-gradient(90deg, #ff3b30, #e01f1f);
      --background-hover: linear-gradient(90deg, #ff5248, #f02e2e);
      --background-activated: linear-gradient(90deg, #d91f16, #c91919);
      --color: #ffffff;
      --border-radius: 12px;
      --box-shadow: 0 10px 26px rgba(255, 59, 48, 0.35);
      height: 46px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.01em;
      text-transform: none;
      margin: 0;
    }

    .footer-button ion-icon {
      font-size: 18px;
      margin-right: 6px;
    }

    /* Contenido principal con topbar */
    .main-content-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    ion-router-outlet {
      flex: 1;
      width: 100%;
    }

    @media (max-width: 991px) {
      ion-menu {
        --width: min(86vw, 320px);
        --max-width: min(86vw, 320px);
        --min-width: 0;
      }

      .menu-item ion-icon {
        padding-left: 14px;
      }

      .menu-shell {
        padding-bottom: max(14px, env(safe-area-inset-bottom));
      }
    }
  `,
  template: `
    <div class="layout-container">
      <ion-split-pane contentId="main-content" class="dashboard-theme">
        <ion-menu contentId="main-content" menuId="main-menu" type="overlay">
          <ion-content class="menu-content" [scrollY]="true">
            <div class="menu-shell">
              <app-auth-branding layout="horizontal"></app-auth-branding>

              <ion-list class="menu-list">
                @for (item of menuItems; track item.path) {
                  <ion-menu-toggle auto-hide="false" class="menu-toggle">
                    <ion-item
                      class="menu-item"
                      [class.active]="isActive(item.path)"
                      [routerLink]="item.path"
                      routerDirection="root"
                      lines="none"
                      detail="false"
                    >
                      <ion-icon [name]="item.icon" slot="start"></ion-icon>
                      <ion-label>{{ item.label }}</ion-label>
                    </ion-item>
                  </ion-menu-toggle>
                }
              </ion-list>

              <div class="menu-footer">
                <ion-button
                  expand="block"
                  class="footer-button"
                  (click)="goToNewService()"
                >
                  <ion-icon name="add-circle-outline" slot="start"></ion-icon>
                  Nuevo Servicio
                </ion-button>
              </div>
            </div>
          </ion-content>
        </ion-menu>

        <div class="main-content-wrapper" id="main-content">
          <app-topbar />
          <!-- ← AQUÍ SE INCLUYE EL TOPBAR -->
          <ion-router-outlet></ion-router-outlet>
        </div>
      </ion-split-pane>
    </div>
  `,
})
export class DashboardLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'grid-outline' },
    { path: '/clients', label: 'Clientes', icon: 'people-outline' },
    { path: '/vehicles', label: 'Vehículos', icon: 'car-outline' },
    { path: '/suppliers', label: 'Proveedores', icon: 'business-outline' },
    { path: '/consumables', label: 'Consumibles', icon: 'water-outline' },
    {
      path: '/consumables/low-stock',
      label: 'Stock Bajo',
      icon: 'warning-outline',
    },
    { path: '/tools', label: 'Herramientas', icon: 'build-outline' },
    { path: '/services', label: 'Servicios', icon: 'construct-outline' },
    {
      path: '/service-orders',
      label: 'Órdenes',
      icon: 'document-text-outline',
    },
    {
      path: '/mileage-alerts',
      label: 'Alertas KM',
      icon: 'speedometer-outline',
    },
    { path: '/financial-records', label: 'Finanzas', icon: 'cash-outline' },
    {
      path: '/notifications',
      label: 'Notificaciones',
      icon: 'notifications-outline',
    },
    {
      path: '/form-demo',
      label: 'Formulario Demo',
      icon: 'code-slash-outline',
    },
  ];

  constructor() {
    addIcons(allIcons);
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  goToNewService() {
    this.router.navigate(['/services']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
