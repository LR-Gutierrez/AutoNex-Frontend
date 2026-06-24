import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, informationCircleOutline, documentTextOutline, createOutline } from 'ionicons/icons';
import { MessageTemplateService } from '../../core/services/message-template.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { TextareaFieldComponent } from '../../shared/components/textarea-field/textarea-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';

@Component({
  selector: 'app-message-template-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonIcon,
    TextInputComponent,
    TextareaFieldComponent,
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
    .placeholder-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 2px 8px;
      font-size: 11px;
      font-family: monospace;
      color: var(--app-text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .placeholder-badge:hover {
      background: rgba(255, 255, 255, 0.12);
      color: var(--app-text);
    }
  `,
  template: `
    <div class="p-5 max-md:p-3.5 text-(--app-text) box-border">
      <section class="mb-5">
        <div class="flex items-center gap-3 mb-1">
          <a
            routerLink="/message-templates"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {{ isEdit() ? 'Editar Plantilla' : 'Nueva Plantilla' }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{
                isEdit()
                  ? 'Modifica el contenido de la plantilla'
                  : 'Crea una nueva plantilla de mensaje'
              }}
            </p>
          </div>
        </div>
      </section>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingTemplate()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando plantilla...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-text-input
              [control]="form.get('key')!"
              label="Clave"
              icon="document-text-outline"
              placeholder="Ej: mileage_alert_reminder"
            ></app-text-input>

            <app-text-input
              [control]="form.get('description')!"
              label="Descripción"
              icon="information-circle-outline"
              placeholder="Breve descripción de la plantilla"
            ></app-text-input>

            <div class="mb-3">
              <label class="block text-[13px] font-semibold text-(--app-text-muted) mb-2 tracking-wide">
                Placeholders disponibles
              </label>
              <div class="flex flex-wrap gap-2">
                @for (ph of placeholders; track ph.key) {
                  <span
                    class="placeholder-badge"
                    [title]="'Insertar ' + ph.key"
                    (click)="insertPlaceholder(ph.key)"
                  >
                    {{ ph.key }}
                  </span>
                }
              </div>
            </div>

            <app-textarea-field
              [control]="form.get('template')!"
              label="Plantilla del mensaje"
              icon="create-outline"
              placeholder="Escribe el mensaje usando los placeholders disponibles..."
              [rows]="6"
            ></app-textarea-field>

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-2">
              <app-auth-button
                [label]="isEdit() ? 'ACTUALIZAR PLANTILLA' : 'CREAR PLANTILLA'"
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/message-templates"
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
export class MessageTemplateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly templateService = inject(MessageTemplateService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingTemplate = signal(false);
  private templateId: number | null = null;

  readonly placeholders = [
    { key: '{VehicleInfo}', desc: 'Marca Modelo (Placa)' },
    { key: '{Brand}', desc: 'Marca del vehículo' },
    { key: '{Model}', desc: 'Modelo del vehículo' },
    { key: '{LicensePlate}', desc: 'Placa del vehículo' },
    { key: '{CurrentKm}', desc: 'Kilometraje actual' },
    { key: '{NextAlertKm}', desc: 'Kilometraje de próxima alerta' },
    { key: '{EstimatedWeeklyKm}', desc: 'Kilómetros semanales estimados' },
    { key: '{ClientName}', desc: 'Nombre del cliente' },
    { key: '{ServiceName}', desc: 'Nombre del servicio de la alerta' },
    { key: '{WorkshopName}', desc: 'Nombre o razón social del taller' },
    { key: '{WorkshopRif}', desc: 'RIF del taller' },
    { key: '{WorkshopAddress}', desc: 'Dirección del taller' },
    { key: '{WorkshopCity}', desc: 'Ciudad del taller' },
    { key: '{WorkshopMapsUrl}', desc: 'Enlace Google Maps del taller' },
    { key: '{WorkshopPhone}', desc: 'Teléfono principal del taller' },
    { key: '{WorkshopSecondaryPhone}', desc: 'Teléfono secundario del taller' },
    { key: '{WorkshopEmail}', desc: 'Correo electrónico del taller' },
    { key: '{WorkshopWebsite}', desc: 'Sitio web del taller' },
    { key: '{WorkshopHours}', desc: 'Horario de atención del taller' },
  ];

  form = this.fb.group({
    key: ['', Validators.required],
    description: [''],
    template: ['', Validators.required],
  });

  constructor() {
    addIcons({ arrowBackOutline, informationCircleOutline, documentTextOutline, createOutline });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.templateId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Plantilla');
      this.pageTitle.subtitle.set('Modifica el contenido de la plantilla');
      this.loadTemplate();
    } else {
      this.pageTitle.title.set('Nueva Plantilla');
      this.pageTitle.subtitle.set('Crea una nueva plantilla de mensaje');
    }
  }

  private loadTemplate() {
    if (!this.templateId) return;
    this.loadingTemplate.set(true);
    this.templateService.getById(this.templateId).subscribe({
      next: (template) => {
        this.form.patchValue({
          key: template.key,
          description: template.description ?? '',
          template: template.template,
        });
        this.form.get('key')?.disable();
        this.loadingTemplate.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loadingTemplate.set(false);
      },
    });
  }

  insertPlaceholder(key: string) {
    const control = this.form.get('template');
    if (!control) return;
    const start = control.value?.length ?? 0;
    const current = control.value ?? '';
    control.setValue(current + key);
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    const request = {
      key: this.form.getRawValue().key!,
      template: this.form.value.template!,
      description: this.form.value.description || undefined,
    };

    const action =
      this.isEdit() && this.templateId
        ? this.templateService.update(this.templateId, { template: request.template, description: request.description })
        : this.templateService.create(request);

    action.subscribe({
      next: () => this.router.navigate(['/message-templates']),
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
