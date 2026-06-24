import { Component, computed, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { ModalController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  archiveOutline,
  checkmarkCircleOutline,
  createOutline,
  documentTextOutline,
  shieldCheckmarkOutline,
  timeOutline,
  syncOutline,
  toggleOutline,
  checkmarkDoneOutline,
} from 'ionicons/icons';
import {
  ExchangeRateStatus,
  getExchangeRateStatusLabel,
  bcvActionKind,
} from '../../core/models/exchange-rate.model';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { SignalRService } from '../../core/services/signalr.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { createListSearch } from '../../shared/utils/list-search.util';

@Component({
  selector: 'app-exchange-rate-list',
  standalone: true,
  imports: [
    ListShellComponent,
    ListItemComponent,
    IonIcon,
    DatePipe,
    DecimalPipe,
  ],
  styles: [
    `
      .rate-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }
      .rate-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 10px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 600;
        background: rgba(52, 211, 153, 0.1);
        color: #34d399;
        border: 1px solid rgba(52, 211, 153, 0.2);
      }
      .rate-chip.usd {
        background: rgba(59, 130, 246, 0.12);
        color: #60a5fa;
        border-color: rgba(59, 130, 246, 0.25);
        font-weight: 700;
        font-size: 13px;
      }
      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 10px;
        border-radius: 100px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      .status-badge-draft {
        background: transparent;
        color: #facc15;
        border: 1.5px solid rgba(250, 204, 21, 0.5);
      }
      .status-badge-authorized {
        background: transparent;
        color: #60a5fa;
        border: 1.5px solid rgba(96, 165, 250, 0.5);
      }
      .status-badge-published {
        background: transparent;
        color: #4ade80;
        border: 1.5px solid rgba(74, 222, 128, 0.5);
      }
      .status-badge-historical {
        background: transparent;
        color: #9ca3af;
        border: 1.5px solid rgba(107, 114, 128, 0.5);
      }
      .header-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 700;
        background: transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        border: 2px solid;
        text-decoration: none;
        font-family: inherit;
      }
      .header-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .header-btn-sync {
        color: #34d399;
        border-color: rgba(52, 211, 153, 0.4);
      }
      .header-btn-sync:hover:not(:disabled) {
        background: rgba(52, 211, 153, 0.1);
        border-color: #34d399;
      }
      .header-btn-toggle {
        color: rgba(255, 255, 255, 0.5);
        border-color: rgba(255, 255, 255, 0.15);
      }
      .header-btn-toggle:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.3);
      }
      .header-btn-toggle.active {
        color: #34d399;
        border-color: rgba(52, 211, 153, 0.4);
      }
      .header-btn-toggle.active:hover {
        background: rgba(52, 211, 153, 0.1);
        border-color: #34d399;
      }
      .header-btn-toggle .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        transition: all 0.3s ease;
      }
      .header-btn-toggle.active .dot {
        background: #34d399;
        box-shadow: 0 0 6px rgba(52, 211, 153, 0.4);
      }
      .header-btn-logs {
        color: rgba(255, 255, 255, 0.5);
        border-color: rgba(255, 255, 255, 0.15);
      }
      .header-btn-logs:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.3);
      }
      .retry-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 600;
        color: #34d399;
        letter-spacing: 0.02em;
      }
      .retry-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #34d399;
        animation: pulse-dot 2s ease-in-out infinite;
      }
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5); }
        50% { opacity: 0.5; box-shadow: 0 0 6px 2px rgba(52, 211, 153, 0.2); }
      }
      .app-action-btn + .app-action-btn {
        margin-left: 6px;
      }
    `,
  ],
  template: `
    <app-list-shell
      title="Tasas de Cambio"
      subtitle="Boletines de tasas del BCV"
      addRoute="/exchange-rates/new"
      addLabel="Nuevo Boletín"
      searchPlaceholder="Buscar por observaciones..."
      [loading]="exchangeRateService.loading()"
      [items]="exchangeRateService.rates()"
      [totalPages]="exchangeRateService.pagination()?.totalPages ?? 0"
      [currentPage]="search.page()"
      emptyIcon="cash-outline"
      emptyMessage="No hay boletines registrados."
      (search)="search.onSearch($event)"
      (pageChange)="search.goToPage($event)"
    >
      <div header-actions class="flex items-center gap-2">
        <button
          class="header-btn header-btn-toggle"
          [class.active]="autoConsultEnabled()"
          (click)="toggleAutoConsult()"
          title="Auto-consulta BCV"
        >
          <span class="dot"></span>
          Auto BCV
        </button>
        <button
          class="header-btn header-btn-sync"
          [disabled]="syncing()"
          (click)="syncBcv()"
          title="Sincronizar BCV ahora"
        >
          @if (syncing()) {
            <ion-icon name="sync-outline" class="text-[18px] animate-spin"></ion-icon>
          } @else {
            <ion-icon name="sync-outline" class="text-[18px]"></ion-icon>
          }
          Sincronizar
        </button>
        <button
          class="header-btn header-btn-logs"
          (click)="openLogs()"
          title="Ver logs de sincronización"
        >
          <ion-icon name="document-text-outline" class="text-[18px]"></ion-icon>
          Logs
        </button>
      </div>
      <div class="flex items-center gap-2 mt-2 max-md:mt-1.5">
        @if (autoConsultEnabled() && retryEnabled() && nextRetryUtc()) {
          <span class="retry-badge">
            <span class="retry-dot"></span>
            {{ retryCountdown() }}
          </span>
        }
      </div>
      @for (pub of exchangeRateService.rates(); track pub.id) {
        <app-list-item
          [editLink]="['/exchange-rates', pub.id, 'edit']"
          [hideEdit]="+pub.status !== ExchangeRateStatus.Draft"
          [hideDelete]="+pub.status !== ExchangeRateStatus.Draft"
          [deleteMessage]="'¿Eliminar boletín #' + pub.id + '?'"
          (deleteConfirm)="deleteRate(pub.id)"
        >
          <div actions>
            @if (+pub.status === ExchangeRateStatus.Draft) {
              <button class="app-action-btn app-action-btn--primary" (click)="authorize(pub.id)">
                <ion-icon
                  name="shield-checkmark-outline"
                  class="text-[16px]"
                ></ion-icon>
                Autorizar
              </button>
            }
            @if (+pub.status === ExchangeRateStatus.Authorized && isAdmin()) {
              <button class="app-action-btn app-action-btn--success" (click)="publish(pub.id)">
                <ion-icon
                  name="checkmark-done-outline"
                  class="text-[16px]"
                ></ion-icon>
                Poner en vigencia
              </button>
            }
          </div>
          <h3
            class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap"
          >
            Boletín #{{ pub.id }}
          </h3>
          <div
            class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)"
          >
            <span class="flex items-center gap-1">
              <ion-icon name="calendar-outline" class="text-[14px]"></ion-icon>
              {{ pub.valueDate | date: 'dd/MM/yyyy' }}
            </span>
            @if (pub.publishedAt) {
              <span class="flex items-center gap-1">
                <ion-icon name="time-outline" class="text-[14px]"></ion-icon>
                {{ pub.publishedAt | date: 'dd/MM/yyyy HH:mm' }}
              </span>
            }
            <span class="flex items-center gap-1">
              <span
                class="status-badge"
                [class.status-badge-draft]="
                  +pub.status === ExchangeRateStatus.Draft
                "
                [class.status-badge-authorized]="
                  +pub.status === ExchangeRateStatus.Authorized
                "
                [class.status-badge-published]="
                  +pub.status === ExchangeRateStatus.Published
                "
                [class.status-badge-historical]="
                  +pub.status === ExchangeRateStatus.Historical
                "
              >
                <ion-icon
                  [name]="
                    +pub.status === ExchangeRateStatus.Draft
                      ? 'create-outline'
                      : +pub.status === ExchangeRateStatus.Authorized
                        ? 'time-outline'
                        : +pub.status === ExchangeRateStatus.Published
                          ? 'checkmark-circle-outline'
                          : 'archive-outline'
                  "
                  class="text-[12px]"
                ></ion-icon>
                {{ getExchangeRateStatusLabel(pub.status) }}
              </span>
            </span>
          </div>
          @if (pub.observations) {
            <p class="text-xs text-(--app-text-muted) mt-1.5 opacity-70 italic">
              {{ pub.observations }}
            </p>
          }
          <div class="rate-list">
            @for (rate of pub.exchangeRates; track rate.id) {
              <span class="rate-chip" [class.usd]="rate.currencyCode === 'USD'">
                {{ rate.currencySymbol }} {{ rate.value | number: '1.2-2' }}
                <span class="opacity-60">{{ rate.currencyCode }}</span>
              </span>
            }
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class ExchangeRateListComponent implements OnInit {
  readonly exchangeRateService = inject(ExchangeRateService);
  private readonly authState = inject(AuthStateService);
  readonly isAdmin = computed(() => this.authState.role() === 'Admin');
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);
  private readonly toastController = inject(ToastController);
  private readonly modalController = inject(ModalController);
  private readonly signalr = inject(SignalRService);

  readonly search = createListSearch(() => this.loadRates());
  readonly syncing = signal(false);
  readonly autoConsultEnabled = signal(false);
  readonly retryEnabled = signal(false);
  readonly retryCountdown = signal('');
  readonly nextRetryUtc = signal<Date | null>(null);
  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private validatingTimeout: ReturnType<typeof setTimeout> | null = null;

  protected readonly ExchangeRateStatus = ExchangeRateStatus;
  protected readonly getExchangeRateStatusLabel = getExchangeRateStatusLabel;

  constructor() {
    addIcons({
      archiveOutline,
      checkmarkCircleOutline,
      createOutline,
      documentTextOutline,
      shieldCheckmarkOutline,
      checkmarkDoneOutline,
      timeOutline,
      syncOutline,
      toggleOutline,
    });
  }

  ngOnInit() {
    this.pageTitle.title.set('Tasas de Cambio');
    this.pageTitle.subtitle.set('Boletines de tasas del BCV');
    this.loadAutoConsultStatus();
    this.loadRates();
    this.refreshService.refresh$.subscribe(() => this.loadRates());

    this.countdownTimer = setInterval(() => this.updateCountdown(), 1000);

    this.signalr.startConnection('exchange-rates');
    this.signalr.on<{ newsletterId: number }>('exchange-rates', 'ExchangeRatePublished')
      .subscribe(() => {
        if (this.validatingTimeout) {
          clearTimeout(this.validatingTimeout);
          this.validatingTimeout = null;
        }
        this.loadRates();
        this.loadAutoConsultStatus();
      });

    const tryJoinGroup = setInterval(() => {
      if (this.signalr.exchangeRatesStatus() === 'connected') {
        this.signalr.joinGroup('exchange-rates', 'exchange-updates', 'JoinGroup');
        clearInterval(tryJoinGroup);
      }
    }, 500);
  }

  ngOnDestroy() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    if (this.validatingTimeout) clearTimeout(this.validatingTimeout);
    this.signalr.stopConnection('exchange-rates');
  }

  private loadAutoConsultStatus() {
    this.exchangeRateService.getAutoConsultStatus().subscribe({
      next: (res) => {
        this.autoConsultEnabled.set(res.bcv_auto_consult);
        this.retryEnabled.set(res.bcv_retry_enabled);
        this.nextRetryUtc.set(res.nextRetryUtc ? new Date(res.nextRetryUtc) : null);
        this.updateCountdown();
      },
    });
  }

  private updateCountdown() {
    const next = this.nextRetryUtc();
    if (!next) {
      this.retryCountdown.set('');
      return;
    }
    const diff = next.getTime() - Date.now();
    if (diff <= 0) {
      this.retryCountdown.set('Validando...');
      if (!this.validatingTimeout) {
        this.validatingTimeout = setTimeout(() => {
          this.validatingTimeout = null;
          this.loadRates();
          this.loadAutoConsultStatus();
        }, 30000);
      }
      return;
    }
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    this.retryCountdown.set(`Reintentando en ${mins}min ${secs}s`);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  private loadRates() {
    this.exchangeRateService.loadAll(this.search.buildParams()).subscribe();
  }

  syncBcv() {
    this.syncing.set(true);
    this.exchangeRateService.bcvFetch().subscribe({
      next: async (log) => {
        this.syncing.set(false);

        const kind = bcvActionKind(log.action);

        if (kind === 'Inserted') {
          await this.showToast('Nuevo boletín BCV creado', 'success');
          this.loadRates();
        } else if (kind === 'Skipped_AlreadyPublished') {
          await this.showToast('El BCV no ha publicado una tasa nueva aún', 'warning');
        } else if (kind === 'Skipped_AlreadyDraft') {
          await this.showToast('Ya existe un borrador para la fecha actual', 'warning');
        } else if (kind === 'Failed') {
          await this.showToast(log.error || 'Error al sincronizar BCV', 'danger');
        }
      },
      error: async (err) => {
        this.syncing.set(false);
        await this.showToast(err.error?.message || 'Error al sincronizar BCV', 'danger');
      },
    });
  }

  async openLogs() {
    const { BcvFetchLogModalComponent } = await import('./bcv-fetch-log-modal.component');
    const modal = await this.modalController.create({
      component: BcvFetchLogModalComponent,
    });
    await modal.present();
  }

  toggleAutoConsult() {
    this.exchangeRateService.toggleAutoConsult().subscribe({
      next: async (res) => {
        this.autoConsultEnabled.set(res.bcv_auto_consult);
        const msg = res.bcv_auto_consult
          ? 'Auto-consulta BCV activada'
          : 'Auto-consulta BCV desactivada';
        await this.showToast(msg, 'success');
      },
      error: async () => {
        await this.showToast('Error al cambiar configuración', 'danger');
      },
    });
  }

  authorize(id: number) {
    this.exchangeRateService
      .authorize(id)
      .subscribe({ next: () => this.loadRates() });
  }

  publish(id: number) {
    this.exchangeRateService
      .publish(id)
      .subscribe({ next: () => this.loadRates() });
  }

  deleteRate(id: number) {
    this.exchangeRateService
      .delete(id)
      .subscribe({ next: () => this.loadRates() });
  }
}
