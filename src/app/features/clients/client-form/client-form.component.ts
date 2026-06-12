import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonInput,
  IonTextarea,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { ClientService } from '../../../core/services/client.service';
import { emailValidator } from '../../../validators/email.validators';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonInput,
    IonTextarea,
    IonIcon,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEditMode() ? 'Editar Cliente' : 'Nuevo Cliente' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label class="field-label">Nombre Completo *</label>
        <div class="input-wrapper">
          <ion-icon name="person-outline" class="input-icon"></ion-icon>
          <ion-input type="text" formControlName="fullName" placeholder="Nombre completo"></ion-input>
        </div>
        @if (form.get('fullName')?.invalid && form.get('fullName')?.touched) {
          <div class="error-msg">Requerido</div>
        }

        <label class="field-label">Teléfono *</label>
        <div class="input-wrapper">
          <ion-icon name="call-outline" class="input-icon"></ion-icon>
          <ion-input type="tel" formControlName="phone" placeholder="Número de teléfono"></ion-input>
        </div>
        @if (form.get('phone')?.invalid && form.get('phone')?.touched) {
          <div class="error-msg">Requerido</div>
        }

        <label class="field-label">Email</label>
        <div class="input-wrapper">
          <ion-icon name="mail-outline" class="input-icon"></ion-icon>
          <ion-input type="email" formControlName="email" placeholder="tu@email.com"></ion-input>
        </div>
        @if (form.get('email')?.invalid && form.get('email')?.touched) {
          <div class="error-msg">Email inválido</div>
        }

        <label class="field-label">Dirección</label>
        <div class="input-wrapper">
          <ion-icon name="location-outline" class="input-icon"></ion-icon>
          <ion-textarea formControlName="address" rows="3" placeholder="Dirección (opcional)"></ion-textarea>
        </div>

        <ion-button type="submit" expand="block" class="submit-btn"
                    [disabled]="form.invalid || saving()">
          {{ saving() ? 'GUARDANDO...' : 'GUARDAR' }}
        </ion-button>
      </form>
    </ion-content>
  `,
})
export class ClientFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly saving = signal(false);

  form = this.fb.group({
    fullName: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', emailValidator],
    address: [''],
  });

  private editId: number | null = null;

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.clientService.getById(this.editId).subscribe(client => {
        this.form.patchValue({
          fullName: client.fullName,
          phone: client.phone,
          email: client.email || '',
          address: client.address || '',
        });
      });
    }
  }

  isEditMode(): boolean {
    return this.editId !== null;
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const { fullName, phone, email, address } = this.form.value;

    if (this.editId) {
      this.clientService.update(this.editId, {
        fullName: fullName!,
        phone: phone!,
        email: email || undefined,
        address: address || undefined,
      }).subscribe({
        next: () => this.router.navigate(['/clients', this.editId]),
        error: () => this.saving.set(false),
      });
    } else {
      this.clientService.create({
        fullName: fullName!,
        phone: phone!,
        email: email || undefined,
        address: address || undefined,
      }).subscribe({
        next: (client) => this.router.navigate(['/clients', client.id]),
        error: () => this.saving.set(false),
      });
    }
  }
}
