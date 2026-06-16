import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { MileageAlertService } from '../../core/services/mileage-alert.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

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
    .badge-active {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge-active--yes {
      background: rgba(74, 222, 128, 0.15);
      color: #4ade80;
    }
    .badge-active--no {
      background: rgba(148, 163, 184, 0.15);
      color: #94a3b8;
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
    .action-btn {
      background: transparent;
      border: 1px solid transparent;
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
    .action-btn-review {
      color: #60a5fa;
      border-color: rgba(96, 165, 250, 0.35);
    }
    .action-btn-review:hover {
      background: rgba(96, 165, 250, 0.15);
      border-color: rgba(96, 165, 250, 0.6);
    }
    .action-btn-dismiss {
      color: #f87171;
      border-color: rgba(248, 113, 113, 0.35);
    }
    .action-btn-dismiss:hover {
      background: rgba(248, 113, 113, 0.15);
      border-color: rgba(248, 113, 113, 0.6);
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
      [currentPage]="page()"
      emptyIcon="speedometer-outline"
      emptyMessage="No hay alertas de kilometraje. Las alertas se crean al completar órdenes de servicio."
      (search)="onSearch($event)"
      (pageChange)="goToPage($event)"
    >
      @for (alert of alertService.alerts(); track alert.id) {
        <app-list-item
          [editLink]="['/mileage-alerts']"
          [deleteMessage]="'¿Eliminar la alerta de ' + alert.vehicleInfo + '?'"
          [hideEdit]="true"
          (deleteConfirm)="deleteAlert(alert.id)"
        >
          <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ alert.vehicleInfo }}
          </h3>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)">
            <span class="flex items-center gap-1">
              <ion-icon name="speedometer-outline" class="text-[14px]"></ion-icon>
              Último: {{ alert.lastRecordedKm | number }} km
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="refresh-outline" class="text-[14px]"></ion-icon>
              Semanal: ~{{ alert.estimatedWeeklyKm | number }} km
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="flag-outline" class="text-[14px]"></ion-icon>
              Próxima alerta: {{ alert.nextAlertKm | number }} km
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="resize-outline" class="text-[14px]"></ion-icon>
              Restan: {{ alert.remainingKm | number }} km
            </span>
            <span class="flex items-center gap-1">
              <span class="badge-due" [class.badge-due--yes]="alert.isDue" [class.badge-due--no]="!alert.isDue">
                <ion-icon [name]="alert.isDue ? 'warning-outline' : 'checkmark-outline'" class="text-[12px]"></ion-icon>
                {{ alert.isDue ? 'Vencida' : 'Al día' }}
              </span>
            </span>
            @let days = estimatedDays(alert);
            <span class="flex items-center gap-1">
              <span class="badge-days" [class.badge-days--danger]="days !== null && days <= 7" [class.badge-days--warn]="days !== null && days > 7 && days <= 30" [class.badge-days--safe]="days !== null && days > 30">
                <ion-icon name="time-outline" class="text-[12px]"></ion-icon>
                {{ days !== null ? '~' + days + ' días' : '—' }}
              </span>
            </span>
            <span class="flex items-center gap-1">
              <span class="badge-active" [class.badge-active--yes]="alert.isActive" [class.badge-active--no]="!alert.isActive">
                {{ alert.isActive ? 'Activa' : 'Inactiva' }}
              </span>
            </span>
          </div>
          <div actions>
            @if (alert.isActive) {
              <button class="action-btn action-btn-review" (click)="reviewAlert(alert.id)">
                <ion-icon name="checkmark-circle-outline" class="text-[16px]"></ion-icon>
                Revisar
              </button>
            }
            @if (alert.isActive) {
              <button class="action-btn action-btn-dismiss" (click)="dismissAlert(alert.id)">
                <ion-icon name="close-circle-outline" class="text-[16px]"></ion-icon>
                Desestimar
              </button>
            }
            <button class="edit-km-btn" (click)="editWeeklyKm(alert)">
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

  readonly page = signal(1);
  private readonly searchTerm = signal('');

  ngOnInit() {
    this.pageTitle.title.set('Alertas de Kilometraje');
    this.pageTitle.subtitle.set('Monitorea el kilometraje de los vehículos');
    this.loadAlerts();
    this.refreshService.refresh$.subscribe(() => this.loadAlerts());
  }

  private loadAlerts() {
    let params = new HttpParams().set('page', this.page().toString());
    const search = this.searchTerm().trim();
    if (search) params = params.set('search', search);
    this.alertService.loadAll(params).subscribe();
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.loadAlerts();
  }

  goToPage(p: number) {
    this.page.set(p);
    this.loadAlerts();
  }

  deleteAlert(id: number) {
    this.alertService.delete(id).subscribe({ next: () => this.loadAlerts() });
  }

  reviewAlert(id: number) {
    this.alertService.review(id).subscribe({ next: () => this.loadAlerts() });
  }

  dismissAlert(id: number) {
    this.alertService.delete(id).subscribe({ next: () => this.loadAlerts() });
  }

  estimatedDays(alert: import('../../core/models/mileage-alert.model').MileageAlertResponse): number | null {
    if (!alert.estimatedWeeklyKm || alert.estimatedWeeklyKm <= 0) return null;
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
