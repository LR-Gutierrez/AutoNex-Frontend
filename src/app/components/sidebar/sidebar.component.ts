import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  gridOutline, peopleOutline, carOutline, businessOutline, waterOutline,
  buildOutline, folderOutline, constructOutline, documentTextOutline,
  speedometerOutline, cashOutline, codeSlashOutline, addCircleOutline,
  swapHorizontalOutline, calendarOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { AuthBrandingComponent } from '../../shared/components/auth-branding/auth-branding.component';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    RouterLink,
    AuthBrandingComponent,
  ],
  styles: `
    :host {
      display: block;
      height: 100%;
      border-right: 1px solid var(--app-border);
      --sidebar-bg: linear-gradient(180deg, #161625 0%, #10101b 100%);
      --sidebar-surface: rgba(255, 255, 255, 0.04);
      --sidebar-border: rgba(255, 255, 255, 0.08);
      --sidebar-text: #b7b7c9;
      --sidebar-text-active: #ffffff;
      --sidebar-icon: #8e8ea3;
      --sidebar-icon-active: var(--ion-color-danger, #ff3b30);
      --sidebar-accent: var(--ion-color-danger, #ff3b30);
      --sidebar-title: #ffffff;
      --sidebar-subtitle: #7c7c92;
    }

    ion-content {
      --background: var(--sidebar-bg);
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
      --brand-title-color: var(--sidebar-title);
      --brand-accent-color: var(--sidebar-accent);
      --brand-subtitle2-color: var(--sidebar-subtitle);
      --brand-gap: 14px;
    }

    ion-list {
      background: transparent;
      padding: 6px 0;
      flex: 1 1 auto;
    }

    ion-menu-toggle {
      display: block;
      margin-bottom: 6px;
    }

    ion-item {
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
      color: var(--sidebar-text);
    }

    ion-item::part(native) {
      border-radius: 14px;
      background: transparent;
      transition:
        background 0.2s ease,
        transform 0.2s ease;
    }

    ion-item ion-icon {
      font-size: 18px;
      color: var(--sidebar-icon);
      margin-right: 14px;
      padding-left: 14px;
      transition: color 0.2s ease;
      flex-shrink: 0;
    }

    ion-item ion-label {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.01em;
    }

    ion-item.active {
      color: var(--sidebar-text-active);
    }

    ion-item.active::part(native) {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.07),
        rgba(255, 255, 255, 0.03)
      );
      box-shadow:
        inset -3px 0 0 0 var(--sidebar-accent),
        inset 0 0 0 1px rgba(255, 255, 255, 0.03),
        0 10px 24px rgba(0, 0, 0, 0.16);
    }

    ion-item.active ion-icon {
      color: var(--sidebar-icon-active);
    }

    ion-item.active ion-label {
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

    @media (max-width: 991px) {
      ion-item ion-icon {
        padding-left: 14px;
      }

      .menu-shell {
        padding-bottom: max(14px, env(safe-area-inset-bottom));
      }
    }
  `,
  template: `
    <ion-content [scrollY]="true">
      <div class="menu-shell">
        <app-auth-branding layout="horizontal"></app-auth-branding>

        <ion-list>
          @for (item of menuItems; track item.path) {
            <ion-menu-toggle auto-hide="false">
              <ion-item
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
            (click)="goToNewOrder()"
          >
            <ion-icon name="add-circle-outline" slot="start"></ion-icon>
            Nueva Orden
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'grid-outline' },
    { path: '/clients', label: 'Clientes', icon: 'people-outline' },
    { path: '/vehicles', label: 'Vehículos', icon: 'car-outline' },
    { path: '/suppliers', label: 'Proveedores', icon: 'business-outline' },
    { path: '/consumables', label: 'Consumibles', icon: 'water-outline' },
    { path: '/tools', label: 'Herramientas', icon: 'build-outline' },
    {
      path: '/tool-categories',
      label: 'Categorías',
      icon: 'folder-outline',
    },
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
      path: '/exchange-rates',
      label: 'Tasas de Cambio',
      icon: 'swap-horizontal-outline',
    },
    {
      path: '/form-demo',
      label: 'Formulario Demo',
      icon: 'code-slash-outline',
    },
  ];

  constructor() {
    addIcons({ gridOutline, peopleOutline, carOutline, businessOutline, waterOutline, buildOutline, folderOutline, constructOutline, documentTextOutline, speedometerOutline, cashOutline, codeSlashOutline, addCircleOutline, swapHorizontalOutline });
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  goToNewOrder() {
    this.router.navigate(['/service-orders/new']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
