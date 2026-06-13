import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  IonContent,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { emailValidator } from '../../../shared/validators/email.validators';
import { passwordValidator } from '../../../shared/validators/password.validator';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonIcon,
  ],
  template: `
    <ion-content [fullscreen]="true" class="auth-content">
      <div class="auth-container">
        <div class="logo-section" [class.reveal]="reveal()">
          <div class="logo-wrapper">
            <img src="assets/images/logo.png" alt="Logo" class="logo" />
          </div>
          <h1 class="company-name">
            <span class="first-four">Auto</span>Nex
            <span class="company-sub">GUI&amp;CAR, C.A.</span>
          </h1>
        </div>

        <h2 class="auth-title" [class.reveal]="reveal()">Registro de Nuevo Usuario</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form" [class.reveal]="reveal()">
          <label class="field-label">Nombre Completo *</label>
          <div class="input-wrapper">
            <ion-icon name="person-outline" class="input-icon"></ion-icon>
            <ion-input type="text" formControlName="fullName" placeholder="Nombre completo"></ion-input>
          </div>
          @if (form.get('fullName')?.invalid && form.get('fullName')?.touched) {
            <div class="error-msg">Requerido</div>
          }

          <label class="field-label">Correo electrónico *</label>
          <div class="input-wrapper">
            <ion-icon name="mail-outline" class="input-icon"></ion-icon>
            <ion-input type="email" formControlName="email" placeholder="tu@email.com"></ion-input>
          </div>
          @if (form.get('email')?.invalid && form.get('email')?.touched) {
            <div class="error-msg">
              @if (form.get('email')?.errors?.['required']) { Requerido }
              @if (form.get('email')?.errors?.['invalidEmail']) { Correo inválido }
            </div>
          }

          <label class="field-label">Contraseña *</label>
          <div class="input-wrapper password-field">
            <ion-icon name="lock-closed-outline" class="input-icon"></ion-icon>
            <ion-input [type]="showPassword() ? 'text' : 'password'" formControlName="password" placeholder="Mínimo 8 caracteres"></ion-input>
            <ion-icon [name]="showPassword() ? 'eye-off-outline' : 'eye-outline'" class="toggle-password" (click)="showPassword.set(!showPassword())"></ion-icon>
          </div>
          @if (form.get('password')?.invalid && form.get('password')?.touched) {
            <div class="error-msg">
              @if (form.get('password')?.errors?.['required']) { Requerida }
              @if (form.get('password')?.errors?.['invalidPassword']) {
                {{ form.get('password')?.errors?.['message'] }}
              }
            </div>
          }

          <label class="field-label">Teléfono (opcional)</label>
          <div class="input-wrapper">
            <ion-icon name="call-outline" class="input-icon"></ion-icon>
            <ion-input type="tel" formControlName="phone" placeholder="Número de teléfono"></ion-input>
          </div>

          <label class="field-label">Rol *</label>
          <div class="input-wrapper select-wrapper">
            <ion-select formControlName="role" placeholder="Selecciona un rol" interface="alert" cancelText="Cancelar" okText="Aceptar">
              <ion-select-option value="Admin">Admin</ion-select-option>
              <ion-select-option value="Mechanic">Mecánico</ion-select-option>
              <ion-select-option value="Receptionist">Recepcionista</ion-select-option>
            </ion-select>
          </div>

          @if (errorMessage()) {
            <p class="error-msg" style="margin-top: 0; margin-bottom: 16px;">{{ errorMessage() }}</p>
          }

          <p class="terms-text">
            Al registrarte, aceptas nuestros <a href="#">Términos de servicio</a>
            y <a href="#">Política de privacidad</a>.
          </p>

          <ion-button expand="block" type="submit" class="submit-btn" [disabled]="form.invalid || saving()">
            {{ saving() ? 'CREANDO CUENTA...' : 'CREAR CUENTA' }}
          </ion-button>

          <p class="auth-link">
            ¿Ya tienes cuenta? <a routerLink="/auth/login">Inicia sesión</a>
          </p>
        </form>
      </div>
    </ion-content>
  `,
  styles: [
    `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .auth-content {
      --background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .auth-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px 24px;
    }

    .logo-section {
      text-align: center;
      margin-bottom: 32px;
      opacity: 0;

      &.reveal {
        opacity: 1;
        transition: opacity 0.6s ease-out;
      }

      .logo-wrapper {
        margin-bottom: 8px;

        .logo {
          width: 120px;
          height: 120px;
          object-fit: contain;
        }
      }

      .company-name {
        font-size: 28px;
        font-weight: 600;
        color: white;
        margin: 0;
        letter-spacing: 2px;
      }

      .first-four {
        color: #d31d1d;
      }

      .company-sub {
        display: block;
        font-size: 13px;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.6);
        letter-spacing: 1px;
        margin-top: 2px;
      }
    }

    .auth-title {
      font-size: 18px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 24px 0;
      letter-spacing: 1px;
      opacity: 0;

      &.reveal {
        opacity: 1;
        transition: opacity 0.6s ease-out 0.2s;
      }
    }

    .auth-form {
      width: 100%;
      max-width: 400px;
      opacity: 0;

      &.reveal {
        opacity: 1;
        transition: opacity 0.6s ease-out 0.2s;
      }

      .field-label {
        display: block;
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
        margin-bottom: 6px;
        margin-left: 4px;
      }

      .input-wrapper {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 0 14px;
        margin-bottom: 20px;
        transition: all 0.3s ease;

        &:focus-within {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(211, 29, 29, 0.5);
          box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
        }

        ion-icon.input-icon {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.5);
          margin-right: 12px;
          flex-shrink: 0;
        }

        ion-input {
          --background: transparent;
          --color: white;
          --placeholder-color: rgba(255, 255, 255, 0.4);
          --padding-start: 0;
          --padding-end: 0;
          font-size: 15px;
          flex: 1;
        }

        .toggle-password {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          flex-shrink: 0;
          transition: color 0.3s ease;

          &:hover {
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }

      .select-wrapper {
        padding: 0;

        ion-select {
          --padding-start: 14px;
          --padding-end: 14px;
          width: 100%;
          --color: white;
          --placeholder-color: rgba(255, 255, 255, 0.4);
        }
      }

      .error-msg {
        font-size: 12px;
        color: #ff6b6b;
        margin-top: -14px;
        margin-bottom: 14px;
        margin-left: 4px;
      }

      .terms-text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        margin: 0 0 20px;
        line-height: 1.5;

        a {
          color: #d31d1d;
          text-decoration: none;
        }
      }

      .submit-btn {
        --background: linear-gradient(135deg, #d31d1d 0%, #a01515 100%);
        --background-hover: linear-gradient(135deg, #e02020 0%, #b01818 100%);
        --border-radius: 12px;
        --box-shadow: 0 4px 16px rgba(211, 29, 29, 0.4);
        height: 52px;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        margin-bottom: 16px;
        text-transform: uppercase;
        transition: all 0.3s ease;

        &:hover:not([disabled]) {
          --box-shadow: 0 6px 20px rgba(211, 29, 29, 0.6);
          transform: translateY(-2px);
        }

        &:disabled {
          --background: rgba(255, 255, 255, 0.1);
          --color: rgba(255, 255, 255, 0.3);
          --box-shadow: none;
        }
      }

      .auth-link {
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
        margin: 0;

        a {
          color: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: color 0.3s ease;

          &:hover {
            color: white;
          }
        }
      }
    }

    @media (prefers-color-scheme: light) {
      .auth-content {
        --background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      }

      .auth-container {
        .company-name {
          color: #1a1a2e;
        }

        .auth-title {
          color: rgba(0, 0, 0, 0.8);
        }
      }

      .auth-form {
        .field-label {
          color: rgba(0, 0, 0, 0.6);
        }

        .input-wrapper {
          background: white;
          border-color: rgba(0, 0, 0, 0.1);

          &:focus-within {
            background: white;
            border-color: #000000;
            box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
          }

          ion-icon.input-icon {
            color: rgba(0, 0, 0, 0.4);
          }

          ion-input {
            --color: #1a1a2e;
            --placeholder-color: rgba(0, 0, 0, 0.4);
          }

          .toggle-password {
            color: rgba(0, 0, 0, 0.4);

            &:hover {
              color: rgba(0, 0, 0, 0.7);
            }
          }
        }

        .select-wrapper ion-select {
          --color: #1a1a2e;
          --placeholder-color: rgba(0, 0, 0, 0.4);
        }

        .terms-text {
          color: rgba(0, 0, 0, 0.5);
        }

        .auth-link {
          color: rgba(0, 0, 0, 0.6);

          a {
            color: rgba(0, 0, 0, 0.8);

            &:hover {
              color: #1a1a2e;
            }
          }
        }
      }
    }

    @media (max-width: 374px) {
      .auth-container {
        padding: 24px 16px;
      }
    }
    `,
  ],
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly alertController = inject(AlertController);
  private readonly authService = inject(AuthService);

  readonly reveal = signal(false);
  readonly showPassword = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  form = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, emailValidator]],
    password: ['', [Validators.required, passwordValidator]],
    phone: [''],
    role: [UserRole.Mechanic, [Validators.required]],
  });

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => this.reveal.set(true));
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.saving.set(true);
    this.errorMessage.set('');

    const { fullName, email, password, phone, role } = this.form.value;
    this.authService.register({
      fullName: fullName!,
      email: email!,
      password: password!,
      role: role!,
      phone: phone || undefined,
    }).subscribe({
      next: async () => {
        const alert = await this.alertController.create({
          header: 'Cuenta creada',
          message: 'El usuario ha sido registrado exitosamente.',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/auth/login']);
      },
      error: async (error) => {
        this.saving.set(false);
        this.errorMessage.set(error.message || 'Error al crear la cuenta');
      },
    });
  }
}
