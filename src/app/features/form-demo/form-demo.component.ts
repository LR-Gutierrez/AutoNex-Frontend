import { Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { MaskitoOptions } from '@maskito/core';

import { emailValidator } from '../../shared/validators/email.validators';
import { passwordValidator } from '../../shared/validators/password.validator';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { SelectFieldComponent } from '../../shared/components/select-field/select-field.component';
import { TextareaFieldComponent } from '../../shared/components/textarea-field/textarea-field.component';
import { DateFieldComponent } from '../../shared/components/date-field/date-field.component';
import { DatetimeFieldComponent } from '../../shared/components/datetime-field/datetime-field.component';
import { ToggleFieldComponent } from '../../shared/components/toggle-field/toggle-field.component';
import { CheckboxFieldComponent } from '../../shared/components/checkbox-field/checkbox-field.component';
import { RadioFieldComponent } from '../../shared/components/radio-field/radio-field.component';
import { RangeFieldComponent } from '../../shared/components/range-field/range-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';
import { PageTitleService } from '../../core/services/page-title.service';

@Component({
  selector: 'app-form-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    TextInputComponent,
    SelectFieldComponent,
    TextareaFieldComponent,
    DateFieldComponent,
    DatetimeFieldComponent,
    ToggleFieldComponent,
    CheckboxFieldComponent,
    RadioFieldComponent,
    RangeFieldComponent,
    AuthButtonComponent,
  ],
  template: `
    <div class="demo-shell">
      <h1>Demo de Componentes de Formulario</h1>
      <p class="demo-sub">Todos los inputs reutilizables disponibles</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="demo-form">
        <h2 class="section-title">Campos de texto</h2>

        <app-text-input
          [control]="form.get('name')!"
          label="Nombre"
          icon="person-outline"
          placeholder="Tu nombre"
        ></app-text-input>

        <app-text-input
          [control]="form.get('email')!"
          label="Correo electrónico"
          icon="mail-outline"
          type="email"
          placeholder="tu@email.com"
        ></app-text-input>

        <app-text-input
          [control]="form.get('password')!"
          label="Contraseña"
          icon="lock-closed-outline"
          type="password"
          placeholder="Mínimo 8 caracteres"
          [showPasswordToggle]="true"
        ></app-text-input>

        <app-text-input
          [control]="form.get('phone')!"
          label="Teléfono"
          icon="call-outline"
          type="tel"
          placeholder="(0412) 123-4567"
          [mask]="phoneMask"
        ></app-text-input>

        <h2 class="section-title">Select</h2>

        <app-select-field
          [control]="form.get('country')!"
          label="País"
          icon="globe-outline"
          placeholder="Selecciona un país"
          [options]="countryOptions"
        ></app-select-field>

        <h2 class="section-title">Fecha</h2>

        <app-date-field
          [control]="form.get('date')!"
          label="Fecha de ingreso"
          icon="calendar-outline"
        ></app-date-field>

        <h2 class="section-title">Texto largo</h2>

        <app-textarea-field
          [control]="form.get('notes')!"
          label="Notas"
          icon="document-text-outline"
          placeholder="Escribe una descripción..."
          [counter]="true"
          [autoGrow]="true"
          [maxlength]="100"
        ></app-textarea-field>

        <h2 class="section-title">Datetime</h2>

        <app-datetime-field
          [control]="form.get('datetime')!"
          label="Fecha y hora"
          hourCycle="h12"
        ></app-datetime-field>

        <h2 class="section-title">Toggle</h2>

        <app-toggle-field
          [control]="form.get('notifications')!"
          label="Notificaciones activas"
          icon="notifications-outline"
        ></app-toggle-field>

        <h2 class="section-title">Checkbox</h2>

        <app-checkbox-field
          [control]="form.get('terms')!"
          label="Acepto los términos"
          icon="shield-checkmark-outline"
        ></app-checkbox-field>

        <h2 class="section-title">Radio</h2>

        <app-radio-field
          [control]="form.get('priority')!"
          label="Prioridad"
          icon="flag-outline"
          [options]="priorityOptions"
        ></app-radio-field>

        <h2 class="section-title">Range</h2>

        <app-range-field
          [control]="form.get('rating')!"
          label="Valoración"
          icon="star-outline"
          [min]="1"
          [max]="5"
          [step]="1"
          [snaps]="true"
          [ticks]="true"
        ></app-range-field>

        <app-auth-button
          label="ENVIAR FORMULARIO"
          icon="paper-plane"
          [disabled]="form.invalid"
        ></app-auth-button>
      </form>

      @if (submitted()) {
        <div class="result-box">
          <h3>Valores enviados:</h3>
          <pre>{{ form.value | json }}</pre>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .demo-shell {
        padding: 20px;
        color: var(--app-text);
        box-sizing: border-box;
      }

      h1 {
        margin: 0 0 4px;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.03em;
      }

      .demo-sub {
        margin: 0 0 32px;
        color: var(--app-text-muted);
        font-size: 14px;
      }

      .demo-form {
        display: flex;
        flex-direction: column;
      }

      .section-title {
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--app-text-muted);
        margin: 24px 0 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--app-border);
      }

      .section-title:first-of-type {
        margin-top: 0;
      }

      .result-box {
        margin-top: 32px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--app-border);
        border-radius: 12px;

        h3 {
          margin: 0 0 12px;
          font-size: 14px;
          color: var(--app-text-muted);
        }

        pre {
          margin: 0;
          font-size: 13px;
          color: var(--app-success);
          white-space: pre-wrap;
          word-break: break-word;
        }
      }

      @media (prefers-color-scheme: light) {
        .result-box {
          background: rgba(0, 0, 0, 0.03);
        }
      }

      @media (max-width: 767px) {
        .demo-shell {
          padding: 20px 16px;
        }
      }
    `,
  ],
})
export class FormDemoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pageTitle = inject(PageTitleService);

  readonly submitted = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, emailValidator]],
    password: ['', [Validators.required, passwordValidator]],
    phone: [''],
    country: ['', Validators.required],
    date: ['', Validators.required],
    datetime: ['', Validators.required],
    notifications: [true],
    terms: [false, Validators.requiredTrue],
    priority: ['medium', Validators.required],
    rating: [3],
    notes: ['', Validators.required],
  });

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

  countryOptions = [
    { value: 'VE', label: 'Venezuela' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'ES', label: 'España' },
    { value: 'MX', label: 'México' },
    { value: 'CO', label: 'Colombia' },
    { value: 'AR', label: 'Argentina' },
  ];

  priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'critical', label: 'Crítica' },
  ];

  ngOnInit() {
    this.pageTitle.title.set('Formulario Demo');
    this.pageTitle.subtitle.set('Componentes de formulario reutilizables');
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitted.set(true);
    }
  }
}
