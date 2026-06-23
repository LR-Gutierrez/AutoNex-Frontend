import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { ModalController, ToastController } from '@ionic/angular';
import { ServiceOrderService } from '../../core/services/service-order.service';
import { MileageAlertService } from '../../core/services/mileage-alert.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';
import { PaymentModalComponent } from './payment-modal.component';
import { PaymentDetailModalComponent } from './payment-detail-modal.component';
import { ServiceOrderResponse } from '../../core/models/service-order.model';
import { createListSearch } from '../../shared/utils/list-search.util';

@Component({
  selector: 'app-service-order-list',
  standalone: true,
  imports: [
    ListShellComponent,
    ListItemComponent,
    IonIcon,
    EnumLabelPipe,
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
  ],
  styles: [
    `
      .status-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 700;
        padding: 6px 10px;
        border-radius: 8px;
        transition: all 0.2s ease;
      }
      .status-btn-start {
        color: #60a5fa;
        border: 1px solid rgba(96, 165, 250, 0.35);
      }
      .status-btn-start:hover {
        background: rgba(96, 165, 250, 0.15);
        border-color: rgba(96, 165, 250, 0.6);
      }
      .status-btn-complete {
        color: #4ade80;
        border: 1px solid rgba(74, 222, 128, 0.35);
      }
      .status-btn-complete:hover {
        background: rgba(74, 222, 128, 0.15);
        border-color: rgba(74, 222, 128, 0.6);
      }
      .status-btn-alert {
        color: #facc15;
        border: 1px solid rgba(250, 204, 21, 0.35);
      }
      .status-btn-alert:hover {
        background: rgba(250, 204, 21, 0.15);
        border-color: rgba(250, 204, 21, 0.6);
      }
      .status-btn-pay {
        color: #a78bfa;
        border: 1px solid rgba(167, 139, 250, 0.35);
      }
      .status-btn-pay:hover {
        background: rgba(167, 139, 250, 0.15);
        border-color: rgba(167, 139, 250, 0.6);
      }
      .status-btn-info {
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.35);
      }
      .status-btn-info:hover {
        background: rgba(34, 197, 94, 0.15);
        border-color: rgba(34, 197, 94, 0.6);
      }
    `,
  ],
  template: `
    <app-list-shell
      title="Órdenes de Servicio"
      subtitle="Gestiona las órdenes de servicio"
      addRoute="/service-orders/new"
      addLabel="Nueva Orden"
      searchPlaceholder="Buscar por vehículo o cliente..."
      [loading]="orderService.loading()"
      [items]="orderService.orders()"
      [totalPages]="orderService.pagination()?.totalPages ?? 0"
      [currentPage]="search.page()"
      emptyIcon="construct-outline"
      emptyMessage="No hay órdenes de servicio."
      emptyAddRoute="/service-orders/new"
      emptyAddLabel="Crear primera orden"
      (search)="search.onSearch($event)"
      (pageChange)="search.goToPage($event)"
    >
      @for (order of orderService.orders(); track order.id) {
        <app-list-item
          [editLink]="['/service-orders', order.id, 'edit']"
          [deleteMessage]="getCancelMessage(order.id)"
          [hideEdit]="order.status !== 'Open'"
          [hideDelete]="
            order.status === 'Completed' ||
            order.status === 'Paid' ||
            order.status === 'Cancelled'
          "
          (deleteConfirm)="cancelOrder(order.id)"
        >
          <div actions>
            @if (order.status === 'Open') {
              <button
                class="status-btn status-btn-start"
                (click)="startOrder(order.id)"
              >
                <ion-icon name="play-outline" class="text-[16px]"></ion-icon>
                Iniciar
              </button>
            }
            @if (order.status === 'InProgress') {
              <button
                class="status-btn status-btn-complete"
                (click)="completeOrder(order.id)"
              >
                <ion-icon
                  name="checkmark-outline"
                  class="text-[16px]"
                ></ion-icon>
                Completar
              </button>
            }
            @if (order.status === 'Completed' && order.estimatedDailyKm) {
              <button
                class="status-btn status-btn-alert"
                (click)="createAlert(order.id)"
              >
                <ion-icon
                  name="notifications-outline"
                  class="text-[16px]"
                ></ion-icon>
                Alerta
              </button>
            }
            @if (order.status === 'Completed') {
              <button
                class="status-btn status-btn-pay ml-1"
                (click)="payOrder(order.id, order.totalAmount)"
              >
                <ion-icon name="cash-outline" class="text-[16px]"></ion-icon>
                Cobrar
              </button>
            }
            @if (order.status === 'Paid') {
              <button
                class="status-btn status-btn-info"
                (click)="viewPayment(order)"
              >
                <ion-icon name="eye-outline" class="text-[16px]"></ion-icon>
                Ver Pago
              </button>
            }
          </div>
          <h3
            class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap"
          >
            {{ order.vehicleInfo }}
          </h3>
          <div
            class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)"
          >
            <span class="flex items-center gap-1">
              <ion-icon name="people-outline" class="text-[14px]"></ion-icon>
              {{ order.clientName }}
            </span>
            <span class="flex items-center gap-1">
              <ion-icon
                name="speedometer-outline"
                class="text-[14px]"
              ></ion-icon>
              {{ order.currentKm | number }} km
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="calendar-outline" class="text-[14px]"></ion-icon>
              {{ order.date | date: 'dd/MM/yyyy' }}
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="cash-outline" class="text-[14px]"></ion-icon>
              {{ order.totalAmount | currency: 'USD' : 'symbol' : '1.2-2' }}
              @if (order.applyLaborPercentage && order.laborPercentage) {
                <span class="text-[10px] opacity-60">
                  ({{ order.laborPercentage }}% M.O.)
                </span>
              }
            </span>
            <span class="flex items-center gap-1">
              <span
                class="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold"
                [class.bg-yellow-500/20]="order.status === 'Open'"
                [class.text-yellow-400]="order.status === 'Open'"
                [class.bg-blue-500/20]="order.status === 'InProgress'"
                [class.text-blue-400]="order.status === 'InProgress'"
                [class.bg-green-500/20]="order.status === 'Completed'"
                [class.text-green-400]="order.status === 'Completed'"
                [class.bg-violet-500/20]="order.status === 'Paid'"
                [class.text-violet-400]="order.status === 'Paid'"
                [class.bg-red-500/20]="order.status === 'Cancelled'"
                [class.text-red-400]="order.status === 'Cancelled'"
              >
                {{ order.status | enumLabel }}
              </span>
            </span>
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class ServiceOrderListComponent implements OnInit {
  readonly orderService = inject(ServiceOrderService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);
  private readonly mileageAlertService = inject(MileageAlertService);
  private readonly toastController = inject(ToastController);
  private readonly modalController: ModalController;

  readonly search = createListSearch(() => this.loadOrders());

  constructor() {
    this.modalController = inject(ModalController);
  }

  getCancelMessage(id: number): string {
    return `¿Cancelar la orden de servicio #${id}? La orden se marcará como cancelada.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Órdenes de Servicio');
    this.pageTitle.subtitle.set('Gestiona las órdenes de servicio');
    this.loadOrders();
    this.refreshService.refresh$.subscribe(() => this.loadOrders());
  }

  private loadOrders() {
    this.orderService.loadAll(this.search.buildParams()).subscribe();
  }

  cancelOrder(id: number) {
    this.orderService.cancel(id).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error al cancelar orden:', err),
    });
  }

  startOrder(id: number) {
    this.orderService.startOrder(id).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error al iniciar orden:', err),
    });
  }

  completeOrder(id: number) {
    this.orderService.completeOrder(id).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error al completar orden:', err),
    });
  }

  async viewPayment(order: ServiceOrderResponse) {
    const modal = await this.modalController.create({
      component: PaymentDetailModalComponent,
      componentProps: { order },
      cssClass: 'payment-modal',
    });
    await modal.present();
  }

  async payOrder(id: number, totalAmount: number) {
    const modal = await this.modalController.create({
      component: PaymentModalComponent,
      componentProps: { orderId: id, totalAmount },
      cssClass: 'payment-modal',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.success) {
      this.loadOrders();
    }
  }

  createAlert(orderId: number) {
    this.mileageAlertService.createFromOrder(orderId).subscribe({
      next: (res) => {
        this.loadOrders();
        const data = res as any;
        const msg = data?.message || 'Alerta creada y notificación enviada';
        this.toastController.create({ message: msg, duration: 3000, color: 'success', position: 'bottom' }).then(t => t.present());
      },
      error: async (err) => {
        console.error('Error al crear alerta:', err);
        (await this.toastController.create({
          message: 'Error al crear alerta',
          duration: 3000, color: 'danger', position: 'bottom',
        })).present();
      },
    });
  }
}
