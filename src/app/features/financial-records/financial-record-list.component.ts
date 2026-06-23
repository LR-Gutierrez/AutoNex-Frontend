import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  walletOutline,
  trendingUpOutline,
  trendingDownOutline,
  swapHorizontalOutline,
  pricetagOutline,
  calendarOutline,
  personOutline,
  eyeOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import { FinancialRecordService } from '../../core/services/financial-record.service';
import { RecurringExpenseService } from '../../core/services/recurring-expense.service';
import { AccountService } from '../../core/services/account.service';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { FinancialRecordResponse } from '../../core/models/financial-record.model';
import { RecurringExpenseResponse } from '../../core/models/recurring-expense.model';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';
import { FinancialRecordDetailModalComponent } from './financial-record-detail-modal.component';
import { createListSearch } from '../../shared/utils/list-search.util';

@Component({
  selector: 'app-financial-record-list',
  standalone: true,
  imports: [
    ListShellComponent,
    ListItemComponent,
    IonIcon,
    EnumLabelPipe,
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
  ],
  styles: `
    .balance-card {
      background: linear-gradient(
        145deg,
        rgba(28, 30, 50, 0.95),
        rgba(20, 22, 40, 0.95)
      );
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 20px 24px;
      transition: all 0.3s ease;
      backdrop-filter: blur(12px);
    }
    .balance-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }
    .balance-value {
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.03em;
    }
    .balance-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.4);
    }
    .account-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .account-badge.Bolivares {
      background: rgba(96, 165, 250, 0.12);
      color: #60a5fa;
    }
    .account-badge.Dolares {
      background: rgba(251, 191, 36, 0.12);
      color: #fbbf24;
    }
    .tab-bar {
      display: flex;
      gap: 4px;
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 14px;
      padding: 4px;
      margin: 0 20px 16px;
    }
    .tab-btn {
      flex: 1;
      padding: 8px 16px;
      border: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      background: transparent;
      color: rgba(255, 255, 255, 0.4);
    }
    .tab-btn.active {
      background: rgba(211, 29, 29, 0.2);
      color: #ef4444;
    }
    .tab-btn:hover:not(.active) {
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.7);
    }
    .recurring-card {
      background: linear-gradient(
        180deg,
        rgba(30, 32, 52, 0.96),
        rgba(24, 25, 42, 0.96)
      );
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 16px;
      margin: 0 20px 10px;
    }
    .recurring-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .recurring-name {
      font-size: 16px;
      font-weight: 700;
    }
    .recurring-badge {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 6px;
      font-weight: 600;
    }
    .recurring-badge.active {
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
    }
    .recurring-badge.inactive {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.4);
    }
    .recurring-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
    }
    .recurring-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    .rec-action-btn {
      background: rgba(255, 255, 255, 0.06);
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      border-radius: 8px;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      text-decoration: none;
    }
    .rec-action-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.9);
    }
    .rec-action-btn.danger:hover {
      background: rgba(255, 59, 48, 0.2);
      color: #ff5a52;
    }
    .frequency-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.6;
    }
  `,
  template: `
    @if (accountService.balances(); as balances) {
      <div class="px-5 max-md:px-3.5 pt-5 max-md:pt-3.5">
        <div class="grid grid-cols-2 gap-4 mb-5">
          @for (bal of balances; track bal.accountType) {
            <div class="balance-card">
              <div class="balance-label">
                {{ bal.accountType === 'Bolivares' ? 'Bolívares' : 'Dólares' }}
              </div>
              <div
                class="balance-value mt-2"
                [class.text-blue-400]="bal.accountType === 'Bolivares'"
                [class.text-amber-400]="bal.accountType === 'Dolares'"
              >
                {{ bal.accountType === 'Bolivares' ? 'Bs. ' : '$ '
                }}{{ bal.balance | number: '1.2-2' }}
              </div>
              @if (bal.accountType === 'Bolivares') {
                @if (usdRate(); as rate) {
                  <div class="text-xs text-(--app-text-muted) mt-1">
                    ≈
                    {{
                      bal.balance / rate | currency: 'USD' : 'symbol' : '1.2-2'
                    }}
                  </div>
                } @else {
                  <div class="text-xs text-(--app-text-muted) mt-1 font-medium">
                    {{ bal.currency }}
                  </div>
                }
              } @else {
                <div class="text-xs text-(--app-text-muted) mt-1 font-medium">
                  {{ bal.currency }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    }

    <div class="tab-bar">
      <button
        class="tab-btn"
        [class.active]="activeTab() === 'records'"
        (click)="activeTab.set('records')"
      >
        Registros comunes
      </button>
      <button
        class="tab-btn"
        [class.active]="activeTab() === 'recurring'"
        (click)="switchToRecurring()"
      >
        Registros Recurrentes
      </button>
    </div>

    @if (activeTab() === 'records') {
      <app-list-shell
        title="Finanzas"
        subtitle="Gestiona los ingresos y egresos"
        addRoute="/financial-records/new"
        addLabel="Nuevo Registro"
        searchPlaceholder="Buscar por descripción o categoría..."
        [loading]="financialService.loading()"
        [items]="financialService.records()"
        [totalPages]="financialService.pagination()?.totalPages ?? 0"
        [currentPage]="search.page()"
        emptyIcon="cash-outline"
        emptyMessage="No hay registros financieros."
        emptyAddRoute="/financial-records/new"
        emptyAddLabel="Crear primer registro"
        (search)="search.onSearch($event)"
        (pageChange)="search.goToPage($event)"
      >
        @for (record of financialService.records(); track record.id) {
          <app-list-item
            [editLink]="['/financial-records', record.id, 'edit']"
            [deleteMessage]="getDeleteMessage(record.description)"
            (deleteConfirm)="deleteRecord(record.id)"
          >
            <div actions>
              <button
                (click)="viewDetail(record)"
                class="flex items-center justify-center w-9 h-9 rounded-[10px] text-(--app-text-muted) transition-all duration-200 cursor-pointer border-none action-btn"
                title="Ver detalle"
              >
                <ion-icon name="eye-outline" class="text-[18px]"></ion-icon>
              </button>
            </div>
            <h3
              class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {{ record.description }}
            </h3>
            <div
              class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)"
            >
              <span class="flex items-center gap-1">
                <ion-icon
                  [name]="
                    record.type === 'Income'
                      ? 'trending-up-outline'
                      : 'trending-down-outline'
                  "
                  class="text-[14px]"
                  [class.text-green-400]="record.type === 'Income'"
                  [class.text-red-400]="record.type !== 'Income'"
                ></ion-icon>
                <span
                  [class.text-green-400]="record.type === 'Income'"
                  [class.text-red-400]="record.type !== 'Income'"
                >
                  {{ record.type === 'Income' ? '+' : '-'
                  }}{{ record.amount | currency: 'USD' : 'symbol' : '1.2-2' }}
                </span>
              </span>
              @if (record.amountInBs !== null) {
                <span class="flex items-center gap-1">
                  <ion-icon
                    name="swap-horizontal-outline"
                    class="text-[14px] text-emerald-400"
                  ></ion-icon>
                  <span class="text-emerald-400"
                    >Bs. {{ record.amountInBs | number: '1.2-2' }}</span
                  >
                </span>
              }
              <span class="account-badge" [class]="record.accountType">
                <ion-icon name="wallet-outline" class="text-[12px]"></ion-icon>
                {{ record.accountType | enumLabel }}
              </span>
              <span class="flex items-center gap-1">
                <ion-icon
                  name="pricetag-outline"
                  class="text-[14px]"
                ></ion-icon>
                {{ record.category | enumLabel }}
              </span>
              <span class="flex items-center gap-1">
                <ion-icon
                  name="calendar-outline"
                  class="text-[14px]"
                ></ion-icon>
                {{ record.date | date: 'dd/MM/yyyy' }}
              </span>
              @if (record.userName) {
                <span class="flex items-center gap-1">
                  <ion-icon
                    name="person-outline"
                    class="text-[14px]"
                  ></ion-icon>
                  {{ record.userName }}
                </span>
              }
            </div>
          </app-list-item>
        }
      </app-list-shell>
    }

    @if (activeTab() === 'recurring') {
      <div class="px-5 max-md:px-3.5 pb-5">
        @if (recurringLoading()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando gastos recurrentes...
          </div>
        } @else if (recurringExpenses().length === 0) {
          <div class="text-center py-8 text-(--app-text-muted)">
            <p class="text-lg font-semibold mb-1">
              No hay registros recurrentes
            </p>
            <p class="text-sm">
              Crea un registro con la opción recurrente desde el formulario de
              finanzas
            </p>
          </div>
        } @else {
          @for (expense of recurringExpenses(); track expense.id) {
            <div class="recurring-card">
              <div class="recurring-card-header">
                <span class="recurring-name">{{ expense.name }}</span>
                <span
                  class="recurring-badge"
                  [class.active]="expense.isActive"
                  [class.inactive]="!expense.isActive"
                >
                  {{ expense.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
              <div class="recurring-details">
                <span
                  [class.text-green-400]="expense.type === 'Income'"
                  [class.text-red-400]="expense.type === 'Expense'"
                  >{{ expense.type === 'Income' ? '+' : '-'
                  }}{{
                    expense.amount | currency: 'USD' : 'symbol' : '1.2-2'
                  }}</span
                >
                <span class="flex flex-col">
                  <span class="frequency-label">{{
                    frequencyLabel(expense.frequency)
                  }}</span>
                  @if (expense.frequency !== 'Daily') {
                    <span>Día {{ expense.dayOfMonth }}</span>
                  }
                </span>
                <span>{{
                  expense.accountType === 'Bolivares' ? 'Bolívares' : 'Dólares'
                }}</span>
                @if (expense.description) {
                  <span>{{ expense.description }}</span>
                }
              </div>
              <div class="recurring-actions">
                <a
                  [routerLink]="[
                    '/financial-records/recurring',
                    expense.id,
                    'edit',
                  ]"
                  class="rec-action-btn"
                  title="Editar"
                >
                  <ion-icon
                    name="create-outline"
                    class="text-[16px]"
                  ></ion-icon>
                </a>
                <button
                  class="rec-action-btn danger"
                  title="Eliminar"
                  (click)="deleteRecurring(expense.id)"
                >
                  <ion-icon name="trash-outline" class="text-[16px]"></ion-icon>
                </button>
              </div>
            </div>
          }
        }
      </div>
    }
  `,
})
export class FinancialRecordListComponent implements OnInit {
  readonly financialService = inject(FinancialRecordService);
  readonly recurringService = inject(RecurringExpenseService);
  readonly accountService = inject(AccountService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);
  private readonly modalController = inject(ModalController);

  readonly search = createListSearch(() => this.loadRecords());
  readonly usdRate = signal<number | null>(null);
  readonly activeTab = signal<'records' | 'recurring'>('records');
  readonly recurringLoading = signal(false);
  readonly recurringExpenses = signal<RecurringExpenseResponse[]>([]);

  constructor() {
    addIcons({
      walletOutline,
      trendingUpOutline,
      trendingDownOutline,
      swapHorizontalOutline,
      pricetagOutline,
      calendarOutline,
      personOutline,
      eyeOutline,
      createOutline,
      trashOutline,
    });
  }

  getDeleteMessage(description: string): string {
    return `¿Eliminar el registro "${description}"? Esta acción no se puede deshacer.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Finanzas');
    this.pageTitle.subtitle.set('Gestiona los ingresos y egresos');
    this.loadRecords();
    this.loadBalances();
    this.refreshService.refresh$.subscribe(() => {
      this.loadRecords();
      this.loadBalances();
      if (this.activeTab() === 'recurring') this.loadRecurring();
    });
  }

  private loadBalances() {
    this.accountService.getBalances().subscribe();
    this.exchangeRateService.getCurrentUsd().subscribe({
      next: (rate) => this.usdRate.set(rate.value),
      error: () => this.usdRate.set(null),
    });
  }

  private loadRecords() {
    this.financialService.loadAll(this.search.buildParams()).subscribe();
  }

  private loadRecurring() {
    this.recurringLoading.set(true);
    this.recurringService.loadAll().subscribe({
      next: (res) => {
        this.recurringExpenses.set(res.data ?? []);
        this.recurringLoading.set(false);
      },
      error: () => this.recurringLoading.set(false),
    });
  }

  switchToRecurring() {
    this.activeTab.set('recurring');
    this.loadRecurring();
  }

  async viewDetail(record: FinancialRecordResponse) {
    const modal = await this.modalController.create({
      component: FinancialRecordDetailModalComponent,
      componentProps: { record },
      cssClass: 'payment-modal',
    });
    await modal.present();
  }

  deleteRecord(id: number) {
    this.financialService
      .delete(id)
      .subscribe({ next: () => this.loadRecords() });
  }

  deleteRecurring(id: number) {
    if (!confirm('¿Eliminar este gasto recurrente?')) return;
    this.recurringService
      .delete(id)
      .subscribe({ next: () => this.loadRecurring() });
  }

  frequencyLabel(freq: string): string {
    const map: Record<string, string> = {
      Daily: 'Diario',
      Weekly: 'Semanal',
      Biweekly: 'Quincenal',
      Monthly: 'Mensual',
      Bimonthly: 'Bimestral',
      Quarterly: 'Trimestral',
      Yearly: 'Anual',
    };
    return map[freq] ?? freq;
  }
}
