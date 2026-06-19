import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { ServiceOrderService } from '../../core/services/service-order.service';
import { MileageAlertService } from '../../core/services/mileage-alert.service';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';
import { PayServiceOrderRequest } from '../../core/models/service-order.model';

@Component({
  selector: 'app-service-order-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon, EnumLabelPipe, DatePipe, DecimalPipe, CurrencyPipe],
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
      [currentPage]="page()"
      emptyIcon="construct-outline"
      emptyMessage="No hay órdenes de servicio."
      emptyAddRoute="/service-orders/new"
      emptyAddLabel="Crear primera orden"
      (search)="onSearch($event)"
      (pageChange)="goToPage($event)"
    >
      @for (order of orderService.orders(); track order.id) {
        <app-list-item
          [editLink]="['/service-orders', order.id, 'edit']"
          [deleteMessage]="getCancelMessage(order.id)"
          [hideEdit]="order.status !== 'Open'"
          [hideDelete]="order.status === 'Completed' || order.status === 'Paid' || order.status === 'Cancelled'"
          (deleteConfirm)="cancelOrder(order.id)"
        >
          <div actions>
            @if (order.status === 'Open') {
              <button class="status-btn status-btn-start" (click)="startOrder(order.id)">
                <ion-icon name="play-outline" class="text-[16px]"></ion-icon>
                Iniciar
              </button>
            }
            @if (order.status === 'InProgress') {
              <button class="status-btn status-btn-complete" (click)="completeOrder(order.id)">
                <ion-icon name="checkmark-outline" class="text-[16px]"></ion-icon>
                Completar
              </button>
            }
            @if (order.status === 'Completed' && order.estimatedDailyKm) {
              <button class="status-btn status-btn-alert" (click)="createAlert(order.id)">
                <ion-icon name="notifications-outline" class="text-[16px]"></ion-icon>
                Alerta
              </button>
            }
            @if (order.status === 'Completed') {
              <button class="status-btn status-btn-pay" (click)="payOrder(order.id)">
                <ion-icon name="cash-outline" class="text-[16px]"></ion-icon>
                Cobrar
              </button>
            }
          </div>
          <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ order.vehicleInfo }}
          </h3>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)">
            <span class="flex items-center gap-1">
              <ion-icon name="people-outline" class="text-[14px]"></ion-icon>
              {{ order.clientName }}
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="speedometer-outline" class="text-[14px]"></ion-icon>
              {{ order.currentKm | number }} km
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="calendar-outline" class="text-[14px]"></ion-icon>
              {{ order.date | date:'dd/MM/yyyy' }}
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="cash-outline" class="text-[14px]"></ion-icon>
              {{ order.totalAmount | currency:'USD':'symbol':'1.2-2' }}
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
  private readonly alertController = inject(AlertController);
  private readonly exchangeRateService = inject(ExchangeRateService);

  readonly page = signal(1);
  private readonly searchTerm = signal('');

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
    let params = new HttpParams().set('page', this.page().toString());
    const search = this.searchTerm().trim();
    if (search) params = params.set('search', search);
    this.orderService.loadAll(params).subscribe();
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.loadOrders();
  }

  goToPage(p: number) {
    this.page.set(p);
    this.loadOrders();
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

  async payOrder(id: number) {
    const alert = await this.alertController.create({
      header: 'Cobrar Orden',
      message: 'Selecciona el método de pago',
      inputs: [
        { label: 'Pago Móvil', type: 'radio', value: 'pago-movil' },
        { label: 'Transferencia Bancaria', type: 'radio', value: 'transferencia' },
        { label: 'Efectivo Dólares', type: 'radio', value: 'efectivo-dolares' },
        { label: 'Efectivo Bolívares', type: 'radio', value: 'efectivo-bolivares' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Siguiente',
          handler: (method) => this.onPaymentMethodSelected(id, method),
        },
      ],
    });
    await alert.present();
  }

  private async onPaymentMethodSelected(id: number, method: string) {
    if (!method) return;

    if (method === 'pago-movil' || method === 'transferencia') {
      const detailAlert = await this.alertController.create({
        header: method === 'pago-movil' ? 'Pago Móvil' : 'Transferencia Bancaria',
        inputs: [
          { name: 'operationNumber', type: 'text', placeholder: 'Número de operación' },
          { name: 'operationDate', type: 'date', value: new Date().toISOString().substring(0, 10) },
        ],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Confirmar Pago',
            handler: (data) => {
              if (!data.operationNumber?.trim()) {
                return false;
              }
              this.confirmPayment(id, {
                paymentMethod: method as PayServiceOrderRequest['paymentMethod'],
                operationNumber: data.operationNumber.trim(),
                operationDate: data.operationDate,
              });
              return true;
            },
          },
        ],
      });
      await detailAlert.present();
    } else if (method === 'efectivo-bolivares') {
      this.exchangeRateService.getCurrentUsd().subscribe({
        next: async (rate) => {
          const bsAmount = rate.value;
          const detailAlert = await this.alertController.create({
            header: 'Efectivo Bolívares',
            message: `Tasa BCV: Bs. ${bsAmount.toFixed(2)} por USD`,
            inputs: [
              { name: 'amountBs', type: 'number', placeholder: 'Monto en Bs.' },
            ],
            buttons: [
              { text: 'Cancelar', role: 'cancel' },
              {
                text: 'Confirmar Pago',
                handler: (data) => {
                  if (!data.amountBs || parseFloat(data.amountBs) <= 0) {
                    return false;
                  }
                  this.confirmPayment(id, {
                    paymentMethod: 'efectivo-bolivares',
                    amountBs: parseFloat(data.amountBs),
                  });
                  return true;
                },
              },
            ],
          });
          await detailAlert.present();
        },
        error: async () => {
          const fallbackAlert = await this.alertController.create({
            header: 'Efectivo Bolívares',
            message: 'No se pudo obtener la tasa de cambio. Ingresa el monto manualmente.',
            inputs: [
              { name: 'amountBs', type: 'number', placeholder: 'Monto en Bs.' },
            ],
            buttons: [
              { text: 'Cancelar', role: 'cancel' },
              {
                text: 'Confirmar Pago',
                handler: (data) => {
                  if (!data.amountBs || parseFloat(data.amountBs) <= 0) {
                    return false;
                  }
                  this.confirmPayment(id, {
                    paymentMethod: 'efectivo-bolivares',
                    amountBs: parseFloat(data.amountBs),
                  });
                  return true;
                },
              },
            ],
          });
          await fallbackAlert.present();
        },
      });
    } else {
      this.confirmPayment(id, {
        paymentMethod: method as PayServiceOrderRequest['paymentMethod'],
      });
    }
  }

  private confirmPayment(id: number, request: PayServiceOrderRequest) {
    this.orderService.payOrder(id, request).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error al cobrar orden:', err),
    });
  }

  createAlert(orderId: number) {
    this.mileageAlertService.createFromOrder(orderId).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error al crear alerta:', err),
    });
  }
}
