import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ClientService } from '../../core/services/client.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { carSportOutline } from 'ionicons/icons';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { VehicleRegisterModalComponent } from './vehicle-register-modal.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon],
  styles: `
    .action-btn {
      background: transparent !important;
      transition:
        background-color 0.18s ease,
        color 0.18s ease;
    }
    .action-btn:hover {
      background: rgba(255, 255, 255, 0.06) !important;
      color: var(--app-text) !important;
    }
  `,
  template: `
    <app-list-shell
      title="Clientes"
      subtitle="Gestiona los clientes registrados en el sistema"
      addRoute="/clients/new"
      addLabel="Nuevo Cliente"
      searchPlaceholder="Buscar por nombre, teléfono o correo..."
      [loading]="clientService.loading()"
      [items]="clientService.clients()"
      [totalPages]="clientService.pagination()?.totalPages ?? 0"
      [currentPage]="page()"
      emptyIcon="people-outline"
      emptyMessage="No hay clientes registrados."
      emptyAddRoute="/clients/new"
      emptyAddLabel="Crear primer cliente"
      (search)="onSearch($event)"
      (pageChange)="goToPage($event)"
    >
      @for (client of clientService.clients(); track client.id) {
        <app-list-item
          [editLink]="['/clients', client.id, 'edit']"
          [deleteMessage]="getDeleteMessage(client.fullName)"
          (deleteConfirm)="deleteClient(client.id)"
        >
          <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ client.fullName }}
          </h3>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)">
            @if (client.phone) {
              <span class="flex items-center gap-1">
                <ion-icon name="call-outline" class="text-[14px]"></ion-icon>
                {{ client.phone }}
              </span>
            }
            @if (client.email) {
              <span class="flex items-center gap-1">
                <ion-icon name="mail-outline" class="text-[14px]"></ion-icon>
                {{ client.email }}
              </span>
            }
            @if (client.vehicles?.length) {
              <span class="flex items-center gap-1">
                <ion-icon name="car-outline" class="text-[14px]"></ion-icon>
                {{ client.vehicles?.length }} vehículo(s)
              </span>
            }
          </div>
          <div actions>
            <button
              (click)="addVehicle(client)"
              class="flex items-center justify-center w-9 h-9 rounded-[10px] text-(--app-text-muted) transition-all duration-200 cursor-pointer border-none action-btn"
              title="Registrar vehículo"
            >
              <ion-icon name="car-sport-outline" class="text-[18px]"></ion-icon>
            </button>
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class ClientListComponent implements OnInit {
  readonly clientService = inject(ClientService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);
  private readonly modalController = inject(ModalController);

  constructor() {
    addIcons({ carSportOutline });
  }

  readonly page = signal(1);
  private readonly searchTerm = signal('');

  getDeleteMessage(name: string): string {
    return `¿Eliminar al cliente "${name}"? Esta acción no se puede deshacer.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Clientes');
    this.pageTitle.subtitle.set('Gestiona los clientes registrados en el sistema');
    this.loadClients();
    this.refreshService.refresh$.subscribe(() => this.loadClients());
  }

  private loadClients() {
    let params = new HttpParams().set('page', this.page().toString());
    const search = this.searchTerm().trim();
    if (search) params = params.set('search', search);
    this.clientService.loadAll(params).subscribe();
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.loadClients();
  }

  goToPage(p: number) {
    this.page.set(p);
    this.loadClients();
  }

  deleteClient(id: number) {
    this.clientService.delete(id).subscribe({ next: () => this.loadClients() });
  }

  async addVehicle(client: { id: number; fullName: string }) {
    const modal = await this.modalController.create({
      component: VehicleRegisterModalComponent,
      componentProps: { clientId: client.id, clientName: client.fullName },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.success) {
      this.loadClients();
    }
  }
}
