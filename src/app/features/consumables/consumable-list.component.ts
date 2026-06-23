import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { ConsumableService } from '../../core/services/consumable.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';
import { createListSearch } from '../../shared/utils/list-search.util';

@Component({
  selector: 'app-consumable-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon, EnumLabelPipe, CurrencyPipe],
  template: `
    <app-list-shell
      title="Consumibles"
      subtitle="Gestiona el inventario de consumibles"
      addRoute="/consumables/new"
      addLabel="Nuevo Consumible"
      searchPlaceholder="Buscar por nombre o categoría..."
      [loading]="consumableService.loading()"
      [items]="consumableService.consumables()"
      [totalPages]="consumableService.pagination()?.totalPages ?? 0"
      [currentPage]="search.page()"
      emptyIcon="water-outline"
      emptyMessage="No hay consumibles registrados."
      emptyAddRoute="/consumables/new"
      emptyAddLabel="Crear primer consumible"
      (search)="search.onSearch($event)"
      (pageChange)="search.goToPage($event)"
    >
      @for (item of consumableService.consumables(); track item.id) {
        <app-list-item
          [editLink]="['/consumables', item.id, 'edit']"
          [deleteMessage]="getDeleteMessage(item.name)"
          (deleteConfirm)="deleteConsumable(item.id)"
        >
          <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ item.name }}
          </h3>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)">
            <span class="flex items-center gap-1">
              <ion-icon name="pricetag-outline" class="text-[14px]"></ion-icon>
              {{ item.category | enumLabel }}
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="cube-outline" class="text-[14px]"></ion-icon>
              Stock: {{ item.stockQuantity }}
            </span>
            @if (item.minStock) {
              <span class="flex items-center gap-1">
                <ion-icon name="alert-circle-outline" class="text-[14px]"></ion-icon>
                Min: {{ item.minStock }}
              </span>
            }
            <span class="flex items-center gap-1">
              <ion-icon name="cash-outline" class="text-[14px]"></ion-icon>
              {{ item.unitPrice | currency:'USD':'symbol':'1.2-2' }}
            </span>
            @if (item.supplierName) {
              <span class="flex items-center gap-1">
                <ion-icon name="business-outline" class="text-[14px]"></ion-icon>
                {{ item.supplierName }}
              </span>
            }
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class ConsumableListComponent implements OnInit {
  readonly consumableService = inject(ConsumableService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);

  readonly search = createListSearch(() => this.loadConsumables());

  getDeleteMessage(name: string): string {
    return `¿Eliminar el consumible "${name}"? Esta acción no se puede deshacer.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Consumibles');
    this.pageTitle.subtitle.set('Gestiona el inventario de consumibles');
    this.loadConsumables();
    this.refreshService.refresh$.subscribe(() => this.loadConsumables());
  }

  private loadConsumables() {
    this.consumableService.loadAll(this.search.buildParams()).subscribe();
  }

  deleteConsumable(id: number) {
    this.consumableService.delete(id).subscribe({ next: () => this.loadConsumables() });
  }
}
