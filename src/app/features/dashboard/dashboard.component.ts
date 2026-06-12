import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  IonList,
  IonItem,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { ClientService } from '../../core/services/client.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { ServiceOrderService } from '../../core/services/service-order.service';
import { FinancialRecordService } from '../../core/services/financial-record.service';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
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
    IonList,
    IonItem,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    EnumLabelPipe,
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
      <ion-refresher slot="fixed" (ionRefresh)="onRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (loading()) {
        <ion-grid>
          <ion-row>
            @for (_ of [1,2,3,4]; track $index) {
              <ion-col size="6" size-md="3">
                <ion-card class="h-full">
                  <ion-card-content class="text-center">
                    <ion-skeleton-text animated style="width: 40px; height: 40px; margin: 0 auto;"></ion-skeleton-text>
                    <ion-skeleton-text animated style="width: 60%; margin: 8px auto;"></ion-skeleton-text>
                    <ion-skeleton-text animated style="width: 40%; margin: 0 auto;"></ion-skeleton-text>
                  </ion-card-content>
                </ion-card>
              </ion-col>
            }
          </ion-row>
        </ion-grid>
      } @else {
        <ion-grid>
          <ion-row>
            <ion-col size="6" size-md="3">
              <ion-card class="h-full" routerLink="/clients" button>
                <ion-card-content class="text-center">
                  <ion-icon name="people-outline" class="text-3xl" color="primary"></ion-icon>
                  <ion-label class="block text-2xl font-bold mt-2">{{ clientCount() }}</ion-label>
                  <ion-label class="text-sm text-gray-500">Clientes</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size="6" size-md="3">
              <ion-card class="h-full" routerLink="/vehicles" button>
                <ion-card-content class="text-center">
                  <ion-icon name="car-outline" class="text-3xl" color="primary"></ion-icon>
                  <ion-label class="block text-2xl font-bold mt-2">{{ vehicleCount() }}</ion-label>
                  <ion-label class="text-sm text-gray-500">Vehículos</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size="6" size-md="3">
              <ion-card class="h-full" routerLink="/service-orders" button>
                <ion-card-content class="text-center">
                  <ion-icon name="clipboard-outline" class="text-3xl" color="primary"></ion-icon>
                  <ion-label class="block text-2xl font-bold mt-2">{{ orderCount() }}</ion-label>
                  <ion-label class="text-sm text-gray-500">Órdenes</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size="6" size-md="3">
              <ion-card class="h-full" routerLink="/financial-records" button>
                <ion-card-content class="text-center">
                  <ion-icon name="cash-outline" class="text-3xl" color="primary"></ion-icon>
                  <ion-label class="block text-2xl font-bold mt-2">{{ balanceLabel() }}</ion-label>
                  <ion-label class="text-sm text-gray-500">Balance</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      }

      <ion-card>
        <ion-card-header>
          <ion-card-title>Órdenes Recientes</ion-card-title>
          <ion-card-subtitle>Últimas órdenes de servicio</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          @if (ordersLoading()) {
            <ion-list>
              @for (_ of [1,2,3]; track $index) {
                <ion-item>
                  <ion-label>
                    <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
                    <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
                  </ion-label>
                </ion-item>
              }
            </ion-list>
          } @else if (recentOrders().length === 0) {
            <p class="text-gray-500 text-center py-4">No hay órdenes de servicio registradas</p>
          } @else {
            <ion-list>
              @for (order of recentOrders(); track order.id) {
                <ion-item [routerLink]="['/service-orders', order.id]" detail>
                  <ion-label>
                    <h2>{{ order.vehicleInfo }}</h2>
                    <p>{{ order.clientName }}</p>
                  </ion-label>
                  <ion-badge [color]="statusColor(order.status)" slot="end">
                    {{ order.status | enumLabel }}
                  </ion-badge>
                </ion-item>
              }
            </ion-list>
          }
        </ion-card-content>
      </ion-card>

      @if (summary(); as fin) {
        <ion-card>
          <ion-card-header>
            <ion-card-title>Resumen Financiero</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col size="4" class="text-center">
                  <ion-label class="block text-lg font-bold text-green-600">
                    \${{ fin.totalIncome.toFixed(2) }}
                  </ion-label>
                  <ion-label class="text-xs text-gray-500">Ingresos</ion-label>
                </ion-col>
                <ion-col size="4" class="text-center">
                  <ion-label class="block text-lg font-bold text-red-600">
                    \${{ fin.totalExpenses.toFixed(2) }}
                  </ion-label>
                  <ion-label class="text-xs text-gray-500">Egresos</ion-label>
                </ion-col>
                <ion-col size="4" class="text-center">
                  <ion-label class="block text-lg font-bold" [class.text-green-600]="fin.balance >= 0" [class.text-red-600]="fin.balance < 0">
                    \${{ fin.balance.toFixed(2) }}
                  </ion-label>
                  <ion-label class="text-xs text-gray-500">Balance</ion-label>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      }
    </ion-content>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly vehicleService = inject(VehicleService);
  private readonly orderService = inject(ServiceOrderService);
  private readonly financialService = inject(FinancialRecordService);

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
        this.vehicleCount.set(this.vehicleService.pagination()?.totalCount ?? 0);
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
