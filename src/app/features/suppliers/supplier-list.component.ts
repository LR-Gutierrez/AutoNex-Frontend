import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { IonIcon } from '@ionic/angular/standalone';
import { SupplierService } from '../../core/services/supplier.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';

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
      [currentPage]="page()"
      emptyIcon="business-outline"
      emptyMessage="No hay proveedores registrados."
      emptyAddRoute="/suppliers/new"
      emptyAddLabel="Crear primer proveedor"
      (search)="onSearch($event)"
      (pageChange)="goToPage($event)"
    >
      @for (supplier of supplierService.suppliers(); track supplier.id) {
        <app-list-item
          [editLink]="['/suppliers', supplier.id, 'edit']"
          [deleteMessage]="getDeleteMessage(supplier.name)"
          (deleteConfirm)="deleteSupplier(supplier.id)"
        >
          <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
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

  readonly page = signal(1);
  private readonly searchTerm = signal('');

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
    let params = new HttpParams().set('page', this.page().toString());
    const search = this.searchTerm().trim();
    if (search) params = params.set('search', search);
    this.supplierService.loadAll(params).subscribe();
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.loadSuppliers();
  }

  goToPage(p: number) {
    this.page.set(p);
    this.loadSuppliers();
  }

  deleteSupplier(id: number) {
    this.supplierService.delete(id).subscribe({ next: () => this.loadSuppliers() });
  }
}
