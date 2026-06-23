import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { VehicleService } from '../../core/services/vehicle.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { createListSearch } from '../../shared/utils/list-search.util';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon, RouterLink],
  template: `
    <app-list-shell
      title="Vehículos"
      subtitle="Gestiona los vehículos registrados en el sistema"
      addRoute="/vehicles/new"
      addLabel="Nuevo Vehículo"
      searchPlaceholder="Buscar por placa, marca o modelo..."
      [loading]="vehicleService.loading()"
      [items]="vehicleService.vehicles()"
      [totalPages]="vehicleService.pagination()?.totalPages ?? 0"
      [currentPage]="search.page()"
      emptyIcon="car-outline"
      emptyMessage="No hay vehículos registrados."
      emptyAddRoute="/vehicles/new"
      emptyAddLabel="Registrar primer vehículo"
      (search)="search.onSearch($event)"
      (pageChange)="search.goToPage($event)"
    >
      @for (vehicle of vehicleService.vehicles(); track vehicle.id) {
        <app-list-item
          [editLink]="['/vehicles', vehicle.id, 'edit']"
          [deleteMessage]="getDeleteMessage(vehicle.brand, vehicle.model, vehicle.licensePlate)"
          (deleteConfirm)="deleteVehicle(vehicle.id)"
        >
          <a [routerLink]="['/vehicles', vehicle.id]" class="no-underline">
            <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap hover:text-(--ion-color-danger) transition-colors">
              {{ vehicle.brand }} {{ vehicle.model }}
            </h3>
          </a>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)">
            <span class="flex items-center gap-1">
              <ion-icon name="calendar-outline" class="text-[14px]"></ion-icon>
              {{ vehicle.year }}
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="clipboard-outline" class="text-[14px]"></ion-icon>
              {{ vehicle.licensePlate }}
            </span>
            @if (vehicle.vin) {
              <span class="flex items-center gap-1">
                <ion-icon name="barcode-outline" class="text-[14px]"></ion-icon>
                {{ vehicle.vin }}
              </span>
            }
            <span class="flex items-center gap-1">
              <ion-icon name="person-outline" class="text-[14px]"></ion-icon>
              {{ vehicle.clientName }}
            </span>
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class VehicleListComponent implements OnInit {
  readonly vehicleService = inject(VehicleService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);

  readonly search = createListSearch();

  getDeleteMessage(brand: string, model: string, plate: string): string {
    return `¿Eliminar el vehículo "${brand} ${model}" (${plate})? Esta acción no se puede deshacer.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Vehículos');
    this.pageTitle.subtitle.set('Gestiona los vehículos registrados en el sistema');
    this.loadVehicles();
    this.refreshService.refresh$.subscribe(() => this.loadVehicles());
  }

  private loadVehicles() {
    this.vehicleService.loadAll(this.search.buildParams()).subscribe();
  }

  deleteVehicle(id: number) {
    this.vehicleService.delete(id).subscribe({ next: () => this.loadVehicles() });
  }
}
