// topbar.component.ts - Versión corregida

import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonButtons,
  IonMenuButton,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonBadge,
  IonContent,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { PageTitleService } from '../../core/services/page-title.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterLink,
    IonButtons,
    IonMenuButton,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonBadge,
    IonContent,
    IonPopover,
    IonList,
    IonItem,
    IonLabel,
    UserAvatarComponent,
  ],
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      width: 100%;
      min-height: 84px;
      padding: 12px 16px;
      box-sizing: border-box;
      background: var(--topbar-bg);
      border-bottom: 1px solid var(--app-border);
      /* Usar variables globales en lugar de fijas */
      --topbar-text: var(--app-text);
      --topbar-text-muted: var(--app-text-muted);
      --topbar-surface: rgba(255, 255, 255, 0.04);
      --topbar-border: var(--app-border);
    }

    /* Removemos el @media prefers-color-scheme porque ya no es necesario */

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      flex-shrink: 0;
    }

    .header-titles {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .dashboard-title {
      margin: 0;
      padding: 0;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--topbar-text);
      line-height: 1.15;
    }

    .dashboard-subtitle {
      margin-top: 2px;
      font-size: 12px;
      color: var(--topbar-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }

    .header-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex-shrink: 0;
    }

    .dashboard-search {
      width: 260px;
      min-width: 200px;
    }

    .dashboard-search::part(container) {
      background: var(--topbar-surface);
      border: 1px solid var(--topbar-border);
      box-shadow: none;
      border-radius: 14px;
    }

    .dashboard-search::part(input) {
      color: var(--topbar-text);
      font-size: 14px;
    }

    .dashboard-search::part(icon) {
      color: var(--topbar-text-muted);
    }

    .ghost-button {
      --background: var(--topbar-surface);
      --background-hover: rgba(255, 255, 255, 0.07);
      --color: var(--topbar-text);
      --border-color: var(--topbar-border);
      --border-radius: 12px;
      --box-shadow: none;
      height: 44px;
      text-transform: none;
      font-weight: 600;
      margin: 0;
    }

    .primary-button {
      --background: linear-gradient(90deg, #ff3b30, #e51e24);
      --background-hover: linear-gradient(90deg, #ff5248, #f02d33);
      --color: #fff;
      --border-radius: 12px;
      --box-shadow: 0 8px 20px rgba(255, 59, 48, 0.25);
      height: 44px;
      text-transform: none;
      font-weight: 700;
      margin: 0;
    }

    .icon-button {
      position: relative;
      --color: var(--topbar-text);
      --border-radius: 12px;
      width: 44px;
      height: 44px;
      min-width: 44px;
      margin: 0;
    }

    .icon-button ion-icon {
      font-size: 20px;
    }

    .notification-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 16px;
      height: 16px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      font-size: 10px;
      font-weight: 700;
      padding: 0;
    }

    .profile-chip {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      gap: 10px;
      min-height: 44px;
      padding: 4px 4px 4px 12px;
      flex-shrink: 0;
      cursor: pointer;
      border: none;
      background: transparent;
      outline: none;
      border-radius: 12px;
      transition: background 0.2s ease;
    }

    .profile-chip:hover {
      background: var(--topbar-surface);
    }

    .profile-chip app-user-avatar {
      --avatar-radius: 8px;
    }

    .profile-meta {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .profile-name {
      font-size: 13px;
      font-weight: 700;
      color: var(--topbar-text);
      line-height: 1.2;
      white-space: nowrap;
    }

    .profile-role {
      font-size: 10px;
      color: var(--topbar-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      line-height: 1.2;
      white-space: nowrap;
    }

    .primary-label {
      display: inline-block;
    }

    .profile-popover {
      --background: var(--app-surface);
      --border-color: var(--app-border);
      --border-radius: 14px;
      --box-shadow: var(--app-shadow);
      --width: 200px;
      --backdrop-background: rgba(0, 0, 0, 0.5);
      --backdrop-opacity: 0.3;
    }

    .profile-popover::part(content) {
      border: 1px solid var(--app-border);
    }

    .profile-popover ion-content {
      --background: transparent;
      --color: var(--app-text);
    }

    .profile-popover ion-list {
      background: transparent;
      padding: 4px;
    }

    .profile-popover ion-item {
      --background: transparent;
      --background-hover: var(--app-surface-2);
      --background-activated: var(--app-surface-2);
      --color: var(--app-text);
      --border-radius: 10px;
      --padding-start: 12px;
      --padding-end: 12px;
      --min-height: 44px;
      --inner-padding-end: 0;
      --inner-border-width: 0;
      font-size: 14px;
      font-weight: 500;
      border-radius: 10px;
    }

    .profile-popover ion-item ion-icon {
      color: var(--app-text-muted);
      font-size: 18px;
      margin-right: 12px;
    }

    /* ============================================
       MEDIA QUERIES RESPONSIVAS
    ============================================ */

    @media (max-width: 991px) {
      .dashboard-subtitle {
        display: none;
      }

      .dashboard-search {
        display: none;
      }

      .profile-role {
        display: none;
      }
    }

    @media (max-width: 767px) {
      :host {
        min-height: 60px;
        padding: 8px 12px;
        gap: 8px;
      }

      .dashboard-title {
        font-size: 16px;
      }

      .ghost-button {
        display: none;
      }

      .primary-button {
        display: none;
      }

      .icon-button {
        width: 40px;
        height: 40px;
        min-width: 40px;
      }

      .profile-chip {
        min-height: 40px;
        padding: 2px 2px 2px 8px;
      }

      .profile-name {
        font-size: 12px;
      }

      .settings-wrap {
        display: none;
      }
    }

    @media (max-width: 420px) {
      :host {
        padding: 6px 10px;
      }

      .dashboard-title {
        font-size: 14px;
      }

      .profile-name {
        display: none;
      }
    }
  `,
  template: `
    <div class="header-left">
      <ion-buttons>
        <ion-menu-button></ion-menu-button>
      </ion-buttons>

      <div class="header-titles">
        <div class="dashboard-title">{{ pageTitle.title() }}</div>
        @if (pageTitle.subtitle()) {
          <div class="dashboard-subtitle">{{ pageTitle.subtitle() }}</div>
        }
      </div>
    </div>

    <div class="header-actions">
      <ion-searchbar
        class="dashboard-search"
        placeholder="Buscar..."
        show-clear-button="focus"
      ></ion-searchbar>

      <ion-button fill="outline" class="ghost-button">
        <ion-icon name="calendar-outline" slot="start"></ion-icon>
        <span>30 días</span>
      </ion-button>

      <ion-button class="primary-button" routerLink="/services">
        <ion-icon
          name="add-circle-outline"
          slot="start"
          style="color: #fff;"
        ></ion-icon>
        <span class="primary-label" style="color: #fff;">Orden</span>
      </ion-button>

      <ion-button class="icon-button" fill="clear" aria-label="Notificaciones">
        <ion-icon name="notifications-outline" slot="icon-only"></ion-icon>
        <ion-badge class="notification-badge" color="danger">3</ion-badge>
      </ion-button>

      <ion-button
        class="icon-button"
        fill="clear"
        aria-label="Cambiar tema"
        (click)="themeService.toggle()"
      >
        <ion-icon [name]="themeIcon()" slot="icon-only"></ion-icon>
      </ion-button>

      <button id="profile-trigger" class="profile-chip">
        <app-user-avatar [name]="userFullName()" [size]="36" />
        <div class="profile-meta">
          <span class="profile-name">{{ userFullName() }}</span>
          <span class="profile-role">{{ userRoleLabel() }}</span>
        </div>
      </button>

      <ion-popover
        #profilePopover
        trigger="profile-trigger"
        trigger-action="click"
        class="profile-popover"
      >
        <ng-template>
          <ion-content>
            <ion-list lines="none">
              <ion-item button (click)="logout(); profilePopover.dismiss()">
                <ion-icon name="log-out-outline" slot="start"></ion-icon>
                <ion-label>Cerrar sesión</ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </ng-template>
      </ion-popover>
    </div>
  `,
})
export class TopbarComponent {
  private readonly authState = inject(AuthStateService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly pageTitle = inject(PageTitleService);
  readonly themeService = inject(ThemeService);

  readonly themeIcon = computed(() => {
    const mode = this.themeService.mode();
    if (mode === 'light') return 'sunny-outline';
    if (mode === 'dark') return 'moon-outline';
    return 'desktop-outline';
  });

  readonly userFullName = computed(
    () => this.authState.user()?.fullName ?? 'Usuario',
  );

  readonly userRoleLabel = computed(() => {
    const role = this.authState.user()?.role;
    if (!role) return '';

    const labels: Record<string, string> = {
      Admin: 'Administrador',
      Mechanic: 'Mecánico',
      Receptionist: 'Recepcionista',
    };

    return labels[role] ?? role;
  });

  constructor() {
    addIcons(allIcons);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
