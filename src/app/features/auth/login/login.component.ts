import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  arrowForward,
  fingerPrintOutline,
  logoTwitter,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
} from 'ionicons/icons';
import { emailValidator } from '../../../shared/validators/email.validators';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse } from '../../../core/models/auth.model';
import { BiometricService } from '../../../core/services/biometric.service';
import { AuthBrandingComponent } from '../../../shared/components/auth-branding/auth-branding.component';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { AuthButtonComponent } from '../../../shared/components/auth-button/auth-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonIcon,
    AuthBrandingComponent,
    TextInputComponent,
    AuthButtonComponent,
  ],
  template: `
    <ion-content [fullscreen]="true" class="login-content">
      <div class="login-container">
        <app-auth-branding
          subtitle="Iniciar Sesión"
          [logoSize]="160"
          [revealDelay]="0"
        ></app-auth-branding>

        @if (lastUser) {
          <div class="welcome-card">
            <div class="welcome-avatar">{{ lastUser.fullName.charAt(0) }}</div>
            <div class="welcome-text">
              <span class="welcome-greeting">Bienvenido de vuelta</span>
              <span class="welcome-name">{{ lastUser.fullName }}</span>
            </div>
          </div>
        }

        @if (!lastUser) {
          <app-text-input
            [control]="loginForm.get('email')!"
            label="Correo electrónico"
            icon="mail-outline"
            type="email"
            placeholder="tu@email.com"
            [revealDelay]="200"
          ></app-text-input>
        }

        <form [formGroup]="loginForm" (ngSubmit)="signIn()" class="login-form">
          <app-text-input
            [control]="loginForm.get('password')!"
            label="Contraseña"
            icon="lock-closed-outline"
            type="password"
            placeholder="Ingresa tu contraseña"
            [showPasswordToggle]="true"
            [revealDelay]="200"
          ></app-text-input>

          <app-auth-button
            label="INICIAR SESIÓN"
            icon="arrow-forward"
            [disabled]="loginForm.invalid"
            [loading]="isSubmitting"
            [revealDelay]="200"
          ></app-auth-button>

          @if (lastUser) {
            <button
              type="button"
              class="switch-account-btn"
              (click)="switchAccount()"
            >
              Cambiar de cuenta
            </button>
          }

          @if (biometricService.isAvailable()) {
            <div class="biometric-section">
              <div class="divider"><span>o</span></div>
              <button
                type="button"
                class="biometric-btn"
                (click)="loginWithBiometric()"
              >
                <ion-icon name="finger-print-outline"></ion-icon>
                <span>Iniciar sesión con {{ biometricService.label() }}</span>
              </button>
            </div>
          }

          <div class="forgot-password">
            <a href="#" (click)="forgotPassword($event)"
              >¿Olvidaste tu contraseña?</a
            >
          </div>

          <div class="create-account">
            <a routerLink="/auth/register">Crear cuenta nueva</a>
          </div>
        </form>

        <div class="language-selector">
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

        <div class="social-icons">
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
      }

      .login-form {
        width: 100%;
        max-width: 400px;
      }

      .biometric-section {
        width: 100%;
        margin-top: 8px;

        .divider {
          display: flex;
          align-items: center;
          margin: 16px 0;
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;

          &::before,
          &::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
          }

          span {
            padding: 0 16px;
          }
        }

        .biometric-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.25);
          }

          ion-icon {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.7);
          }
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

      .welcome-card {
        display: flex;
        align-items: center;
        gap: 14px;
        width: 100%;
        max-width: 400px;
        padding: 16px 20px;
        margin-bottom: 20px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        backdrop-filter: blur(8px);

        .welcome-avatar {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #d31d1d, #a01515);
          border-radius: 50%;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .welcome-text {
          display: flex;
          flex-direction: column;
          min-width: 0;

          .welcome-greeting {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .welcome-name {
            font-size: 16px;
            font-weight: 600;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .switch-account-btn {
        display: block;
        width: 100%;
        margin-top: 4px;
        padding: 8px;
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.4);
        font-size: 12px;
        cursor: pointer;
        text-align: center;
        transition: color 0.2s ease;

        &:hover {
          color: rgba(255, 255, 255, 0.7);
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

      .language-selector {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 32px;

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

        .biometric-section {
          .divider {
            color: rgba(0, 0, 0, 0.4);

            &::before,
            &::after {
              background: rgba(0, 0, 0, 0.1);
            }
          }

          .biometric-btn {
            background: white;
            border-color: rgba(0, 0, 0, 0.15);
            color: rgba(0, 0, 0, 0.8);

            &:hover {
              background: rgba(0, 0, 0, 0.03);
              border-color: rgba(0, 0, 0, 0.25);
            }

            ion-icon {
              color: rgba(0, 0, 0, 0.6);
            }
          }
        }

        .forgot-password a {
          color: rgba(0, 0, 0, 0.6);
        }

        .welcome-card {
          background: rgba(0, 0, 0, 0.03);
          border-color: rgba(0, 0, 0, 0.08);

          .welcome-text {
            .welcome-greeting {
              color: rgba(0, 0, 0, 0.4);
            }

            .welcome-name {
              color: #1a1a2e;
            }
          }
        }

        .switch-account-btn {
          color: rgba(0, 0, 0, 0.35);

          &:hover {
            color: rgba(0, 0, 0, 0.6);
          }
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
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loadingOverlay: any;
  isSubmitting = false;
  lastUser: { email: string; fullName: string } | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    protected biometricService: BiometricService,
  ) {
    addIcons({
      mailOutline,
      lockClosedOutline,
      arrowForward,
      fingerPrintOutline,
      logoTwitter,
      logoFacebook,
      logoInstagram,
      logoLinkedin,
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, emailValidator]],
      password: [null, [Validators.required, Validators.minLength(1)]],
    });

    const stored = localStorage.getItem('lastLoggedUser');
    if (stored) {
      try {
        this.lastUser = JSON.parse(stored);
        if (this.lastUser?.email) {
          this.loginForm.patchValue({
            email: this.lastUser.email,
            password: '',
          });
        }
      } catch {
        localStorage.removeItem('lastLoggedUser');
      }
    }

    this.biometricService.init();
  }

  async signIn() {
    if (this.loginForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.presentLoading().catch(() => {});

    const { email, password } = this.loginForm.value;
    this.authService.login({ email, password }).subscribe({
      next: async (response: AuthResponse) => {
        this.isSubmitting = false;
        this.saveLastUser(response);
        await this.dismissLoading();
        await this.handlePostLogin(email, password);
      },
      error: async (error) => {
        this.isSubmitting = false;
        await this.dismissLoading();
        const message = error.message || 'Error al iniciar sesión';
        await this.showErrorAlert(message);
      },
    });
  }

  private async dismissLoading() {
    try {
      await this.loadingOverlay?.dismiss();
    } catch {}
  }

  private saveLastUser(response: AuthResponse) {
    localStorage.setItem(
      'lastLoggedUser',
      JSON.stringify({ email: response.email, fullName: response.fullName }),
    );
    this.lastUser = { email: response.email, fullName: response.fullName };
  }

  async loginWithBiometric() {
    if (this.isSubmitting) return;

    const authenticated = await this.biometricService.authenticate();
    if (!authenticated) return;

    const credentials = await this.biometricService.getCredentials();
    if (!credentials) {
      await this.showErrorAlert(
        'No hay credenciales guardadas. Inicia sesión primero con tu correo y contraseña.',
      );
      return;
    }

    this.isSubmitting = true;
    this.presentLoading().catch(() => {});
    this.authService
      .login({ email: credentials.username, password: credentials.password })
      .subscribe({
        next: async (response: AuthResponse) => {
          this.isSubmitting = false;
          this.saveLastUser(response);
          await this.dismissLoading();
          this.router.navigate(['/dashboard']);
        },
        error: async (error) => {
          this.isSubmitting = false;
          await this.dismissLoading();
          await this.showErrorAlert(error.message || 'Error al iniciar sesión');
        },
      });
  }

  private async handlePostLogin(
    email: string,
    password: string,
  ): Promise<void> {
    if (
      this.biometricService.isAvailable() &&
      !this.biometricService.hasSavedCredentials()
    ) {
      await this.askToSaveCredentials(email, password);
    }
    this.router.navigate(['/dashboard']);
  }

  private async askToSaveCredentials(
    email: string,
    password: string,
  ): Promise<void> {
    const alert = await this.alertController.create({
      header: '¿Usar biometría?',
      message: `¿Deseas guardar tus credenciales para iniciar sesión más rápido con tu ${this.biometricService.label()}?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí',
          handler: () => {
            this.biometricService.saveCredentials(email, password);
          },
        },
      ],
    });
    await alert.present();
  }

  switchAccount() {
    localStorage.removeItem('lastLoggedUser');
    this.lastUser = null;
    this.loginForm.reset({ email: null, password: null });
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
    this.loadingOverlay = await this.loadingController.create({
      cssClass: 'loader-container',
      message: 'Iniciando sesión...',
      duration: 10000,
      spinner: 'circular',
      backdropDismiss: false,
    });
    await this.loadingOverlay.present();
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
