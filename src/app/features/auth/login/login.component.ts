import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { emailValidator } from '../../../validators/email.validators';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['../../../pages/login/login.page.scss'],
})
export class LoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly loadingController = inject(LoadingController);
  private readonly alertController = inject(AlertController);
  private readonly authService = inject(AuthService);

  loginForm!: FormGroup;
  showPassword = false;
  logoExists = true;

  background = {
    backgroundImage:
      'url(https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1051&q=80)',
  };

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, emailValidator]],
      password: [null, [Validators.required, Validators.minLength(1)]],
    });
  }

  async signIn() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'loader-container',
        message: 'Iniciando sesión...',
        duration: 10000,
        spinner: 'circular',
        backdropDismiss: false,
      });
      await loading.present();

      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: () => {
          loading.dismiss();
          this.router.navigate(['/dashboard']);
        },
        error: async (error) => {
          loading.dismiss();
          const message = error.message || 'Error al iniciar sesión';
          const alert = await this.alertController.create({
            header: 'Error de autenticación',
            message,
            buttons: ['OK'],
          });
          await alert.present();
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/welcome']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async forgotPassword(event: Event) {
    event.preventDefault();
    const alert = await this.alertController.create({
      header: 'Recuperar contraseña',
      message: 'Esta funcionalidad estará disponible próximamente.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
