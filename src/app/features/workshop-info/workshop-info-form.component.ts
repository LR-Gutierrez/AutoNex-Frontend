import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  businessOutline,
  mapOutline,
  callOutline,
  phonePortraitOutline,
  mailOutline,
  saveOutline,
  globeOutline,
  timeOutline,
  locationOutline,
  documentTextOutline,
} from 'ionicons/icons';
import { WorkshopInfoService } from '../../core/services/workshop-info.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';
import type { MaskitoOptions } from '@maskito/core';
import { rifMask } from '../../shared/masks/rif.mask';

@Component({
  selector: 'app-workshop-info-form',
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
            routerLink="/dashboard"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              Configuración del Taller
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              Información de la empresa que aparecerá en las plantillas de
              mensajes
            </p>
          </div>
        </div>
      </section>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingInfo()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando información del taller...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-text-input
              [control]="form.get('businessName')!"
              label="Nombre o Razón Social"
              icon="business-outline"
              placeholder="Ej: AutoNex C.A."
            ></app-text-input>

            <app-text-input
              [control]="form.get('rif')!"
              label="RIF"
              icon="document-text-outline"
              [mask]="rifMask"
              placeholder="Ej: J-12345678-9"
            ></app-text-input>

            <app-text-input
              [control]="form.get('address')!"
              label="Dirección"
              icon="map-outline"
              placeholder="Dirección del taller"
            ></app-text-input>

            <app-text-input
              [control]="form.get('city')!"
              label="Ciudad"
              icon="location-outline"
              placeholder="Ej: Caracas"
            ></app-text-input>

            <app-text-input
              [control]="form.get('mapsUrl')!"
              label="Enlace Google Maps"
              icon="map-outline"
              placeholder="https://maps.google.com/..."
            ></app-text-input>

            <app-text-input
              [control]="form.get('phone')!"
              label="Teléfono principal"
              icon="call-outline"
              [mask]="phoneMask"
              placeholder="(0412) 123-4567"
            ></app-text-input>

            <app-text-input
              [control]="form.get('secondaryPhone')!"
              label="Teléfono secundario"
              icon="phone-portrait-outline"
              [mask]="phoneMask"
              placeholder="(0414) 765-4321"
            ></app-text-input>

            <app-text-input
              [control]="form.get('email')!"
              label="Correo electrónico"
              icon="mail-outline"
              placeholder="Ej: contacto@autonex.com"
            ></app-text-input>

            <app-text-input
              [control]="form.get('website')!"
              label="Sitio web"
              icon="globe-outline"
              placeholder="https://autonex.com"
            ></app-text-input>

            <app-text-input
              [control]="form.get('openingHours')!"
              label="Horario de atención"
              icon="time-outline"
              placeholder="Ej: Lun-Vie 8:00am - 5:00pm"
            ></app-text-input>

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-2">
              <app-auth-button
                label="GUARDAR CONFIGURACIÓN"
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/dashboard"
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
export class WorkshopInfoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly workshopInfoService = inject(WorkshopInfoService);
  private readonly pageTitle = inject(PageTitleService);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingInfo = signal(false);
  private readonly saveSuccess = signal(false);

  readonly rifMask = rifMask;

  readonly phoneMask: MaskitoOptions = {
    mask: [
      '(',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  };

  form = this.fb.group({
    businessName: ['', Validators.required],
    rif: [''],
    address: [''],
    city: [''],
    mapsUrl: [''],
    phone: [''],
    secondaryPhone: [''],
    email: [''],
    website: [''],
    openingHours: [''],
  });

  constructor() {
    addIcons({
      arrowBackOutline,
      businessOutline,
      mapOutline,
      callOutline,
      phonePortraitOutline,
      mailOutline,
      saveOutline,
      globeOutline,
      timeOutline,
      locationOutline,
      documentTextOutline,
    });
  }

  ngOnInit() {
    this.pageTitle.title.set('Configuración del Taller');
    this.pageTitle.subtitle.set('Información de la empresa');
    this.loadInfo();
  }

  private loadInfo() {
    this.loadingInfo.set(true);
    this.workshopInfoService.get().subscribe({
      next: (info) => {
        this.form.patchValue({
          businessName: info.businessName,
          rif: info.rif ?? '',
          address: info.address ?? '',
          city: info.city ?? '',
          mapsUrl: info.mapsUrl ?? '',
          phone: info.phone ?? '',
          secondaryPhone: info.secondaryPhone ?? '',
          email: info.email ?? '',
          website: info.website ?? '',
          openingHours: info.openingHours ?? '',
        });
        this.loadingInfo.set(false);
      },
      error: () => {
        this.loadingInfo.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    const request = {
      businessName: this.form.value.businessName!,
      rif: this.form.value.rif || undefined,
      address: this.form.value.address || undefined,
      city: this.form.value.city || undefined,
      mapsUrl: this.form.value.mapsUrl || undefined,
      phone: this.form.value.phone || undefined,
      secondaryPhone: this.form.value.secondaryPhone || undefined,
      email: this.form.value.email || undefined,
      website: this.form.value.website || undefined,
      openingHours: this.form.value.openingHours || undefined,
    };

    this.workshopInfoService.upsert(request).subscribe({
      next: () => {
        this.saveSuccess.set(true);
        this.submitting.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
    });
  }
}
