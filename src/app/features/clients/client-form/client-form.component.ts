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
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonNote,
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
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonNote,
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
        <ion-list>
          <ion-item>
            <ion-label position="floating">Nombre Completo</ion-label>
            <ion-input formControlName="fullName" type="text"></ion-input>
          </ion-item>
          @if (form.get('fullName')?.invalid && form.get('fullName')?.touched) {
            <ion-note color="danger" class="px-4">El nombre es requerido</ion-note>
          }

          <ion-item>
            <ion-label position="floating">Teléfono</ion-label>
            <ion-input formControlName="phone" type="tel"></ion-input>
          </ion-item>
          @if (form.get('phone')?.invalid && form.get('phone')?.touched) {
            <ion-note color="danger" class="px-4">El teléfono es requerido</ion-note>
          }

          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input formControlName="email" type="email"></ion-input>
          </ion-item>
          @if (form.get('email')?.invalid && form.get('email')?.touched) {
            <ion-note color="danger" class="px-4">Email inválido</ion-note>
          }

          <ion-item>
            <ion-label position="floating">Dirección</ion-label>
            <ion-textarea formControlName="address" rows="3"></ion-textarea>
          </ion-item>
        </ion-list>

        <ion-button type="submit" expand="block" class="mt-6"
                    [disabled]="form.invalid || saving()">
          {{ saving() ? 'Guardando...' : 'Guardar' }}
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
