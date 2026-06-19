import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline, cashOutline } from 'ionicons/icons';
import { getExchangeRateStatusLabel } from '../../core/models/exchange-rate.model';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { DateFieldComponent } from '../../shared/components/date-field/date-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';
import { priceMask } from '../../shared/masks/price.mask';

@Component({
  selector: 'app-exchange-rate-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonIcon,
    TextInputComponent,
    DateFieldComponent,
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
            routerLink="/exchange-rates"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {{ isEdit() ? 'Editar Boletín' : 'Nuevo Boletín' }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{
                isEdit()
                  ? 'Modifica el boletín de tasa de cambio'
                  : 'Registra un nuevo boletín de tasa de cambio'
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
            Cargando datos del boletín...
          </div>
        } @else if (isEdit() && canEdit === false) {
          <div class="text-center py-8">
            <div class="text-4xl mb-3">🔒</div>
            <p class="text-(--app-text-muted) text-sm font-medium mb-1">
              Este boletín no se puede editar.
            </p>
            <p class="text-(--app-text-muted) text-xs opacity-70">
              {{ editBlockReason }}
            </p>
            <a
              routerLink="/exchange-rates"
              class="inline-flex items-center justify-center mt-4 h-11 px-5 border border-(--app-border) text-(--app-text-muted) text-sm font-bold rounded-xl no-underline transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-(--app-text)"
            >
              Volver al listado
            </a>
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-date-field
              [control]="form.get('valueDate')!"
              label="Fecha de la Tasa"
              icon="calendar-outline"
            ></app-date-field>

            <app-text-input
              [control]="form.get('observations')!"
              label="Observaciones"
              icon="cash-outline"
              placeholder="Opcional"
            ></app-text-input>

            <app-text-input
              [control]="form.get('rateValue')!"
              label="Tasa USD (Bs.)"
              icon="cash-outline"
              placeholder="0.00"
              [mask]="priceMask"
            ></app-text-input>

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-2">
              <app-auth-button
                [label]="isEdit() ? 'ACTUALIZAR BOLETÍN' : 'CREAR BOLETÍN'"
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/exchange-rates"
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
export class ExchangeRateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingRecord = signal(false);
  protected canEdit = true;
  protected editBlockReason = '';
  private rateId: number | null = null;

  readonly priceMask = priceMask;

  form = this.fb.group({
    valueDate: [this.todayString(), Validators.required],
    observations: [''],
    rateValue: ['', Validators.required],
  });

  constructor() {
    addIcons({ arrowBackOutline, calendarOutline, cashOutline });
  }

  private todayString(): string {
    const d = new Date();
    return d.toISOString().substring(0, 10);
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.rateId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Boletín de Tasa');
      this.pageTitle.subtitle.set('Modifica el boletín de tasa de cambio');
      this.loadRecord();
    } else {
      this.pageTitle.title.set('Nuevo Boletín de Tasa');
      this.pageTitle.subtitle.set('Registra un nuevo boletín de tasa de cambio');
    }
  }

  private loadRecord() {
    if (!this.rateId) return;
    this.loadingRecord.set(true);
    this.exchangeRateService.getById(this.rateId).subscribe({
      next: (pub) => {
        if (pub.isActive === false) {
          this.canEdit = false;
          this.editBlockReason = 'El boletín está inactivo. Solo los boletines en estado "Borrador" pueden editarse.';
        } else if (pub.status !== 1) {
          this.canEdit = false;
          const label = getExchangeRateStatusLabel(pub.status);
          this.editBlockReason = `El boletín está en estado "${label}". Solo los boletines en estado "Borrador" pueden editarse.`;
        } else {
          this.canEdit = true;
          const usdRate = pub.exchangeRates.find(r => r.currencyCode === 'USD');
          this.form.patchValue({
            valueDate: pub.valueDate.substring(0, 10),
            observations: pub.observations,
            rateValue: usdRate?.value.toFixed(2) ?? '',
          });
        }
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

    const rawRate = this.form.value.rateValue!;
    const rate = parseFloat(String(rawRate).replace?.(/\./g, '').replace(',', '.') ?? rawRate);

    const valueDate = this.form.value.valueDate!;

    const action$ = this.isEdit() && this.rateId
      ? this.exchangeRateService.update(this.rateId, { valueDate, observations: this.form.value.observations ?? '', rates: [{ currencyId: 1, value: rate }] })
      : this.exchangeRateService.create({ publishedAt: new Date().toISOString(), valueDate, observations: this.form.value.observations ?? '', rates: [{ currencyId: 1, value: rate }] });

    action$.subscribe({
      next: () => this.router.navigate(['/exchange-rates']),
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
