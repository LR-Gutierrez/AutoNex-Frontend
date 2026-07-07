import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  IonContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, callOutline, shieldOutline } from 'ionicons/icons';
import { emailValidator } from '../../../shared/validators/email.validators';
import { passwordValidator } from '../../../shared/validators/password.validator';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { AuthBrandingComponent } from '../../../shared/components/auth-branding/auth-branding.component';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { SelectFieldComponent } from '../../../shared/components/select-field/select-field.component';
import { AuthButtonComponent } from '../../../shared/components/auth-button/auth-button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    RevealDirective,
    AuthBrandingComponent,
    TextInputComponent,
    SelectFieldComponent,
    AuthButtonComponent,
  ],
  template: `
    <ion-content [fullscreen]="true" class="auth-content">
      <div class="auth-container">
        <app-auth-branding [revealDelay]="0"></app-auth-branding>

        <h2 class="auth-title" [appReveal]="200">Registro de Nuevo Usuario</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form" [appReveal]="200">
          <app-text-input
            [control]="form.get('fullName')!"
            label="Nombre Completo *"
            icon="person-outline"
            type="text"
            placeholder="Nombre completo"
          ></app-text-input>

          <app-text-input
            [control]="form.get('email')!"
            label="Correo electrónico *"
            icon="mail-outline"
            type="email"
            placeholder="tu@email.com"
          ></app-text-input>

          <app-text-input
            [control]="form.get('password')!"
            label="Contraseña *"
            icon="lock-closed-outline"
            type="password"
            placeholder="Mínimo 8 caracteres"
            [showPasswordToggle]="true"
          ></app-text-input>

          <app-text-input
            [control]="form.get('phone')!"
            label="Teléfono (opcional)"
            icon="call-outline"
            type="tel"
            placeholder="Número de teléfono"
          ></app-text-input>

          <app-select-field
            [control]="form.get('role')!"
            label="Rol *"
            icon="shield-outline"
            placeholder="Selecciona un rol"
            [options]="roleOptions"
          ></app-select-field>

          @if (errorMessage()) {
            <p class="error-msg" style="margin-top: 0; margin-bottom: 16px;">{{ errorMessage() }}</p>
          }

          <p class="terms-text">
            Al registrarte, aceptas nuestros <a href="#">Términos de servicio</a>
            y <a href="#">Política de privacidad</a>.
          </p>

          <app-auth-button
            [label]="saving() ? 'CREANDO CUENTA...' : 'CREAR CUENTA'"
            [disabled]="form.invalid"
            [loading]="saving()"
          ></app-auth-button>

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

    .auth-title {
      font-size: 18px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 24px 0;
      letter-spacing: 1px;
      opacity: 0;
      transition: opacity 0.6s ease-out;

      &.revealed {
        opacity: 1;
      }
    }

    .auth-form {
      width: 100%;
      max-width: 400px;
      opacity: 0;
      transition: opacity 0.6s ease-out;

      &.revealed {
        opacity: 1;
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

    @media (prefers-color-scheme: light) {
      .auth-content {
        --background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      }

      .auth-title {
        color: rgba(0, 0, 0, 0.8);
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

  readonly saving = signal(false);
  readonly errorMessage = signal('');

  form = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, emailValidator]],
    password: ['', [Validators.required, passwordValidator]],
    phone: [''],
    role: [UserRole.Mechanic, [Validators.required]],
  });

  roleOptions = [
    { value: UserRole.Admin, label: 'Admin' },
    { value: UserRole.Mechanic, label: 'Mecánico' },
    { value: UserRole.Receptionist, label: 'Recepcionista' },
  ];

  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline, callOutline, shieldOutline });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.form.invalid || this.saving()) return;

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
        this.saving.set(false);
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
