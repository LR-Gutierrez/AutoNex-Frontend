// dashboard.component.ts - VERSIÓN SIMPLIFICADA (SIN HEADER)

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent, // ← Ya no necesitas IonHeader, IonToolbar, etc.
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonLabel,
  IonList,
  IonItem,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonButton,
  IonAvatar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { ClientService } from '../../core/services/client.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { ServiceOrderService } from '../../core/services/service-order.service';
import { FinancialRecordService } from '../../core/services/financial-record.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { UserRole } from '../../core/models/user.model';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonIcon,
    IonLabel,
    IonList,
    IonItem,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonButton,
    IonAvatar,
    EnumLabelPipe,
  ],
  styles: `
    :host {
      display: block;
      width: 100%;
      --dashboard-bg: #11111b;
      --dashboard-surface: #1a1b2e;
      --dashboard-surface-2: #20223a;
      --dashboard-border: rgba(255, 255, 255, 0.08);
      --dashboard-text: #f3f4fb;
      --dashboard-text-muted: #9a9cb3;
      --dashboard-accent: var(--ion-color-danger, #ff3b30);
      --dashboard-accent-soft: rgba(255, 59, 48, 0.12);
      --dashboard-success: #22c55e;
      --dashboard-warning: #f59e0b;
      --dashboard-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
    }

    .dashboard-content {
      --background: linear-gradient(180deg, #121322 0%, #0e0f1a 100%);
      --overflow: auto;
      --padding-start: 0;
      --padding-end: 0;
    }

    .dashboard-shell {
      padding: 20px;
      color: var(--dashboard-text);
      box-sizing: border-box;
      min-height: 100%;
    }

    .hero {
      margin-bottom: 20px;
    }

    .hero h1 {
      margin: 0;
      font-size: 34px;
      line-height: 1.1;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--dashboard-text);
    }

    .hero p {
      margin: 6px 0 0;
      color: var(--dashboard-text-muted);
      font-size: 14px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .kpi-card {
      background: linear-gradient(
        180deg,
        rgba(30, 32, 52, 0.96),
        rgba(24, 25, 42, 0.96)
      );
      border: 1px solid var(--dashboard-border);
      border-radius: 18px;
      box-shadow: var(--dashboard-shadow);
      min-width: 0;
      padding: 18px;
      min-height: 122px;
      box-sizing: border-box;
    }

    .kpi-label {
      color: var(--dashboard-text-muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 14px;
    }

    .kpi-value-row {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 10px;
    }

    .kpi-value {
      font-size: 40px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.04em;
      color: var(--dashboard-text);
      min-width: 0;
      word-break: break-word;
    }

    .kpi-meta {
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 999px;
      font-weight: 700;
      white-space: nowrap;
    }

    .kpi-meta.positive {
      background: rgba(34, 197, 94, 0.12);
      color: #4ade80;
    }

    .kpi-meta.warning {
      background: rgba(245, 158, 11, 0.12);
      color: #fbbf24;
    }

    .kpi-meta.danger {
      background: rgba(255, 59, 48, 0.12);
      color: #ff5a52;
    }

    ion-card.panel-card {
      margin: 0;
      --background: transparent;
      background: linear-gradient(
        180deg,
        rgba(30, 32, 52, 0.96),
        rgba(24, 25, 42, 0.96)
      );
      border: 1px solid var(--dashboard-border);
      border-radius: 18px;
      box-shadow: var(--dashboard-shadow);
      min-width: 0;
      width: 100%;
    }

    .dashboard-main {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(300px, 0.95fr);
      gap: 20px;
      margin-bottom: 20px;
      min-width: 0;
    }

    .panel-card ion-card,
    .panel-card ion-list,
    .panel-card ion-item {
      --background: transparent;
      background: transparent;
    }

    .panel-card ion-card-header {
      padding-bottom: 6px;
    }

    .panel-card ion-card-title {
      color: var(--dashboard-text);
      font-size: 18px;
      font-weight: 700;
    }

    .panel-card ion-card-subtitle {
      color: var(--dashboard-text-muted);
    }

    .orders-table {
      display: grid;
      gap: 8px;
      min-width: 0;
    }

    .orders-row {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 14px 16px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.04);
      transition: 0.2s ease;
      text-decoration: none;
      min-width: 0;
      box-sizing: border-box;
    }

    .orders-row:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .orders-row h3 {
      margin: 0 0 4px;
      font-size: 14px;
      font-weight: 700;
      color: var(--dashboard-text);
      overflow-wrap: anywhere;
    }

    .orders-row p {
      margin: 0;
      font-size: 12px;
      color: var(--dashboard-text-muted);
      overflow-wrap: anywhere;
    }

    .status-badge {
      --padding-start: 10px;
      --padding-end: 10px;
      --padding-top: 6px;
      --padding-bottom: 6px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      justify-self: end;
    }

    .mini-panel {
      display: grid;
      gap: 14px;
      min-width: 0;
    }

    .alert-box,
    .finance-box {
      padding: 18px;
      border-radius: 18px;
      background: linear-gradient(
        180deg,
        rgba(30, 32, 52, 0.96),
        rgba(24, 25, 42, 0.96)
      );
      border: 1px solid var(--dashboard-border);
      box-shadow: var(--dashboard-shadow);
      box-sizing: border-box;
      min-width: 0;
    }

    .alert-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      min-width: 0;
    }

    .alert-item:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .alert-ring {
      width: 44px;
      height: 44px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      border: 2px solid rgba(255, 59, 48, 0.4);
      color: #ff5a52;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .finance-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .finance-stat {
      text-align: center;
      padding: 14px 10px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.04);
      min-width: 0;
      box-sizing: border-box;
    }

    .finance-value {
      display: block;
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 6px;
      overflow-wrap: anywhere;
    }

    .finance-label {
      color: var(--dashboard-text-muted);
      font-size: 12px;
    }

    .text-success {
      color: #4ade80;
    }

    .text-danger {
      color: #ff6b63;
    }

    .empty-state {
      padding: 24px;
      text-align: center;
      color: var(--dashboard-text-muted);
    }

    @media (max-width: 1200px) {
      .kpi-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .dashboard-main {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 767px) {
      .dashboard-shell {
        padding: 14px;
      }

      .hero h1 {
        font-size: 28px;
      }

      .kpi-grid,
      .finance-grid,
      .dashboard-main {
        grid-template-columns: 1fr;
      }

      .orders-row {
        grid-template-columns: 1fr;
      }

      .status-badge {
        justify-self: start;
      }
    }
  `,
  template: `
    <ion-content class="dashboard-content">
      <ion-refresher slot="fixed" (ionRefresh)="onRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="dashboard-shell">
        <section class="hero">
          <h1>Panel de Control</h1>
          <p>Resumen operativo de la red de servicios AutoNex</p>
        </section>

        @if (loading()) {
          <div class="kpi-grid">
            @for (_ of [1, 2, 3, 4]; track $index) {
              <div class="kpi-card">
                <ion-skeleton-text
                  animated
                  style="width: 45%; height: 12px;"
                ></ion-skeleton-text>
                <ion-skeleton-text
                  animated
                  style="width: 35%; height: 42px; margin-top: 18px;"
                ></ion-skeleton-text>
                <ion-skeleton-text
                  animated
                  style="width: 28%; height: 24px; margin-top: 12px;"
                ></ion-skeleton-text>
              </div>
            }
          </div>
        } @else {
          <section class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Total clientes</div>
              <div class="kpi-value-row">
                <div class="kpi-value">{{ clientCount() }}</div>
                <div class="kpi-meta positive">+12%</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-label">Vehículos en taller</div>
              <div class="kpi-value-row">
                <div class="kpi-value">{{ vehicleCount() }}</div>
                <div class="kpi-meta warning">8 espera</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-label" style="color:#ff6b63;">Stock crítico</div>
              <div class="kpi-value-row">
                <div class="kpi-value" style="color:#ff5a52;">15</div>
                <div class="kpi-meta danger">3 alertas</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-label">Ingresos mes</div>
              <div class="kpi-value-row">
                <div class="kpi-value">{{ balanceLabel() }}</div>
                <div class="kpi-meta positive">+8.4%</div>
              </div>
            </div>
          </section>
        }

        <section class="dashboard-main">
          <ion-card class="panel-card">
            <ion-card-header>
              <ion-card-title>Órdenes de Servicio Recientes</ion-card-title>
              <ion-card-subtitle
                >Últimos movimientos registrados</ion-card-subtitle
              >
            </ion-card-header>

            <ion-card-content>
              @if (ordersLoading()) {
                <ion-list>
                  @for (_ of [1, 2, 3, 4]; track $index) {
                    <ion-item lines="none">
                      <ion-label>
                        <ion-skeleton-text
                          animated
                          style="width: 70%"
                        ></ion-skeleton-text>
                        <ion-skeleton-text
                          animated
                          style="width: 45%"
                        ></ion-skeleton-text>
                      </ion-label>
                    </ion-item>
                  }
                </ion-list>
              } @else if (recentOrders().length === 0) {
                <div class="empty-state">
                  No hay órdenes de servicio registradas.
                </div>
              } @else {
                <div class="orders-table">
                  @for (order of recentOrders(); track order.id) {
                    <a
                      class="orders-row"
                      [routerLink]="['/service-orders', order.id]"
                    >
                      <div>
                        <h3>{{ order.vehicleInfo }}</h3>
                        <p>{{ order.clientName }}</p>
                      </div>

                      <div>
                        <p>Orden #{{ order.id }}</p>
                      </div>

                      <ion-badge
                        class="status-badge"
                        [color]="statusColor(order.status)"
                      >
                        {{ order.status | enumLabel }}
                      </ion-badge>
                    </a>
                  }
                </div>
              }
            </ion-card-content>
          </ion-card>

          <div class="mini-panel">
            <div class="alert-box">
              <ion-card-title style="display:block; margin-bottom: 14px;">
                Alertas de KM
              </ion-card-title>

              <div class="alert-item">
                <div class="alert-ring">90%</div>
                <div>
                  <div style="font-weight:700;">Toyota Hilux</div>
                  <div
                    style="font-size:12px; color: var(--dashboard-text-muted);"
                  >
                    Servicio de 50,000 KM
                  </div>
                </div>
              </div>

              <div class="alert-item">
                <div
                  class="alert-ring"
                  style="border-color: rgba(148,163,184,.35); color:#a1a1aa;"
                >
                  85%
                </div>
                <div>
                  <div style="font-weight:700;">Ford Ranger</div>
                  <div
                    style="font-size:12px; color: var(--dashboard-text-muted);"
                  >
                    Cambio de aceite
                  </div>
                </div>
              </div>
            </div>

            @if (summary(); as fin) {
              <div class="finance-box">
                <ion-card-title style="display:block; margin-bottom: 14px;">
                  Resumen Financiero
                </ion-card-title>

                <div class="finance-grid">
                  <div class="finance-stat">
                    <span class="finance-value text-success">
                      \${{ fin.totalIncome.toFixed(2) }}
                    </span>
                    <span class="finance-label">Ingresos</span>
                  </div>

                  <div class="finance-stat">
                    <span class="finance-value text-danger">
                      \${{ fin.totalExpenses.toFixed(2) }}
                    </span>
                    <span class="finance-label">Egresos</span>
                  </div>

                  <div class="finance-stat">
                    <span
                      class="finance-value"
                      [class.text-success]="fin.balance >= 0"
                      [class.text-danger]="fin.balance < 0"
                    >
                      \${{ fin.balance.toFixed(2) }}
                    </span>
                    <span class="finance-label">Balance</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </section>
      </div>
    </ion-content>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly vehicleService = inject(VehicleService);
  private readonly orderService = inject(ServiceOrderService);
  private readonly financialService = inject(FinancialRecordService);
  readonly authState = inject(AuthStateService);

  readonly loading = signal(true);
  readonly ordersLoading = signal(true);
  readonly clientCount = signal(0);
  readonly vehicleCount = signal(0);
  readonly orderCount = signal(0);
  readonly balanceLabel = signal('--');
  readonly recentOrders = this.orderService.orders;
  readonly summary = this.financialSummary;

  constructor() {
    addIcons(allIcons);
  }

  private get financialSummary() {
    return this.financialService.summary;
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loading.set(true);
    this.ordersLoading.set(true);

    this.clientService.loadAll().subscribe({
      next: () => {
        this.clientCount.set(this.clientService.pagination()?.totalCount ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.vehicleService.loadAll().subscribe({
      next: () => {
        this.vehicleCount.set(
          this.vehicleService.pagination()?.totalCount ?? 0,
        );
      },
    });

    this.orderService.loadAll().subscribe({
      next: () => {
        this.orderCount.set(this.orderService.pagination()?.totalCount ?? 0);
        this.ordersLoading.set(false);
      },
      error: () => this.ordersLoading.set(false),
    });

    this.financialService.loadSummary().subscribe({
      next: (summary) => {
        if (summary) {
          this.balanceLabel.set(`$${summary.balance.toFixed(0)}`);
        }
      },
    });
  }

  onRefresh(event: CustomEvent) {
    this.loadData();
    (event.target as HTMLIonRefresherElement).complete();
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      Open: 'warning',
      InProgress: 'primary',
      Completed: 'success',
      Cancelled: 'medium',
    };
    return map[status] ?? 'medium';
  }
}
