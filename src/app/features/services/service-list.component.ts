import { Component, inject, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { ServiceService } from '../../core/services/service.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { CurrencyFormatterPipe } from '../../shared/pipes/currency-formatter.pipe';
import { createListSearch } from '../../shared/utils/list-search.util';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon, CurrencyFormatterPipe],
  template: `
    <app-list-shell
      title="Servicios"
      subtitle="Catálogo de servicios ofrecidos por el taller"
      addRoute="/services/new"
      addLabel="Nuevo Servicio"
      searchPlaceholder="Buscar por nombre o descripción..."
      [loading]="serviceService.loading()"
      [items]="serviceService.services()"
      [totalPages]="serviceService.pagination()?.totalPages ?? 0"
      [currentPage]="search.page()"
      emptyIcon="construct-outline"
      emptyMessage="No hay servicios registrados."
      emptyAddRoute="/services/new"
      emptyAddLabel="Crear primer servicio"
      (search)="search.onSearch($event)"
      (pageChange)="search.goToPage($event)"
    >
      @for (service of serviceService.services(); track service.id) {
        <app-list-item
          [editLink]="['/services', service.id, 'edit']"
          [deleteMessage]="getDeleteMessage(service.name)"
          (deleteConfirm)="deleteService(service.id)"
        >
          <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ service.name }}
          </h3>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)">
            @if (service.description) {
              <span class="flex items-center gap-1">
                <ion-icon name="information-circle-outline" class="text-[14px]"></ion-icon>
                {{ service.description }}
              </span>
            }
            <span class="flex items-center gap-1">
              <ion-icon name="pricetag-outline" class="text-[14px]"></ion-icon>
              {{ service.defaultPrice | currencyFormat }}
            </span>
            @if (service.minKmInterval != null || service.maxKmInterval != null) {
              <span class="flex items-center gap-1">
                <ion-icon name="speedometer-outline" class="text-[14px]"></ion-icon>
                {{ formatKm(service.minKmInterval) }} - {{ service.maxKmInterval != null ? formatKm(service.maxKmInterval) : '∞' }} km
              </span>
            }
            @if (service.minMonth != null || service.maxMonth != null) {
              <span class="flex items-center gap-1">
                <ion-icon name="calendar-outline" class="text-[14px]"></ion-icon>
                {{ formatKm(service.minMonth) }} - {{ service.maxMonth != null ? formatKm(service.maxMonth) : '∞' }} meses
              </span>
            }
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class ServiceListComponent implements OnInit {
  readonly serviceService = inject(ServiceService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);

  readonly search = createListSearch();

  formatKm(n: number | null | undefined): string {
    return n != null ? Math.floor(n).toLocaleString('en-US') : '';
  }

  getDeleteMessage(name: string): string {
    return `¿Eliminar el servicio "${name}"? Esta acción no se puede deshacer.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Servicios');
    this.pageTitle.subtitle.set('Catálogo de servicios ofrecidos por el taller');
    this.loadServices();
    this.refreshService.refresh$.subscribe(() => this.loadServices());
  }

  private loadServices() {
    this.serviceService.loadAll(this.search.buildParams()).subscribe();
  }

  deleteService(id: number) {
    this.serviceService.delete(id).subscribe({ next: () => this.loadServices() });
  }
}
