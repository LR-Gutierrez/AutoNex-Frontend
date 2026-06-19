import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  archiveOutline,
  checkmarkCircleOutline,
  createOutline,
  shieldCheckmarkOutline,
  timeOutline,
} from 'ionicons/icons';
import {
  ExchangeRateStatus,
  getExchangeRateStatusLabel,
} from '../../core/models/exchange-rate.model';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';

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
      .btn-outline {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 5px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        background: transparent;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .btn-outline-authorize {
        color: #60a5fa;
        border: 1.5px solid rgba(96, 165, 250, 0.5);
      }
      .btn-outline-authorize:hover {
        background: rgba(96, 165, 250, 0.1);
        border-color: rgba(96, 165, 250, 0.8);
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
      [currentPage]="page()"
      emptyIcon="cash-outline"
      emptyMessage="No hay boletines registrados."
      (search)="onSearch($event)"
      (pageChange)="goToPage($event)"
    >
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
              <button class="btn-outline btn-outline-authorize" (click)="authorize(pub.id)">
                <ion-icon
                  name="shield-checkmark-outline"
                  class="text-[16px]"
                ></ion-icon>
                Autorizar
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
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);

  readonly page = signal(1);
  private readonly searchTerm = signal('');

  protected readonly ExchangeRateStatus = ExchangeRateStatus;
  protected readonly getExchangeRateStatusLabel = getExchangeRateStatusLabel;

  constructor() {
    addIcons({
      archiveOutline,
      checkmarkCircleOutline,
      createOutline,
      shieldCheckmarkOutline,
      timeOutline,
    });
  }

  ngOnInit() {
    this.pageTitle.title.set('Tasas de Cambio');
    this.pageTitle.subtitle.set('Boletines de tasas del BCV');
    this.loadRates();
    this.refreshService.refresh$.subscribe(() => this.loadRates());
  }

  private loadRates() {
    let params = new HttpParams().set('page', this.page().toString());
    const search = this.searchTerm().trim();
    if (search) params = params.set('search', search);
    this.exchangeRateService.loadAll(params).subscribe();
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.loadRates();
  }

  goToPage(p: number) {
    this.page.set(p);
    this.loadRates();
  }

  authorize(id: number) {
    this.exchangeRateService
      .authorize(id)
      .subscribe({ next: () => this.loadRates() });
  }

  deleteRate(id: number) {
    this.exchangeRateService
      .delete(id)
      .subscribe({ next: () => this.loadRates() });
  }
}
