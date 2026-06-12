import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { emailValidator } from 'src/app/validators/email.validators';
import { passwordValidator } from 'src/app/validators/password.validator';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  loading: any;
  showPassword = false;

  background = {
    backgroundImage:
      'url(https://images.unsplash.com/photo-1484712401471-05c7215830eb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)',
  };

  genderOptions = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'prefer_not_to_say', label: 'Prefiero no responder' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      first_name: [null, [Validators.required, Validators.minLength(2)]],
      last_name: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, emailValidator]],
      phone: [null, [Validators.pattern('^[0-9]+$')]],
      profession: [null],
      gender: [null],
      linkedin: [
        null,
        [Validators.pattern('^https?://(www\\.)?linkedin\\.com/.*$')],
      ],
      country: [null],
      password: [null, [Validators.required, passwordValidator]],
    });
  }

  async signUp() {
    if (this.registerForm.valid) {
      await this.presentLoading();

      this.authService.register(this.registerForm.value).subscribe({
        next: async () => {
          this.loading.dismiss();
          await this.showSuccessAlert();
          this.router.navigate(['/login']);
        },
        error: async (error) => {
          this.loading.dismiss();
          const msg =
            error.error?.error ||
            error.error?.errors?.join(', ') ||
            'Error al registrar';
          await this.showErrorAlert(msg);
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

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Registrando...',
      spinner: 'crescent',
    });
    await this.loading.present();
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      message: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
