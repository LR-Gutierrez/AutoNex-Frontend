import { Component, computed, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
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
import {
  calendarOutline,
  addCircleOutline,
  notificationsOutline,
  sunnyOutline,
  moonOutline,
  desktopOutline,
  logOutOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { NotificationService } from '../../core/services/notification.service';
import { RecurringExpenseService } from '../../core/services/recurring-expense.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    RouterLink,
    IonButtons,
    IonMenuButton,
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

    .dashboard-title {
      margin: 0;
      padding: 0;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--topbar-text);
      line-height: 1.15;
    }

    .header-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex-shrink: 0;
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

    .notif-popover {
      --background: var(--app-surface);
      --border-color: var(--app-border);
      --border-radius: 14px;
      --box-shadow: var(--app-shadow);
      --width: 360px;
      --max-height: 400px;
      --backdrop-background: rgba(0, 0, 0, 0.5);
      --backdrop-opacity: 0.3;
    }

    .notif-popover::part(content) {
      border: 1px solid var(--app-border);
    }

    .notif-popover ion-content {
      --background: transparent;
      --color: var(--app-text);
    }

    .notif-popover ion-list {
      background: transparent;
      padding: 0;
    }

    .notif-item {
      --background: transparent;
      --background-hover: var(--app-surface-2);
      --color: var(--app-text);
      --border-radius: 0;
      --padding-start: 14px;
      --padding-end: 14px;
      --min-height: 60px;
      --inner-padding-end: 0;
      --inner-border-width: 0;
      font-size: 13px;
      border-bottom: 1px solid var(--app-border);
    }

    .notif-item:last-child {
      border-bottom: none;
    }

    .notif-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .notif-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .notif-message {
      font-size: 12px;
      font-weight: 500;
      color: var(--app-text);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .notif-time {
      font-size: 10px;
      color: var(--app-text-muted);
      font-weight: 400;
    }

    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      border-bottom: 1px solid var(--app-border);
    }

    .notif-header-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--app-text);
    }

    .notif-header-action {
      font-size: 11px;
      font-weight: 600;
      color: #3b82f6;
      cursor: pointer;
      background: none;
      border: none;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .notif-header-action:hover {
      background: rgba(59, 130, 246, 0.1);
    }

    .notif-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      color: var(--app-text-muted);
    }

    .notif-empty-icon {
      font-size: 32px;
      margin-bottom: 8px;
      opacity: 0.4;
    }

    .notif-empty-text {
      font-size: 12px;
      font-weight: 500;
    }

    .notif-loading {
      display: flex;
      justify-content: center;
      padding: 16px;
      color: var(--app-text-muted);
      font-size: 12px;
    }
  `,
  template: `
    <div class="header-left">
      <ion-buttons>
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
    </div>

    <div class="header-actions">
      <ion-button class="primary-button" routerLink="/services">
        <ion-icon
          name="add-circle-outline"
          slot="start"
          style="color: #fff;"
        ></ion-icon>
        <span class="primary-label" style="color: #fff;">Servicios</span>
      </ion-button>

      @if (dueCount() > 0) {
        <ion-button
          id="due-expenses-trigger"
          class="icon-button"
          fill="clear"
          aria-label="Gastos pendientes"
        >
          <ion-icon name="alert-circle-outline" slot="icon-only" style="color:#fbbf24"></ion-icon>
          <ion-badge class="notification-badge" color="warning">
            {{ dueCount() }}
          </ion-badge>
        </ion-button>

        <ion-popover
          #dueExpensesPopover
          trigger="due-expenses-trigger"
          trigger-action="click"
          class="notif-popover"
        >
          <ng-template>
            <ion-content>
              <div class="notif-header">
                <span class="notif-title">Pagos pendientes hoy</span>
              </div>
              <ion-list lines="none">
                @for (item of recurringExpenseService.dueToday(); track item.id) {
                  <ion-item class="notif-item" lines="none">
                    <ion-icon
                      name="calendar-outline"
                      slot="start"
                      style="font-size:18px;color:#fbbf24"
                    ></ion-icon>
                    <ion-label class="ion-text-wrap">
                      <span class="notif-message">{{ item.expenseName }}</span>
                      <span class="notif-date">{{ item.amount | currency:'USD':'symbol':'1.2-2' }}</span>
                    </ion-label>
                  </ion-item>
                }
              </ion-list>
              <div class="notif-footer">
                <ion-button
                  fill="clear"
                  size="small"
                  color="medium"
                   (click)="dueExpensesPopover.dismiss(); router.navigate(['/financial-records'])"
                >
                  Ver todos
                </ion-button>
              </div>
            </ion-content>
          </ng-template>
        </ion-popover>
      }

      <ion-button
        id="notif-trigger"
        class="icon-button"
        fill="clear"
        aria-label="Notificaciones"
      >
        <ion-icon name="notifications-outline" slot="icon-only"></ion-icon>
        @if (notificationService.unreadCount() > 0) {
          <ion-badge class="notification-badge" color="danger">
            {{ notificationService.unreadCount() > 99 ? '99+' : notificationService.unreadCount() }}
          </ion-badge>
        }
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

      <ion-popover
        #notifPopover
        trigger="notif-trigger"
        trigger-action="click"
        class="notif-popover"
        (ionPopoverDidPresent)="onNotifOpen()"
      >
        <ng-template>
          <ion-content>
            <div class="notif-header">
              <span class="notif-header-title">Notificaciones</span>
              @if (notificationService.unreadCount() > 0) {
                <button class="notif-header-action" (click)="markAllRead(); notifPopover.dismiss()">
                  Marcar leídas
                </button>
              }
            </div>

            @if (notificationService.loading()) {
              <div class="notif-loading">Cargando...</div>
            } @else if (notificationService.notifications().length === 0) {
              <div class="notif-empty">
                <div class="notif-empty-icon">🔔</div>
                <span class="notif-empty-text">Sin notificaciones</span>
              </div>
            } @else {
              <ion-list lines="none">
                @for (notif of notificationService.notifications(); track notif.id) {
                  <ion-item class="notif-item" button (click)="notifPopover.dismiss()">
                    <div class="notif-icon" slot="start">
                      {{ notif.type === 'WhatsApp' ? '💬' : notif.type === 'Sms' ? '📱' : '📧' }}
                    </div>
                    <div class="notif-content">
                      <span class="notif-message">{{ notif.message }}</span>
                      <span class="notif-time">{{ notif.createdAt | date:'dd/MM/yy HH:mm' }}</span>
                    </div>
                  </ion-item>
                }
              </ion-list>
            }
          </ion-content>
        </ng-template>
      </ion-popover>
    </div>
  `,
})
export class TopbarComponent implements OnInit {
  private readonly authState = inject(AuthStateService);
  private readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly themeService = inject(ThemeService);
  readonly notificationService = inject(NotificationService);
  readonly recurringExpenseService = inject(RecurringExpenseService);

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

  readonly dueCount = computed(() => this.recurringExpenseService.dueToday().length);

  constructor() {
    addIcons({ calendarOutline, addCircleOutline, notificationsOutline, sunnyOutline, moonOutline, desktopOutline, logOutOutline, alertCircleOutline });
    this.notificationService.load();
  }

  ngOnInit() {
    this.recurringExpenseService.loadDueToday().subscribe();
  }

  onNotifOpen(): void {
    this.notificationService.load();
  }

  markAllRead(): void {
    this.notificationService.markAllRead();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
