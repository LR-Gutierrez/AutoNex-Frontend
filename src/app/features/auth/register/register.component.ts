import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import {
  IonContent,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
  IonLabel,
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
    IonList,
    IonItem,
    IonLabel,
  ],
  template: `
    <ion-content class="ion-padding">
      <div class="max-w-md mx-auto mt-8">
        <h1 class="text-2xl font-bold text-center mb-6">Crear Cuenta</h1>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <ion-list>
            <ion-item>
              <ion-label position="floating">Nombre Completo</ion-label>
              <ion-input formControlName="fullName" type="text"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Correo Electrónico</ion-label>
              <ion-input formControlName="email" type="email"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Contraseña</ion-label>
              <ion-input formControlName="password" type="password"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Teléfono (opcional)</ion-label>
              <ion-input formControlName="phone" type="tel"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Rol</ion-label>
              <ion-select formControlName="role">
                <ion-select-option value="Admin">Admin</ion-select-option>
                <ion-select-option value="Mechanic">Mecánico</ion-select-option>
                <ion-select-option value="Receptionist">Recepcionista</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>

          @if (errorMessage) {
            <p class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
          }

          <ion-button
            type="submit"
            expand="block"
            class="mt-6"
            [disabled]="registerForm.invalid || saving"
          >
            {{ saving ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </ion-button>
        </form>

        <div class="text-center mt-4">
          <a routerLink="/auth/login">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </div>
    </ion-content>
  `,
})
export class RegisterComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly loadingController = inject(LoadingController);
  private readonly alertController = inject(AlertController);
  private readonly authService = inject(AuthService);

  registerForm!: FormGroup;
  saving = false;
  errorMessage = '';

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required, emailValidator]],
      password: [null, [Validators.required, passwordValidator]],
      phone: [null],
      role: [UserRole.Mechanic, [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.saving = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
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
        this.saving = false;
        this.errorMessage = error.message || 'Error al crear la cuenta';
      },
    });
  }
}
