import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { emailValidator } from 'src/app/validators/email.validators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading: any;
  showPassword = false;
  logoExists = true;

  background = {
    backgroundImage:
      'url(https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1051&q=80)',
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['tabs/live-stream']);
    }

    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, emailValidator]],
      password: [null, [Validators.required, Validators.minLength(1)]],
    });
  }

  async signIn() {
    if (this.loginForm.valid) {
      await this.presentLoading();

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.loading.dismiss();
          this.router.navigate(['tabs/live-stream']);
        },
        error: async (error) => {
          this.loading.dismiss();
          const message = error.error?.error || 'Error al iniciar sesión';
          await this.showErrorAlert(message);
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
