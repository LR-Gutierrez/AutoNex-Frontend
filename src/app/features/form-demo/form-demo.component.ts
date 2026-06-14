import { Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { emailValidator } from '../../shared/validators/email.validators';
import { passwordValidator } from '../../shared/validators/password.validator';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { SelectFieldComponent } from '../../shared/components/select-field/select-field.component';
import { TextareaFieldComponent } from '../../shared/components/textarea-field/textarea-field.component';
import { DateFieldComponent } from '../../shared/components/date-field/date-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';
import { PageTitleService } from '../../core/services/page-title.service';

@Component({
  selector: 'app-form-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    FormFieldComponent,
    SelectFieldComponent,
    TextareaFieldComponent,
    DateFieldComponent,
    AuthButtonComponent,
  ],
  template: `
    <div class="demo-shell">
      <h1>Demo de Componentes de Formulario</h1>
      <p class="demo-sub">Todos los inputs reutilizables disponibles</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="demo-form">
        <h2 class="section-title">Campos de texto</h2>

        <app-form-field
          [control]="form.get('name')!"
          label="Nombre"
          icon="person-outline"
          placeholder="Tu nombre"
        ></app-form-field>

        <app-form-field
          [control]="form.get('email')!"
          label="Correo electrónico"
          icon="mail-outline"
          type="email"
          placeholder="tu@email.com"
        ></app-form-field>

        <app-form-field
          [control]="form.get('password')!"
          label="Contraseña"
          icon="lock-closed-outline"
          type="password"
          placeholder="Mínimo 8 caracteres"
          [showPasswordToggle]="true"
        ></app-form-field>

        <app-form-field
          [control]="form.get('phone')!"
          label="Teléfono"
          icon="call-outline"
          type="tel"
          placeholder="+58 412 123 4567"
        ></app-form-field>

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
          [rows]="5"
          [autoGrow]="true"
        ></app-textarea-field>

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
    notes: ['', Validators.required],
  });

  countryOptions = [
    { value: 'VE', label: 'Venezuela' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'ES', label: 'España' },
    { value: 'MX', label: 'México' },
    { value: 'CO', label: 'Colombia' },
    { value: 'AR', label: 'Argentina' },
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
