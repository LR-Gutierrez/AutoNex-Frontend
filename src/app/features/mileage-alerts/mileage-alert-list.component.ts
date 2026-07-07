import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { MileageAlertService } from '../../core/services/mileage-alert.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { createListSearch } from '../../shared/utils/list-search.util';
import { addIcons } from 'ionicons';
import { constructOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mileage-alert-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon, DecimalPipe, FormsModule],
  styles: [
    `
    .badge-due {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge-due--yes {
      background: rgba(250, 204, 21, 0.2);
      color: #facc15;
    }
    .badge-due--no {
      background: rgba(74, 222, 128, 0.15);
      color: #4ade80;
    }
    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge-status--pending {
      background: rgba(250, 204, 21, 0.2);
      color: #facc15;
    }
    .badge-status--completed {
      background: rgba(74, 222, 128, 0.15);
      color: #4ade80;
    }
    .badge-days {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge-days--danger {
      background: rgba(255, 59, 48, 0.15);
      color: #ff5a52;
    }
    .badge-days--warn {
      background: rgba(250, 204, 21, 0.15);
      color: #facc15;
    }
    .badge-days--safe {
      background: rgba(74, 222, 128, 0.15);
      color: #4ade80;
    }
    .action-btn + .action-btn {
      margin-left: 6px;
    }
    .app-action-btn + .app-action-btn {
      margin-left: 6px;
    }
  `,
  ],
  template: `
    <app-list-shell
      title="Alertas de Kilometraje"
      subtitle="Monitorea el kilometraje de los vehículos"
      searchPlaceholder="Buscar por vehículo..."
      [loading]="alertService.loading()"
      [items]="alertService.alerts()"
      [totalPages]="alertService.pagination()?.totalPages ?? 0"
      [currentPage]="search.page()"
      emptyIcon="speedometer-outline"
      emptyMessage="No hay alertas de kilometraje. Las alertas se crean al completar órdenes de servicio."
      (search)="search.onSearch($event)"
      (pageChange)="search.goToPage($event)"
    >
      @for (alert of alertService.alerts(); track alert.id) {
        <app-list-item
          [editLink]="['/mileage-alerts']"
          [hideEdit]="true"
          [hideDelete]="true"
        >
          <h3 class="m-0 text-sm font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ alert.vehicleInfo }}
          </h3>
          @if (alert.serviceName) {
            <p class="m-0 mt-0.5 text-xs text-(--app-text-muted) text-ellipsis overflow-hidden whitespace-nowrap">
              <ion-icon name="construct-outline" class="text-[12px] mr-1 align-middle"></ion-icon>
              {{ alert.serviceName }}
            </p>
          }
          <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2 text-xs text-(--app-text-muted)">
            <span class="flex items-center gap-1.5 @max-2xs:col-span-2">
              <ion-icon name="speedometer-outline" class="text-[14px] shrink-0"></ion-icon>
              <span class="truncate">Último: {{ alert.currentKm | number }} km</span>
            </span>
            <span class="flex items-center gap-1.5">
              <ion-icon name="refresh-outline" class="text-[14px] shrink-0"></ion-icon>
              <span class="truncate">~{{ alert.estimatedWeeklyKm | number }} km/sem</span>
            </span>
            <span class="flex items-center gap-1.5">
              <ion-icon name="flag-outline" class="text-[14px] shrink-0"></ion-icon>
              <span class="truncate">Alerta: {{ alert.nextAlertKm | number }} km</span>
            </span>
            <span class="flex items-center gap-1.5">
              <ion-icon name="resize-outline" class="text-[14px] shrink-0"></ion-icon>
              <span class="truncate">Restan: {{ alert.remainingKm != null ? (alert.remainingKm | number) : '—' }} km</span>
            </span>
            <span class="flex items-center gap-1.5 @max-2xs:col-span-2">
              <span class="badge-due" [class.badge-due--yes]="alert.isDue" [class.badge-due--no]="!alert.isDue">
                <ion-icon [name]="alert.isDue ? 'warning-outline' : 'checkmark-outline'" class="text-[12px]"></ion-icon>
                {{ alert.isDue ? 'Vencida' : 'Al día' }}
              </span>
              @let days = estimatedDays(alert);
              <span class="badge-days" [class.badge-days--danger]="days !== null && days <= 7" [class.badge-days--warn]="days !== null && days > 7 && days <= 30" [class.badge-days--safe]="days !== null && days > 30">
                <ion-icon name="time-outline" class="text-[12px]"></ion-icon>
                {{ days !== null ? '~' + days + ' días' : '—' }}
              </span>
              <span class="badge-status" [class.badge-status--pending]="alert.isActive" [class.badge-status--completed]="!alert.isActive">
                {{ alert.isActive ? 'Pendiente' : 'Atendida' }}
              </span>
            </span>
          </div>
          <div actions>
            @if (alert.isActive) {
              <button class="app-action-btn app-action-btn--primary" (click)="attendAlert(alert.id)">
                <ion-icon name="checkmark-circle-outline" class="text-[16px]"></ion-icon>
                Atendido
              </button>
              <button class="app-action-btn app-action-btn--danger" (click)="dismissAlert(alert.id)">
                <ion-icon name="close-circle-outline" class="text-[16px]"></ion-icon>
                Descartar
              </button>
            }
            <button class="app-action-btn app-action-btn--neutral" (click)="editWeeklyKm(alert)">
              <ion-icon name="create-outline" class="text-[16px]"></ion-icon>
            </button>
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class MileageAlertListComponent implements OnInit {
  readonly alertService = inject(MileageAlertService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);
  private readonly alertController = inject(AlertController);

  readonly search = createListSearch(() => this.loadAlerts());

  constructor() {
    addIcons({ constructOutline });
  }

  ngOnInit() {
    this.pageTitle.title.set('Alertas de Kilometraje');
    this.pageTitle.subtitle.set('Monitorea el kilometraje de los vehículos');
    this.loadAlerts();
    this.refreshService.refresh$.subscribe(() => this.loadAlerts());
  }

  private loadAlerts() {
    this.alertService.loadAll(this.search.buildParams()).subscribe();
  }

  attendAlert(id: number) {
    this.alertService.attend(id).subscribe({ next: () => this.loadAlerts() });
  }

  dismissAlert(id: number) {
    this.alertService.delete(id).subscribe({ next: () => this.loadAlerts() });
  }

  estimatedDays(alert: import('../../core/models/mileage-alert.model').MileageAlertResponse): number | null {
    if (!alert.estimatedWeeklyKm || alert.estimatedWeeklyKm <= 0 || alert.remainingKm == null) return null;
    return Math.ceil((alert.remainingKm / alert.estimatedWeeklyKm) * 7);
  }

  async editWeeklyKm(alert: import('../../core/models/mileage-alert.model').MileageAlertResponse) {
    const input = await this.alertController.create({
      header: 'Editar kilometraje semanal',
      message: `Semanal actual: ~${alert.estimatedWeeklyKm.toLocaleString()} km`,
      inputs: [
        {
          name: 'estimatedWeeklyKm',
          type: 'number',
          placeholder: 'Km por semana',
          value: alert.estimatedWeeklyKm,
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const val = parseInt(data.estimatedWeeklyKm, 10);
            if (val > 0) {
              this.alertService.update(alert.id, { estimatedWeeklyKm: val }).subscribe({
                next: () => this.loadAlerts(),
              });
            }
            return val > 0;
          },
        },
      ],
    });
    await input.present();
  }
}
