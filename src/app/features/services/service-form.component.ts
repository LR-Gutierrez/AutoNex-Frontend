import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import type { MaskitoOptions } from '@maskito/core';
import { priceMask } from '../../shared/masks/price.mask';
import { ServiceService } from '../../core/services/service.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonIcon,
    TextInputComponent,
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
            routerLink="/services"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {{ isEdit() ? 'Editar Servicio' : 'Nuevo Servicio' }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{
                isEdit()
                  ? 'Modifica los datos del servicio'
                  : 'Registra un nuevo servicio en el catálogo'
              }}
            </p>
          </div>
        </div>
      </section>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingService()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando datos del servicio...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-text-input
              [control]="form.get('name')!"
              label="Nombre del servicio"
              icon="construct-outline"
              placeholder="Nombre del servicio"
            ></app-text-input>

            <app-text-input
              [control]="form.get('description')!"
              label="Descripción"
              icon="information-circle-outline"
              placeholder="Breve descripción del servicio"
            ></app-text-input>

            <app-text-input
              [control]="form.get('defaultPrice')!"
              label="Precio predeterminado ($)"
              icon="pricetag-outline"
              [mask]="priceMask"
              placeholder="0.00"
            ></app-text-input>

            <div class="grid grid-cols-2 gap-3">
              <app-text-input
                [control]="form.get('minKmInterval')!"
                label="Km mínimo (opcional)"
                icon="arrow-back-outline"
                [mask]="kmMask"
                placeholder="0"
              ></app-text-input>
              <app-text-input
                [control]="form.get('maxKmInterval')!"
                label="Km máximo (opcional)"
                icon="arrow-forward-outline"
                [mask]="kmMask"
                placeholder="Ej: 10,000"
              ></app-text-input>
            </div>

            <app-text-input
              [control]="form.get('recommendedMonths')!"
              label="Intervalo en meses (opcional)"
              icon="calendar-outline"
              [mask]="kmMask"
              placeholder="Ej: 6"
            ></app-text-input>

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-2">
              <app-auth-button
                [label]="isEdit() ? 'ACTUALIZAR SERVICIO' : 'CREAR SERVICIO'"
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/services"
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
export class ServiceFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly serviceService = inject(ServiceService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingService = signal(false);
  private serviceId: number | null = null;

  readonly kmMask: MaskitoOptions = {
    mask: ({ value }) => {
      const digits = value.replace(/,/g, '');
      const result: Array<RegExp | string> = [];
      for (let i = 0; i < digits.length; i++) {
        const fromRight = digits.length - i;
        if (i > 0 && fromRight % 3 === 0) result.push(',');
        result.push(/\d/);
      }
      return result;
    },
    preprocessors: [
      ({ elementState, data }) => ({
        elementState,
        data: data.replace(/\D/g, ''),
      }),
    ],
  };

  readonly priceMask = priceMask;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    defaultPrice: ['', Validators.required],
    minKmInterval: [''],
    maxKmInterval: [''],
    recommendedMonths: [''],
  });

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.serviceId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Servicio');
      this.pageTitle.subtitle.set('Modifica los datos del servicio');
      this.loadService();
    } else {
      this.pageTitle.title.set('Nuevo Servicio');
      this.pageTitle.subtitle.set('Registra un nuevo servicio en el catálogo');
    }
  }

  private loadService() {
    if (!this.serviceId) return;
    this.loadingService.set(true);
    this.serviceService.getById(this.serviceId).subscribe({
      next: (service) => {
        const formatNum = (n: number) => Math.floor(n).toLocaleString('en-US');
        this.form.patchValue({
          name: service.name,
          description: service.description ?? '',
          defaultPrice: service.defaultPrice.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          minKmInterval: service.minKmInterval != null
            ? formatNum(service.minKmInterval)
            : '',
          maxKmInterval: service.maxKmInterval != null
            ? formatNum(service.maxKmInterval)
            : '',
          recommendedMonths: service.recommendedMonths != null
            ? formatNum(service.recommendedMonths)
            : '',
        });
        this.loadingService.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loadingService.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    const parseNum = (s: string) => parseFloat(s.replace(/,/g, ''));
    const request = {
      name: this.form.value.name!,
      description: this.form.value.description || undefined,
      defaultPrice: parseNum(this.form.value.defaultPrice!),
      minKmInterval: this.form.value.minKmInterval !== ''
        ? parseNum(this.form.value.minKmInterval!)
        : undefined,
      maxKmInterval: this.form.value.maxKmInterval !== ''
        ? parseNum(this.form.value.maxKmInterval!)
        : undefined,
      recommendedMonths: this.form.value.recommendedMonths !== ''
        ? parseNum(this.form.value.recommendedMonths!)
        : undefined,
    };

    const action =
      this.isEdit() && this.serviceId
        ? this.serviceService.update(this.serviceId, request)
        : this.serviceService.create(request);

    action.subscribe({
      next: () => this.router.navigate(['/services']),
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
