import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgIf } from '@angular/common';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { emailValidator } from '../../../shared/validators/email.validators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
  ],
  template: `
    <ion-content [fullscreen]="true" class="login-content">
      <div class="login-container">
        <!-- Logo y título -->
        <div class="logo-section" [class.reveal]="reveal()">
          <div class="logo-wrapper">
            <img
              src="assets/images/logo.png"
              alt="Logo"
              class="logo"
              *ngIf="logoExists"
            />
            <div class="logo-placeholder" *ngIf="!logoExists">
              <ion-icon name="airplane"></ion-icon>
            </div>
          </div>
          <h1 class="company-name">
            <span class="first-four">Auto</span>Nex
            <span class="company-sub">GUI&amp;CAR, C.A.</span>
          </h1>
          <p class="login-subtitle">Iniciar Sesión</p>
        </div>

        <!-- Formulario -->
        <form
          [formGroup]="loginForm"
          (ngSubmit)="signIn()"
          class="login-form"
          [class.reveal]="reveal()"
        >
          <!-- Email -->
          <div class="input-group">
            <div class="input-wrapper">
              <ion-icon name="mail-outline" class="input-icon"></ion-icon>
              <ion-input
                type="email"
                formControlName="email"
                placeholder="Correo electrónico"
                class="custom-input"
              ></ion-input>
            </div>
            <div
              class="error-message"
              *ngIf="loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)"
            >
              <span *ngIf="loginForm.get('email')?.errors?.['required']"
                >El correo es requerido</span
              >
              <span *ngIf="loginForm.get('email')?.errors?.['invalidEmail']"
                >Correo inválido</span
              >
            </div>
          </div>

          <!-- Password -->
          <div class="input-group">
            <div class="input-wrapper">
              <ion-icon name="lock-closed-outline" class="input-icon"></ion-icon>
              <ion-input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="Contraseña"
                class="custom-input"
              ></ion-input>
              <ion-icon
                [name]="showPassword ? 'eye-off-outline' : 'eye-outline'"
                class="toggle-password"
                (click)="togglePassword()"
              ></ion-icon>
            </div>
            <div
              class="error-message"
              *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)"
            >
              <span *ngIf="loginForm.get('password')?.errors?.['required']"
                >La contraseña es requerida</span
              >
            </div>
          </div>

          <!-- Login Button -->
          <ion-button
            expand="block"
            type="submit"
            class="login-button"
            [disabled]="loginForm.invalid"
          >
            INICIAR SESIÓN
            <ion-icon slot="end" name="arrow-forward"></ion-icon>
          </ion-button>

          <!-- Forgot Password -->
          <div class="forgot-password">
            <a href="#" (click)="forgotPassword($event)"
              >¿Olvidaste tu contraseña?</a
            >
          </div>

          <!-- Create Account -->
          <div class="create-account">
            <a routerLink="/auth/register">Crear cuenta nueva</a>
          </div>
        </form>

        <!-- Language Selector -->
        <div class="language-selector" [class.reveal]="reveal()">
          <div class="language-option">
            <img
              src="https://flagcdn.com/w40/ve.png"
              alt="Español"
              class="flag-icon"
            />
            <span>Español</span>
          </div>
          <div class="language-option">
            <img
              src="https://flagcdn.com/w40/us.png"
              alt="English"
              class="flag-icon"
            />
            <span>English</span>
          </div>
          <span class="language-label">Idioma / Language</span>
        </div>

        <!-- Social Icons -->
        <div class="social-icons" [class.reveal]="reveal()">
          <ion-icon name="logo-twitter" class="social-icon"></ion-icon>
          <ion-icon name="logo-facebook" class="social-icon"></ion-icon>
          <ion-icon name="logo-instagram" class="social-icon"></ion-icon>
          <ion-icon name="logo-linkedin" class="social-icon"></ion-icon>
        </div>
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

    .login-content {
      --background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px 24px;
      position: relative;
    }

    .logo-section {
      text-align: center;
      margin-bottom: 48px;
      opacity: 0;

      &.reveal {
        opacity: 1;
        transition: opacity 0.6s ease-out;
      }

      .logo-wrapper {
        margin-bottom: 8px;

        .logo {
          width: 160px;
          height: 160px;
          object-fit: contain;
        }

        .logo-placeholder {
          width: 160px;
          height: 160px;
          margin: 0 auto;
          background: linear-gradient(135deg, #d31d1d 0%, #a01515 100%);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(211, 29, 29, 0.4);

          ion-icon {
            font-size: 64px;
            color: white;
          }
        }
      }

      .company-name {
        font-size: 28px;
        font-weight: 600;
        color: white;
        margin: 0 0 8px 0;
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

      .login-subtitle {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
        font-weight: 300;
        font-style: italic;
      }
    }

    .login-form {
      width: 100%;
      max-width: 400px;
      opacity: 0;

      &.reveal {
        opacity: 1;
        transition: opacity 0.6s ease-out 0.2s;
      }

      .input-group {
        margin-bottom: 20px;

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0 16px;
          transition: all 0.3s ease;

          &:focus-within {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(211, 29, 29, 0.5);
            box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
          }

          .input-icon {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.5);
            margin-right: 12px;
            flex-shrink: 0;
          }

          .custom-input {
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

        .error-message {
          font-size: 12px;
          color: #ff6b6b;
          margin-top: 6px;
          margin-left: 16px;
        }
      }

      .login-button {
        --background: linear-gradient(135deg, #d31d1d 0%, #a01515 100%);
        --background-hover: linear-gradient(135deg, #e02020 0%, #b01818 100%);
        --border-radius: 12px;
        --box-shadow: 0 4px 16px rgba(211, 29, 29, 0.4);
        height: 52px;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        margin-top: 8px;
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

        ion-icon {
          margin-left: 8px;
        }
      }

      .forgot-password {
        text-align: center;
        margin-top: 16px;

        a {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            color: #d31d1d;
          }
        }
      }

      .create-account {
        text-align: center;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);

        a {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease;

          &:hover {
            color: white;
          }
        }
      }
    }

    .language-selector {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 32px;
      opacity: 0;

      &.reveal {
        opacity: 1;
        transition: opacity 0.6s ease-out 0.4s;
      }

      .language-option {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .flag-icon {
          width: 20px;
          height: 15px;
          border-radius: 2px;
        }

        span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
        }
      }

      .language-label {
        color: rgba(255, 255, 255, 0.4);
        font-size: 11px;
        font-style: italic;
      }
    }

    .social-icons {
      display: flex;
      gap: 16px;
      margin-top: 24px;
      opacity: 0;

      &.reveal {
        opacity: 1;
        transition: opacity 0.6s ease-out 0.6s;
      }

      .social-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 50%;
        color: rgba(255, 255, 255, 0.6);
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(211, 29, 29, 0.2);
          color: #d31d1d;
          transform: translateY(-2px);
        }
      }
    }

    @media (prefers-color-scheme: light) {
      .login-content {
        --background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      }

      .login-container {
        .logo-section {
          .company-name {
            color: #1a1a2e;
          }

          .login-subtitle {
            color: rgba(0, 0, 0, 0.6);
          }
        }

        .login-form {
          .input-group {
            .input-wrapper {
              background: white;
              border-color: rgba(0, 0, 0, 0.1);

              &:focus-within {
                background: white;
                border-color: #000000;
                box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
              }

              .input-icon {
                color: rgba(0, 0, 0, 0.4);
              }

              .custom-input {
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
          }

          .forgot-password a {
            color: rgba(0, 0, 0, 0.6);
          }

          .create-account {
            border-top-color: rgba(0, 0, 0, 0.1);

            a {
              color: rgba(0, 0, 0, 0.7);

              &:hover {
                color: #1a1a2e;
              }
            }
          }
        }
      }

      .language-selector {
        .language-option {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.1);

          &:hover {
            background: rgba(211, 29, 29, 0.05);
          }

          span {
            color: rgba(0, 0, 0, 0.7);
          }
        }

        .language-label {
          color: rgba(0, 0, 0, 0.4);
        }
      }

      .social-icons {
        .social-icon {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    @media (max-width: 374px) {
      .login-container {
        padding: 24px 16px;
      }

      .logo-section {
        margin-bottom: 32px !important;

        .logo-wrapper {
          .logo,
          .logo-placeholder {
            width: 100px !important;
            height: 100px !important;
          }
        }

        .company-name {
          font-size: 24px !important;
        }
      }
    }
    `,
  ],
})
export class LoginComponent implements OnInit {
  readonly reveal = signal(false);

  loginForm!: FormGroup;
  loading: any;
  showPassword = false;
  logoExists = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
  ) {
    addIcons(allIcons);
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, emailValidator]],
      password: [null, [Validators.required, Validators.minLength(1)]],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.reveal.set(true));
  }

  async signIn() {
    if (this.loginForm.valid) {
      await this.presentLoading();

      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.loading.dismiss();
          this.router.navigate(['/dashboard']);
        },
        error: async (error) => {
          this.loading.dismiss();
          const message = error.message || 'Error al iniciar sesión';
          await this.showErrorAlert(message);
        },
      });
    }
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

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'loader-container',
      message: 'Iniciando sesión...',
      duration: 10000,
      spinner: 'circular',
      backdropDismiss: false,
    });
    await this.loading.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error de autenticación',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
