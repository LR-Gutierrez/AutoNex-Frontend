import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { ServiceOrderService } from '../../core/services/service-order.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';

@Component({
  selector: 'app-service-order-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon, EnumLabelPipe, DatePipe, DecimalPipe, CurrencyPipe],
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
          [deleteMessage]="getDeleteMessage(order.id)"
          (deleteConfirm)="deleteOrder(order.id)"
        >
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

  readonly page = signal(1);
  private readonly searchTerm = signal('');

  getDeleteMessage(id: number): string {
    return `¿Eliminar la orden de servicio #${id}? Esta acción no se puede deshacer.`;
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

  deleteOrder(id: number) {
    this.orderService.delete(id).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error('Error al eliminar orden:', err),
    });
  }
}
