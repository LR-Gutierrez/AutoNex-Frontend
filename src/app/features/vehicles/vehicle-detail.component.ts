import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { VehicleService } from '../../core/services/vehicle.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { CurrencyFormatterPipe } from '../../shared/pipes/currency-formatter.pipe';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';
import type { VehicleResponse } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [RouterLink, IonIcon, IonSkeletonText, CurrencyFormatterPipe, EnumLabelPipe, DatePipe],
  styles: `
    :host {
      display: block;
      --card-bg: var(--app-surface);
    }
  `,
  template: `
    <div class="p-5 max-md:p-3.5 text-(--app-text) box-border">
      <section class="mb-5">
        <div class="flex items-center gap-3 mb-1">
          <a
            routerLink="/vehicles"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1 class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]">
              {{ vehicle()?.brand }} {{ vehicle()?.model }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{ vehicle()?.licensePlate }}
            </p>
          </div>
        </div>
      </section>

      @if (loading()) {
        <div class="grid gap-3">
          @for (_ of [1, 2, 3]; track $index) {
            <div class="bg-(--card-bg) border border-(--app-border) rounded-2xl p-4.5">
              <ion-skeleton-text animated class="w-[55%]! h-5!"></ion-skeleton-text>
              <ion-skeleton-text animated class="w-[35%]! h-3.5! mt-2.5"></ion-skeleton-text>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 max-xl:grid-cols-1 gap-5 mb-5">
          <div class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-4.5 box-border">
            <h2 class="text-(--app-text) text-lg font-bold m-0 mb-3.5">Información del Vehículo</h2>
            <div class="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <div>
                <span class="block text-xs uppercase tracking-[0.08em] text-(--app-text-muted) mb-1">Cliente</span>
                <span class="text-sm font-medium">{{ vehicle()?.clientName }}</span>
              </div>
              <div>
                <span class="block text-xs uppercase tracking-[0.08em] text-(--app-text-muted) mb-1">Año</span>
                <span class="text-sm font-medium">{{ vehicle()?.year }}</span>
              </div>
              <div>
                <span class="block text-xs uppercase tracking-[0.08em] text-(--app-text-muted) mb-1">VIN</span>
                <span class="text-sm font-medium">{{ vehicle()?.vin || '—' }}</span>
              </div>
              <div>
                <span class="block text-xs uppercase tracking-[0.08em] text-(--app-text-muted) mb-1">Registrado</span>
                <span class="text-sm font-medium">{{ vehicle()?.createdAt | date: 'short' }}</span>
              </div>
            </div>
          </div>

          <div class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-4.5 box-border">
            <h2 class="text-(--app-text) text-lg font-bold m-0 mb-3.5">Historial de Órdenes</h2>

            @if ((vehicle()?.serviceOrders?.length ?? 0) === 0) {
              <div class="py-4 text-center text-(--app-text-muted) text-sm">
                No hay órdenes de servicio para este vehículo.
              </div>
            } @else {
              <div class="grid gap-2">
                @for (order of vehicle()?.serviceOrders ?? []; track order.id) {
                  <a
                    [routerLink]="['/service-orders', order.id]"
                    class="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] max-md:grid-cols-1 gap-3 items-center p-3.5 rounded-[14px] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.04)] transition duration-200 ease-in-out no-underline hover:bg-[rgba(255,255,255,0.04)] min-w-0 box-border"
                  >
                    <div>
                      <p class="m-0 text-xs text-(--app-text-muted)">#{{ order.id }} — {{ order.date | date: 'mediumDate' }}</p>
                      <p class="m-0 text-sm font-bold text-(--app-text) mt-0.5">{{ order.clientName }}</p>
                    </div>
                    <div class="text-right">
                      <span class="text-sm font-bold">{{ order.totalAmount | currencyFormat }}</span>
                    </div>
                    <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                      [class.bg-amber-400/10]="order.status === 'Open'"
                      [class.text-amber-400]="order.status === 'Open'"
                      [class.ring-amber-400/20]="order.status === 'Open'"
                      [class.bg-blue-400/10]="order.status === 'InProgress'"
                      [class.text-blue-400]="order.status === 'InProgress'"
                      [class.ring-blue-400/20]="order.status === 'InProgress'"
                      [class.bg-green-400/10]="order.status === 'Completed'"
                      [class.text-green-400]="order.status === 'Completed'"
                      [class.ring-green-400/20]="order.status === 'Completed'"
              [class.bg-violet-400/10]="order.status === 'Paid'"
              [class.text-violet-400]="order.status === 'Paid'"
              [class.ring-violet-400/20]="order.status === 'Paid'"
              [class.bg-gray-400/10]="order.status === 'Cancelled'"
              [class.text-gray-400]="order.status === 'Cancelled'"
              [class.ring-gray-400/20]="order.status === 'Cancelled'"
                    >
                      {{ order.status | enumLabel }}
                    </span>
                  </a>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class VehicleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly vehicleService = inject(VehicleService);
  private readonly pageTitle = inject(PageTitleService);

  readonly vehicle = signal<VehicleResponse | null>(null);
  readonly loading = signal(true);

  constructor() {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pageTitle.title.set('Detalle del Vehículo');
    this.pageTitle.subtitle.set('Información y órdenes de servicio');
    this.vehicleService.getById(id).subscribe({
      next: (v) => {
        this.vehicle.set(v);
        this.loading.set(false);
        this.pageTitle.title.set(`${v.brand} ${v.model}`);
      },
      error: () => this.loading.set(false),
    });
  }
}
