import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { FinancialRecordService } from '../../core/services/financial-record.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { SelectFieldComponent, SelectOption } from '../../shared/components/select-field/select-field.component';
import { DateFieldComponent } from '../../shared/components/date-field/date-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';
import {
  FinancialRecordType,
  FinancialCategory,
} from '../../core/models/financial-record.model';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';
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
    EnumLabelPipe,
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

            <app-text-input
              [control]="form.get('amount')!"
              label="Monto"
              icon="cash-outline"
              placeholder="0.00"
              [mask]="priceMask"
            ></app-text-input>

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
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingRecord = signal(false);
  private recordId: number | null = null;

  readonly typeOptions: SelectOption[] = Object.values(FinancialRecordType).map(
    t => ({
      value: t,
      label: t === 'Income' ? 'Ingreso' : 'Egreso',
    }),
  );

  readonly categoryOptions: SelectOption[] = Object.values(FinancialCategory).map(
    c => ({
      value: c,
      label: new EnumLabelPipe().transform(c),
    }),
  );

  readonly priceMask: MaskitoOptions = priceMask;

  form = this.fb.group({
    type: ['', Validators.required],
    category: ['', Validators.required],
    amount: ['0.00', Validators.required],
    description: ['', Validators.required],
    date: [this.todayString(), Validators.required],
  });

  constructor() {
    addIcons(allIcons);
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
  }

  private loadRecord() {
    if (!this.recordId) return;
    this.loadingRecord.set(true);
    this.financialService.getById(this.recordId).subscribe({
      next: (record) => {
        this.form.patchValue({
          type: record.type,
          category: record.category,
          amount: record.amount.toFixed(2),
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

    const rawAmount = this.form.value.amount!;
    const amount = parseFloat(rawAmount.replace?.(/,/g, '') ?? rawAmount);

    const request = {
      type: this.form.value.type as FinancialRecordType,
      category: this.form.value.category as FinancialCategory,
      amount,
      description: this.form.value.description!,
      date: this.form.value.date!,
      userId: 1,
    };

    const action =
      this.isEdit() && this.recordId
        ? this.financialService.update(this.recordId, request)
        : this.financialService.create(request);

    action.subscribe({
      next: () => this.router.navigate(['/financial-records']),
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
