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
import { emailValidator } from '../../../validators/email.validators';
import { passwordValidator } from '../../../validators/password.validator';
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
  styleUrls: ['../auth-styles.scss'],
  template: `
    <ion-content [fullscreen]="true" class="auth-content">
      <div class="auth-container">
        <div class="logo-section">
          <div class="logo-wrapper">
            <img src="assets/images/logo.png" alt="Logo" class="logo" />
          </div>
          <h1 class="company-name">
            <span class="first-four">Auto</span>Nex
            <span class="company-sub">GUI&amp;CAR, C.A.</span>
          </h1>
        </div>

        <h2 class="auth-title">Registro de Nuevo Usuario</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
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
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly alertController = inject(AlertController);
  private readonly authService = inject(AuthService);

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
