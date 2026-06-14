import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { emailValidator } from '../../../shared/validators/email.validators';
import { AuthService } from '../../../core/services/auth.service';
import { AuthBrandingComponent } from '../../../shared/components/auth-branding/auth-branding.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
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
    FormFieldComponent,
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

        <form
          [formGroup]="loginForm"
          (ngSubmit)="signIn()"
          class="login-form"
        >
          <app-form-field
            [control]="loginForm.get('email')!"
            label="Correo electrónico"
            icon="mail-outline"
            type="email"
            placeholder="tu@email.com"
            [revealDelay]="200"
          ></app-form-field>

          <app-form-field
            [control]="loginForm.get('password')!"
            label="Contraseña"
            icon="lock-closed-outline"
            type="password"
            placeholder="Ingresa tu contraseña"
            [showPasswordToggle]="true"
            [revealDelay]="200"
          ></app-form-field>

          <app-auth-button
            label="INICIAR SESIÓN"
            icon="arrow-forward"
            [disabled]="loginForm.invalid"
            [revealDelay]="200"
          ></app-auth-button>

          <div class="forgot-password">
            <a href="#" (click)="forgotPassword($event)">¿Olvidaste tu contraseña?</a>
          </div>

          <div class="create-account">
            <a routerLink="/auth/register">Crear cuenta nueva</a>
          </div>
        </form>

        <div class="language-selector">
          <div class="language-option">
            <img src="https://flagcdn.com/w40/ve.png" alt="Español" class="flag-icon" />
            <span>Español</span>
          </div>
          <div class="language-option">
            <img src="https://flagcdn.com/w40/us.png" alt="English" class="flag-icon" />
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
  loading: any;

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
