import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  calendarOutline,
  cashOutline,
  documentTextOutline,
  pricetagOutline,
  swapHorizontalOutline,
  walletOutline,
  repeatOutline,
} from 'ionicons/icons';
import { FinancialRecordService } from '../../core/services/financial-record.service';
import { RecurringExpenseService } from '../../core/services/recurring-expense.service';
import { AccountService } from '../../core/services/account.service';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import {
  SelectFieldComponent,
  SelectOption,
} from '../../shared/components/select-field/select-field.component';
import { DateFieldComponent } from '../../shared/components/date-field/date-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';
import { ToggleFieldComponent } from '../../shared/components/toggle-field/toggle-field.component';
import {
  FinancialRecordType,
  FinancialCategory,
} from '../../core/models/financial-record.model';
import { AccountType } from '../../core/models/account.model';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';
import { RecurringExpenseFrequency } from '../../core/models/recurring-expense.model';
import { priceMask } from '../../shared/masks/price.mask';
import type { MaskitoOptions } from '@maskito/core';

@Component({
  selector: 'app-financial-record-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonIcon,
    TextInputComponent,
    SelectFieldComponent,
    DateFieldComponent,
    AuthButtonComponent,
    ToggleFieldComponent,
  ],
  styles: `
    :host {
      display: block;
      --card-bg: linear-gradient(
        180deg,
        rgba(30, 32, 52, 0.96),
        rgba(24, 25, 42, 0.96)
      );
    }
    .cancel-link {
      color: var(--app-text-muted);
      transition:
        color 0.2s ease,
        background-color 0.2s ease;
    }
    .cancel-link:hover {
      color: var(--app-text);
    }
  `,
  template: `
    <div class="p-5 max-md:p-3.5 text-(--app-text) box-border">
      <section class="mb-5">
        <div class="flex items-center gap-3 mb-1">
          <a
            routerLink="/financial-records"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {{ isEdit() ? 'Editar Registro' : 'Nuevo Registro' }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{
                isEdit()
                  ? 'Modifica el registro financiero'
                  : 'Registra un ingreso o egreso'
              }}
            </p>
          </div>
        </div>
      </section>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingRecord()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando datos del registro...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-select-field
              [control]="form.get('type')!"
              label="Tipo"
              icon="swap-horizontal-outline"
              placeholder="Selecciona el tipo"
              [options]="typeOptions"
            ></app-select-field>

            <app-select-field
              [control]="form.get('category')!"
              label="Categoría"
              icon="pricetag-outline"
              placeholder="Selecciona una categoría"
              [options]="categoryOptions"
            ></app-select-field>

            <app-select-field
              [control]="form.get('accountType')!"
              [label]="accountLabel()"
              icon="wallet-outline"
              placeholder="Selecciona la cuenta"
              [options]="accountTypeOptions()"
            ></app-select-field>

            <div class="flex items-center gap-2">
              <div class="flex-1 min-w-0">
                <app-text-input
                  [control]="
                    form.get(swapMode() === 'usd' ? 'amountUsd' : 'amountBs')!
                  "
                  [label]="swapMode() === 'usd' ? 'Dólares' : 'Bolívares'"
                  icon="cash-outline"
                  placeholder="0.00"
                  [mask]="priceMask"
                  [readonly]="false"
                ></app-text-input>
              </div>
              <div class="flex-1 min-w-0">
                <app-text-input
                  [control]="
                    form.get(swapMode() === 'usd' ? 'amountBs' : 'amountUsd')!
                  "
                  [label]="swapMode() === 'usd' ? 'Bolívares' : 'Dólares'"
                  icon="cash-outline"
                  placeholder="0.00"
                  [mask]="priceMask"
                  [readonly]="true"
                ></app-text-input>
              </div>
              <button
                type="button"
                (click)="toggleSwap()"
                class="flex items-center justify-center w-13 h-10 text-(--app-text-muted) hover:bg-[rgba(255,255,255,0.08)] active:scale-90 transition-all duration-200 cursor-pointer border-0 shrink-0"
                style="border-radius: 12px; overflow: hidden;"
                [title]="
                  swapMode() === 'usd'
                    ? 'Cambiar a Bs → USD'
                    : 'Cambiar a USD → Bs'
                "
                aria-label="Invertir dirección de conversión"
              >
                <ion-icon
                  name="swap-horizontal-outline"
                  class="text-[20px]"
                ></ion-icon>
              </button>
            </div>

            <app-text-input
              [control]="form.get('description')!"
              label="Descripción"
              icon="document-text-outline"
              placeholder="Describe el ingreso o egreso"
            ></app-text-input>

            <app-date-field
              [control]="form.get('date')!"
              label="Fecha"
              icon="calendar-outline"
            ></app-date-field>

            @if (showRecurringSection()) {
              <app-toggle-field
                [control]="form.get('isRecurring')!"
                label="¿Es recurrente?"
                icon="repeat-outline"
              ></app-toggle-field>

              @if (form.get('isRecurring')?.value) {
                <app-select-field
                  [control]="form.get('frequency')!"
                  label="Frecuencia"
                  icon="calendar-outline"
                  placeholder="Selecciona frecuencia"
                  [options]="frequencyOptions"
                ></app-select-field>

                @if (showDayField()) {
                  <app-text-input
                    [control]="form.get('dayOfMonth')!"
                    [label]="dayLabel()"
                    icon="calendar-outline"
                    placeholder="15"
                    type="number"
                  ></app-text-input>
                }
              }
            }

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-2">
              <app-auth-button
                [label]="isEdit() ? 'ACTUALIZAR REGISTRO' : 'CREAR REGISTRO'"
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/financial-records"
                class="inline-flex items-center justify-center h-13 px-6 border-2 border-(--app-border) text-(--app-text-muted) text-sm font-bold rounded-xl no-underline transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-(--app-text) cancel-link"
              >
                Cancelar
              </a>
            </div>
          </form>
        }
      </div>
    </div>
  `,
})
export class FinancialRecordFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly financialService = inject(FinancialRecordService);
  private readonly recurringService = inject(RecurringExpenseService);
  private readonly accountService = inject(AccountService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingRecord = signal(false);
  private recordId: number | null = null;

  readonly typeOptions: SelectOption[] = Object.values(FinancialRecordType).map(
    (t) => ({
      value: t,
      label: t === 'Income' ? 'Ingreso' : 'Egreso',
    }),
  );

  readonly categoryOptions: SelectOption[] = Object.values(
    FinancialCategory,
  ).map((c) => ({
    value: c,
    label: new EnumLabelPipe().transform(c),
  }));

  readonly usdRate = signal<number | null>(null);

  readonly accountTypeOptions = computed(() => {
    const balances = this.accountService.balances();
    const rate = this.usdRate();
    const bol = balances.find((b) => b.accountType === 'Bolivares');
    const dol = balances.find((b) => b.accountType === 'Dolares');

    const bolLabel = bol
      ? `Bolívares — Saldo Bs. ${bol.balance.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${rate ? ` (~$${(bol.balance / rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})` : ''}`
      : 'Bolívares';
    const dolLabel = dol
      ? `Dólares — Saldo $${dol.balance.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : 'Dólares';

    return [
      { value: 'Bolivares', label: bolLabel },
      { value: 'Dolares', label: dolLabel },
    ] as SelectOption[];
  });

  readonly frequencyOptions: SelectOption[] = [
    { value: 'Daily', label: 'Diario' },
    { value: 'Weekly', label: 'Semanal' },
    { value: 'Biweekly', label: 'Quincenal' },
    { value: 'Monthly', label: 'Mensual' },
    { value: 'Bimonthly', label: 'Bimestral' },
    { value: 'Quarterly', label: 'Trimestral' },
    { value: 'Yearly', label: 'Anual' },
  ];

  readonly accountLabel = computed(() => {
    const type = this.form.get('type')?.value;
    return type === 'Expense'
      ? '¿De qué cuenta se descuenta?'
      : '¿En qué cuenta se registra?';
  });

  readonly showRecurringSection = computed(() => !this.isEdit());

  readonly showDayField = computed(() => {
    const freq = this.form.get('frequency')?.value;
    return freq !== 'Daily';
  });

  readonly dayLabel = computed(() => {
    const freq = this.form.get('frequency')?.value;
    if (freq === 'Weekly') return 'Día de la semana (1=Lun..7=Dom)';
    return 'Día del mes';
  });

  readonly swapMode = signal<'usd' | 'bs'>('usd');
  readonly priceMask = priceMask;

  form = this.fb.group({
    type: ['', Validators.required],
    category: ['', Validators.required],
    accountType: ['', Validators.required],
    amountUsd: ['0.00', Validators.required],
    amountBs: [{ value: '0.00', disabled: true }, Validators.required],
    description: ['', Validators.required],
    date: [this.todayString(), Validators.required],
    isRecurring: [false],
    frequency: ['Monthly'],
    dayOfMonth: [15],
  });

  constructor() {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      calendarOutline,
      cashOutline,
      documentTextOutline,
      pricetagOutline,
      swapHorizontalOutline,
      walletOutline,
      repeatOutline,
    });

    this.form.get('frequency')?.valueChanges.subscribe((freq) => {
      const dayControl = this.form.get('dayOfMonth');
      if (!dayControl) return;
      const max = freq === 'Weekly' ? 7 : 31;
      dayControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(max),
      ]);
      if (dayControl.value && dayControl.value > max) {
        dayControl.setValue(max);
      }
      dayControl.updateValueAndValidity();
    });

    this.form.get('amountUsd')?.valueChanges.subscribe((val) => {
      if (this.swapMode() !== 'usd') return;
      const rate = this.usdRate();
      if (!rate) return;
      const usd = parseFloat(
        String(val).replace?.(/\./g, '').replace(',', '.') ?? '0',
      );
      if (usd > 0) {
        this.form.get('amountBs')?.setValue(
          (usd * rate).toLocaleString('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          { emitEvent: false },
        );
      }
    });

    this.form.get('amountBs')?.valueChanges.subscribe((val) => {
      if (this.swapMode() !== 'bs') return;
      const rate = this.usdRate();
      if (!rate) return;
      const bs = parseFloat(
        String(val).replace?.(/\./g, '').replace(',', '.') ?? '0',
      );
      if (bs > 0) {
        this.form.get('amountUsd')?.setValue(
          (bs / rate).toLocaleString('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          { emitEvent: false },
        );
      }
    });
  }

  toggleSwap() {
    const rate = this.usdRate();
    if (!rate) return;

    if (this.swapMode() === 'usd') {
      this.swapMode.set('bs');
      this.form.get('amountUsd')?.disable({ emitEvent: false });
      this.form.get('amountBs')?.enable({ emitEvent: false });
    } else {
      this.swapMode.set('usd');
      this.form.get('amountUsd')?.enable({ emitEvent: false });
      this.form.get('amountBs')?.disable({ emitEvent: false });
    }
  }

  private todayString(): string {
    const d = new Date();
    return d.toISOString().substring(0, 10);
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.recordId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Registro');
      this.pageTitle.subtitle.set('Modifica el registro financiero');
      this.loadRecord();
    } else {
      this.pageTitle.title.set('Nuevo Registro');
      this.pageTitle.subtitle.set('Registra un ingreso o egreso');
    }
    this.accountService.getBalances().subscribe();
    this.exchangeRateService.getCurrentUsd().subscribe({
      next: (res) => this.usdRate.set(res.value),
    });
  }

  private loadRecord() {
    if (!this.recordId) return;
    this.loadingRecord.set(true);
    this.financialService.getById(this.recordId).subscribe({
      next: (record) => {
        const usd = record.amount;
        const bs =
          record.amountInBs ?? (this.usdRate() ? usd * this.usdRate()! : usd);
        this.form.patchValue({
          type: record.type,
          category: record.category,
          accountType: record.accountType,
          amountUsd: usd.toFixed(2),
          amountBs: bs.toFixed(2),
          description: record.description,
          date: record.date.substring(0, 10),
        });
        this.loadingRecord.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loadingRecord.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    // Re-enable controls so values are included in form.value
    this.form.get('amountUsd')?.enable({ emitEvent: false });
    this.form.get('amountBs')?.enable({ emitEvent: false });

    const formVal = this.form.value;
    const accountType = formVal.accountType as AccountType;
    const rawUsd = parseFloat(
      String(formVal.amountUsd ?? '0')
        .replace?.(/\./g, '')
        .replace(',', '.') ?? '0',
    );
    const rawBs = parseFloat(
      String(formVal.amountBs ?? '0')
        .replace?.(/\./g, '')
        .replace(',', '.') ?? '0',
    );
    const amount = rawUsd || 0;
    const rate = this.usdRate();
    const isBolivares = accountType === 'Bolivares';
    const amountInBs = isBolivares
      ? rawBs || (rate ? amount * rate : amount)
      : undefined;
    const exchangeRateValue = isBolivares ? (rate ?? undefined) : undefined;

    const recordRequest = {
      type: formVal.type as FinancialRecordType,
      category: formVal.category as FinancialCategory,
      accountType,
      amount,
      amountInBs,
      exchangeRateValue,
      description: formVal.description!,
      date: formVal.date!,
      userId: 1,
    };

    const saveRecord =
      this.isEdit() && this.recordId
        ? this.financialService.update(this.recordId, recordRequest)
        : this.financialService.create(recordRequest);

    saveRecord.subscribe({
      next: (res) => {
        if (this.form.value.isRecurring && !this.isEdit()) {
          const recurringPayload = {
            name: `[${recordRequest.category}] ${recordRequest.description}`,
            amount,
            frequency: this.form.value.frequency as RecurringExpenseFrequency,
            dayOfMonth: this.form.value.dayOfMonth ?? 15,
            accountType: recordRequest.accountType,
            type: recordRequest.type,
            description: recordRequest.description,
          };
          this.recurringService.create(recurringPayload).subscribe({
            next: () => this.router.navigate(['/financial-records']),
            error: () => this.router.navigate(['/financial-records']),
            complete: () => this.submitting.set(false),
          });
        } else {
          this.router.navigate(['/financial-records']);
          this.submitting.set(false);
        }
      },
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
      complete: () => {
        if (!this.form.value.isRecurring || this.isEdit()) {
          this.submitting.set(false);
        }
      },
    });
  }
}
