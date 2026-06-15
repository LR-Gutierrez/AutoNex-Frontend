import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { ClientService } from '../../core/services/client.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { ServiceOrderService } from '../../core/services/service-order.service';
import { FinancialRecordService } from '../../core/services/financial-record.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { RefreshService } from '../../core/services/refresh.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, IonSkeletonText, EnumLabelPipe],
  styles: `
    :host {
      display: block;
      --card-bg: linear-gradient(
        180deg,
        rgba(30, 32, 52, 0.96),
        rgba(24, 25, 42, 0.96)
      );
    }
  `,
  template: `
    <div class="p-5 max-md:p-3.5 text-(--app-text) box-border">
      <section class="mb-5">
        <h1
          class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
        >
          Panel de Control
        </h1>
        <p class="mt-1.5 text-(--app-text-muted) text-sm">
          Resumen operativo de la red de servicios AutoNex
        </p>
      </section>

      @if (loading()) {
        <div
          class="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 mb-5"
        >
          @for (_ of [1, 2, 3, 4]; track $index) {
            <div
              class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) min-w-0 p-4.5 min-h-30.5 box-border"
            >
              <ion-skeleton-text
                animated
                class="w-[45%]! h-3!"
              ></ion-skeleton-text>
              <ion-skeleton-text
                animated
                class="w-[35%]! h-10.5! mt-4.5"
              ></ion-skeleton-text>
              <ion-skeleton-text
                animated
                class="w-[28%]! h-6! mt-3"
              ></ion-skeleton-text>
            </div>
          }
        </div>
      } @else {
        <section
          class="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 mb-5"
        >
          <div
            class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) min-w-0 p-4.5 min-h-30.5 box-border"
          >
            <div
              class="text-(--app-text-muted) text-xs uppercase tracking-[0.08em] mb-3.5"
            >
              Total clientes
            </div>
            <div class="flex items-end justify-between gap-2.5">
              <div
                class="text-[40px] font-extrabold leading-none tracking-[-0.04em] min-w-0 wrap-break-word"
              >
                {{ clientCount() }}
              </div>
              <div
                class="text-xs px-2.5 py-1.5 rounded-full font-bold whitespace-nowrap bg-[rgba(34,197,94,0.12)] text-[#4ade80]"
              >
                +12%
              </div>
            </div>
          </div>

          <div
            class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) min-w-0 p-4.5 min-h-30.5 box-border"
          >
            <div
              class="text-(--app-text-muted) text-xs uppercase tracking-[0.08em] mb-3.5"
            >
              Vehículos en taller
            </div>
            <div class="flex items-end justify-between gap-2.5">
              <div
                class="text-[40px] font-extrabold leading-none tracking-[-0.04em] min-w-0 wrap-break-word"
              >
                {{ vehicleCount() }}
              </div>
              <div
                class="text-xs px-2.5 py-1.5 rounded-full font-bold whitespace-nowrap bg-[rgba(245,158,11,0.12)] text-[#fbbf24]"
              >
                8 espera
              </div>
            </div>
          </div>

          <div
            class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) min-w-0 p-4.5 min-h-30.5 box-border"
          >
            <div class="text-xs uppercase tracking-[0.08em] mb-3.5 text-white">
              Stock crítico
            </div>
            <div class="flex items-end justify-between gap-2.5">
              <div
                class="text-[40px] font-extrabold leading-none tracking-[-0.04em] min-w-0 wrap-break-word text-[#ff5a52]"
              >
                15
              </div>
              <div
                class="text-xs px-2.5 py-1.5 rounded-full font-bold whitespace-nowrap bg-[rgba(255,59,48,0.12)] text-[#ff5a52]"
              >
                3 alertas
              </div>
            </div>
          </div>

          <div
            class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) min-w-0 p-4.5 min-h-30.5 box-border"
          >
            <div
              class="text-(--app-text-muted) text-xs uppercase tracking-[0.08em] mb-3.5"
            >
              Ingresos mes
            </div>
            <div class="flex items-end justify-between gap-2.5">
              <div
                class="text-[40px] font-extrabold leading-none tracking-[-0.04em] min-w-0 wrap-break-word"
              >
                {{ balanceLabel() }}
              </div>
              <div
                class="text-xs px-2.5 py-1.5 rounded-full font-bold whitespace-nowrap bg-[rgba(34,197,94,0.12)] text-[#4ade80]"
              >
                +8.4%
              </div>
            </div>
          </div>
        </section>
      }

      <section
        class="grid grid-cols-[minmax(0,2fr)_minmax(300px,0.95fr)] max-xl:grid-cols-1 gap-5 mb-5 min-w-0"
      >
        <div
          class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) min-w-0 p-4.5 box-border"
        >
          <div class="pb-1.5">
            <h2 class="text-(--app-text) text-lg font-bold m-0">
              Órdenes de Servicio Recientes
            </h2>
            <p class="text-(--app-text-muted) text-sm m-0 mt-0.5">
              Últimos movimientos registrados
            </p>
          </div>

          <div>
            @if (ordersLoading()) {
              <div class="grid gap-2">
                @for (_ of [1, 2, 3, 4]; track $index) {
                  <div class="flex items-center gap-3 py-2">
                    <div class="flex-1">
                      <ion-skeleton-text
                        animated
                        class="w-[70%]!"
                      ></ion-skeleton-text>
                      <ion-skeleton-text
                        animated
                        class="w-[45%]! mt-1"
                      ></ion-skeleton-text>
                    </div>
                  </div>
                }
              </div>
            } @else if (recentOrders().length === 0) {
              <div class="py-4 text-center text-(--app-text-muted)">
                No hay órdenes de servicio registradas.
              </div>
            } @else {
              <div class="grid gap-2 min-w-0">
                @for (order of recentOrders(); track order.id) {
                  <a
                    class="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] max-md:grid-cols-1 gap-3 items-center p-3.5 rounded-[14px] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.04)] transition duration-200 ease-in-out no-underline hover:bg-[rgba(255,255,255,0.04)] min-w-0 box-border"
                    [routerLink]="['/service-orders', order.id]"
                  >
                    <div>
                      <h3
                        class="m-0 mb-1 text-sm font-bold text-(--app-text) overflow-wrap-anywhere"
                      >
                        {{ order.vehicleInfo }}
                      </h3>
                      <p
                        class="m-0 text-xs text-(--app-text-muted) overflow-wrap-anywhere"
                      >
                        {{ order.clientName }}
                      </p>
                    </div>

                    <div>
                      <p
                        class="m-0 text-xs text-(--app-text-muted) overflow-wrap-anywhere"
                      >
                        Orden #{{ order.id }}
                      </p>
                    </div>

                    <span [class]="badgeClasses(order.status)">
                      {{ order.status | enumLabel }}
                    </span>
                  </a>
                }
              </div>
            }
          </div>
        </div>

        <div class="grid gap-3.5 min-w-0">
          <div
            class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-4.5 box-border min-w-0"
          >
            <h2 class="text-(--app-text) text-lg font-bold m-0 mb-3.5">
              Alertas de KM
            </h2>

            <div
              class="flex items-center gap-3 py-3 border-b border-[rgba(255,255,255,0.06)] last:border-b-0 last:pb-0 min-w-0"
            >
              <div
                class="w-11 h-11 rounded-full grid place-items-center border-2 border-[rgba(255,59,48,0.4)] text-[#ff5a52] text-xs font-bold shrink-0"
              >
                90%
              </div>
              <div>
                <div class="font-bold">Toyota Hilux</div>
                <div class="text-xs text-(--app-text-muted)">
                  Servicio de 50,000 KM
                </div>
              </div>
            </div>

            <div
              class="flex items-center gap-3 py-3 border-b border-[rgba(255,255,255,0.06)] last:border-b-0 last:pb-0 min-w-0"
            >
              <div
                class="w-11 h-11 rounded-full grid place-items-center border-2 border-[rgba(148,163,184,0.35)] text-[#a1a1aa] text-xs font-bold shrink-0"
              >
                85%
              </div>
              <div>
                <div class="font-bold">Ford Ranger</div>
                <div class="text-xs text-(--app-text-muted)">
                  Cambio de aceite
                </div>
              </div>
            </div>
          </div>

          @if (summary(); as fin) {
            <div
              class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-4.5 box-border min-w-0"
            >
              <h2 class="text-(--app-text) text-lg font-bold m-0 mb-3.5">
                Resumen Financiero
              </h2>

              <div class="grid grid-cols-3 max-md:grid-cols-1 gap-4">
                <div
                  class="text-center p-3.5 rounded-[14px] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.04)] min-w-0 box-border"
                >
                  <span
                    class="block text-[22px] font-extrabold mb-1.5 overflow-wrap-anywhere text-[#4ade80]"
                  >
                    \${{ fin.totalIncome.toFixed(2) }}
                  </span>
                  <span class="text-(--app-text-muted) text-xs">Ingresos</span>
                </div>

                <div
                  class="text-center p-3.5 rounded-[14px] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.04)] min-w-0 box-border"
                >
                  <span
                    class="block text-[22px] font-extrabold mb-1.5 overflow-wrap-anywhere text-[#ff6b63]"
                  >
                    \${{ fin.totalExpenses.toFixed(2) }}
                  </span>
                  <span class="text-(--app-text-muted) text-xs">Egresos</span>
                </div>

                <div
                  class="text-center p-3.5 rounded-[14px] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.04)] min-w-0 box-border"
                >
                  <span
                    class="block text-[22px] font-extrabold mb-1.5 overflow-wrap-anywhere"
                    [class.text-[#4ade80]]="fin.balance >= 0"
                    [class.text-[#ff6b63]]="fin.balance < 0"
                  >
                    \${{ fin.balance.toFixed(2) }}
                  </span>
                  <span class="text-(--app-text-muted) text-xs">Balance</span>
                </div>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly vehicleService = inject(VehicleService);
  private readonly orderService = inject(ServiceOrderService);
  private readonly financialService = inject(FinancialRecordService);
  readonly authState = inject(AuthStateService);
  private readonly refreshService = inject(RefreshService);
  private readonly pageTitle = inject(PageTitleService);

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
    this.pageTitle.title.set('Panel de Control');
    this.pageTitle.subtitle.set(
      'Resumen operativo de la red de servicios AutoNex',
    );
    this.loadData();
    this.refreshService.refresh$.subscribe(() => this.loadData());
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

  statusColor(status: string): string {
    const map: Record<string, string> = {
      Open: 'warning',
      InProgress: 'primary',
      Completed: 'success',
      Cancelled: 'medium',
    };
    return map[status] ?? 'medium';
  }

  badgeClasses(status: string): string {
    const base = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset';
    const colorMap: Record<string, string> = {
      warning: 'bg-amber-400/10 text-amber-400 ring-amber-400/20',
      primary: 'bg-blue-400/10 text-blue-400 ring-blue-400/20',
      success: 'bg-green-400/10 text-green-400 ring-green-400/20',
      medium: 'bg-gray-400/10 text-gray-400 ring-gray-400/20',
    };
    return `${base} ${colorMap[this.statusColor(status)]}`;
  }
}
