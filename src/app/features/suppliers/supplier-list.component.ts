import { Component, inject, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { SupplierService } from '../../core/services/supplier.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { createListSearch } from '../../shared/utils/list-search.util';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon],
  template: `
    <app-list-shell
      title="Proveedores"
      subtitle="Gestiona los proveedores registrados en el sistema"
      addRoute="/suppliers/new"
      addLabel="Nuevo Proveedor"
      searchPlaceholder="Buscar por nombre, contacto, teléfono o correo..."
      [loading]="supplierService.loading()"
      [items]="supplierService.suppliers()"
      [totalPages]="supplierService.pagination()?.totalPages ?? 0"
      [currentPage]="search.page()"
      emptyIcon="business-outline"
      emptyMessage="No hay proveedores registrados."
      emptyAddRoute="/suppliers/new"
      emptyAddLabel="Crear primer proveedor"
      (search)="search.onSearch($event)"
      (pageChange)="search.goToPage($event)"
    >
      @for (supplier of supplierService.suppliers(); track supplier.id) {
        <app-list-item
          [editLink]="['/suppliers', supplier.id, 'edit']"
          [deleteMessage]="getDeleteMessage(supplier.name)"
          (deleteConfirm)="deleteSupplier(supplier.id)"
        >
          <h3 class="m-0 text-sm font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ supplier.name }}
          </h3>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)">
            @if (supplier.contactPerson) {
              <span class="flex items-center gap-1">
                <ion-icon name="person-outline" class="text-[14px]"></ion-icon>
                {{ supplier.contactPerson }}
              </span>
            }
            @if (supplier.phone) {
              <span class="flex items-center gap-1">
                <ion-icon name="call-outline" class="text-[14px]"></ion-icon>
                {{ supplier.phone }}
              </span>
            }
            @if (supplier.email) {
              <span class="flex items-center gap-1">
                <ion-icon name="mail-outline" class="text-[14px]"></ion-icon>
                {{ supplier.email }}
              </span>
            }
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class SupplierListComponent implements OnInit {
  readonly supplierService = inject(SupplierService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);

  readonly search = createListSearch(() => this.loadSuppliers());

  getDeleteMessage(name: string): string {
    return `¿Eliminar al proveedor "${name}"? Esta acción no se puede deshacer.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Proveedores');
    this.pageTitle.subtitle.set('Gestiona los proveedores registrados en el sistema');
    this.loadSuppliers();
    this.refreshService.refresh$.subscribe(() => this.loadSuppliers());
  }

  private loadSuppliers() {
    this.supplierService.loadAll(this.search.buildParams()).subscribe();
  }

  deleteSupplier(id: number) {
    this.supplierService.delete(id).subscribe({ next: () => this.loadSuppliers() });
  }
}
