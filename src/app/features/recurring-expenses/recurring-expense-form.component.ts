import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, swapHorizontalOutline } from 'ionicons/icons';
import { RecurringExpenseService } from '../../core/services/recurring-expense.service';
import { RecurringExpenseFrequency } from '../../core/models/recurring-expense.model';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { SelectFieldComponent, SelectOption } from '../../shared/components/select-field/select-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';
import { priceMask } from '../../shared/masks/price.mask';

@Component({
  selector: 'app-recurring-expense-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonIcon,
    TextInputComponent,
    SelectFieldComponent,
    AuthButtonComponent,
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
      transition: color 0.2s ease, background-color 0.2s ease;
    }
    .cancel-link:hover {
      color: var(--app-text);
    }
  `,
  template: `
    <div class="p-5 max-md:p-3.5 text-(--app-text) box-border">
      <div class="flex items-center gap-3 mb-5">
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
            {{ isEdit() ? 'Editar Gasto Recurrente' : 'Nuevo Gasto Recurrente' }}
          </h1>
          <p class="mt-1.5 text-(--app-text-muted) text-sm">
            {{ isEdit() ? 'Modifica el gasto recurrente' : 'Registra un nuevo gasto recurrente' }}
          </p>
        </div>
      </div>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingExpense()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-text-input
              [control]="form.get('name')!"
              label="Nombre del gasto"
              icon="document-text-outline"
              placeholder="Ej: Alquiler, Luz, Agua"
            ></app-text-input>

            <app-text-input
              [control]="form.get('amount')!"
              label="Monto en USD"
              icon="cash-outline"
              placeholder="0.00"
              [mask]="priceMask"
            ></app-text-input>

            <app-select-field
              [control]="form.get('type')!"
              label="Tipo"
              icon="swap-horizontal-outline"
              placeholder="Selecciona tipo"
              [options]="[
                { value: 'Expense', label: 'Egreso' },
                { value: 'Income', label: 'Ingreso' },
              ]"
            ></app-select-field>

            <app-select-field
              [control]="form.get('frequency')!"
              label="Frecuencia"
              icon="calendar-outline"
              placeholder="Selecciona frecuencia"
              [options]="frequencyOptions"
            ></app-select-field>

            <app-text-input
              [control]="form.get('dayOfMonth')!"
              label="Día del mes"
              icon="calendar-outline"
              placeholder="15"
              type="number"
            ></app-text-input>

            <app-select-field
              [control]="form.get('accountType')!"
              label="Tipo de cuenta"
              icon="cash-outline"
              placeholder="Selecciona cuenta"
              [options]="accountTypeOptions"
            ></app-select-field>

            <app-text-input
              [control]="form.get('description')!"
              label="Descripción (opcional)"
              icon="document-text-outline"
              placeholder="Notas adicionales"
            ></app-text-input>

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mt-4 mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-5">
              <app-auth-button
                [label]="isEdit() ? 'ACTUALIZAR' : 'CREAR'"
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
export class RecurringExpenseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(RecurringExpenseService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly loadingExpense = signal(false);
  readonly error = signal<string | null>(null);
  private expenseId: number | null = null;

  readonly priceMask = priceMask;

  readonly frequencyOptions: SelectOption[] = [
    { value: 'Daily', label: 'Diario' },
    { value: 'Weekly', label: 'Semanal' },
    { value: 'Biweekly', label: 'Quincenal' },
    { value: 'Monthly', label: 'Mensual' },
    { value: 'Bimonthly', label: 'Bimestral' },
    { value: 'Quarterly', label: 'Trimestral' },
    { value: 'Yearly', label: 'Anual' },
  ];

  readonly accountTypeOptions: SelectOption[] = [
    { value: 'Bolivares', label: 'Bolívares' },
    { value: 'Dolares', label: 'Dólares' },
  ];

  readonly dayLabel = computed(() => {
    const freq = this.form.get('frequency')?.value;
    if (freq === 'Daily') return '';
    if (freq === 'Weekly') return 'Día de la semana (1=Lun..7=Dom)';
    return 'Día del mes';
  });

  readonly showDayField = computed(() => {
    const freq = this.form.get('frequency')?.value;
    return freq !== 'Daily';
  });

  readonly dayMax = computed(() => {
    const freq = this.form.get('frequency')?.value;
    if (freq === 'Weekly') return 7;
    return 31;
  });

  form = this.fb.group({
    name: ['', Validators.required],
    amount: ['0.00', Validators.required],
    type: ['Expense', Validators.required],
    frequency: ['Monthly', Validators.required],
    dayOfMonth: [15, [Validators.required, Validators.min(1), Validators.max(31)]],
    accountType: ['Bolivares', Validators.required],
    description: [''],
  });

  constructor() {
    addIcons({ arrowBackOutline, swapHorizontalOutline });

    this.form.get('frequency')?.valueChanges.subscribe((freq) => {
      const dayControl = this.form.get('dayOfMonth');
      if (!dayControl) return;
      const max = freq === 'Weekly' ? 7 : 31;
      dayControl.setValidators([Validators.required, Validators.min(1), Validators.max(max)]);
      if (dayControl.value && dayControl.value > max) {
        dayControl.setValue(max);
      }
      dayControl.updateValueAndValidity();
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.expenseId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Gasto Recurrente');
      this.pageTitle.subtitle.set('Modifica el gasto recurrente');
      this.loadExpense();
    } else {
      this.pageTitle.title.set('Nuevo Gasto Recurrente');
      this.pageTitle.subtitle.set('Registra un nuevo gasto recurrente');
    }
  }

  private loadExpense() {
    if (!this.expenseId) return;
    this.loadingExpense.set(true);
    this.service.getById(this.expenseId).subscribe({
      next: (res) => {
        const e = res.data!;
        this.form.patchValue({
          name: e.name,
          amount: e.amount.toFixed(2),
          type: e.type,
          frequency: e.frequency,
          dayOfMonth: e.dayOfMonth,
          accountType: e.accountType,
          description: e.description ?? '',
        });
        this.loadingExpense.set(false);
      },
      error: () => this.loadingExpense.set(false),
    });
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    const rawAmount = String(this.form.value.amount ?? '0');
    const amount = parseFloat(
      rawAmount.includes(',')
        ? rawAmount.replace(/\./g, '').replace(',', '.')
        : rawAmount,
    );

    const payload = {
      name: this.form.value.name!,
      amount,
      frequency: this.form.value.frequency as RecurringExpenseFrequency,
      dayOfMonth: this.form.value.dayOfMonth!,
      accountType: this.form.value.accountType! as 'Bolivares' | 'Dolares',
      type: this.form.value.type! as 'Income' | 'Expense',
      description: this.form.value.description || undefined,
    };

    const action =
      this.isEdit() && this.expenseId
        ? this.service.update(this.expenseId, { ...payload, isActive: true })
        : this.service.create(payload);

    action.subscribe({
      next: () => this.router.navigate(['/financial-records']),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al guardar');
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
