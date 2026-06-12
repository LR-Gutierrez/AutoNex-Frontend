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
  IonSelect,
  IonSelectOption,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { VehicleService } from '../../../core/services/vehicle.service';
import { ClientService } from '../../../core/services/client.service';
import { ClientResponse } from '../../../core/models/client.model';

@Component({
  selector: 'app-vehicle-form',
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
    IonSelect,
    IonSelectOption,
    IonIcon,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEditMode() ? 'Editar Vehículo' : 'Nuevo Vehículo' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="auth-container" style="padding-top: 0;">
        <h2 class="auth-title" style="text-align: left;">{{ isEditMode() ? 'Editar Vehículo' : 'Nuevo Vehículo' }}</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <label class="field-label">Cliente *</label>
          <div class="input-wrapper select-wrapper">
            <ion-select formControlName="clientId" placeholder="Seleccionar cliente">
              @for (c of clients(); track c.id) {
                <ion-select-option [value]="c.id">{{ c.fullName }}</ion-select-option>
              }
            </ion-select>
          </div>
          @if (form.get('clientId')?.invalid && form.get('clientId')?.touched) {
            <div class="error-msg">Requerido</div>
          }

          <label class="field-label">Marca *</label>
          <div class="input-wrapper">
            <ion-icon name="car-outline" class="input-icon"></ion-icon>
            <ion-input type="text" formControlName="brand" placeholder="Marca del vehículo"></ion-input>
          </div>
          @if (form.get('brand')?.invalid && form.get('brand')?.touched) {
            <div class="error-msg">Requerido</div>
          }

          <label class="field-label">Modelo *</label>
          <div class="input-wrapper">
            <ion-icon name="car-outline" class="input-icon"></ion-icon>
            <ion-input type="text" formControlName="model" placeholder="Modelo del vehículo"></ion-input>
          </div>
          @if (form.get('model')?.invalid && form.get('model')?.touched) {
            <div class="error-msg">Requerido</div>
          }

          <label class="field-label">Año *</label>
          <div class="input-wrapper">
            <ion-icon name="calendar-outline" class="input-icon"></ion-icon>
            <ion-input type="number" formControlName="year" placeholder="Año"></ion-input>
          </div>
          @if (form.get('year')?.invalid && form.get('year')?.touched) {
            <div class="error-msg">Año inválido</div>
          }

          <label class="field-label">Placa *</label>
          <div class="input-wrapper">
            <ion-icon name="document-text-outline" class="input-icon"></ion-icon>
            <ion-input type="text" formControlName="licensePlate" placeholder="Placa"></ion-input>
          </div>
          @if (form.get('licensePlate')?.invalid && form.get('licensePlate')?.touched) {
            <div class="error-msg">Requerido</div>
          }

          <label class="field-label">VIN (opcional)</label>
          <div class="input-wrapper">
            <ion-icon name="barcode-outline" class="input-icon"></ion-icon>
            <ion-input type="text" formControlName="vin" placeholder="Número de VIN"></ion-input>
          </div>

          <ion-button type="submit" expand="block" class="submit-btn"
                      [disabled]="form.invalid || saving()">
            {{ saving() ? 'GUARDANDO...' : 'GUARDAR' }}
          </ion-button>
        </form>
      </div>
    </ion-content>
  `,
})
export class VehicleFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly saving = signal(false);
  readonly clients = signal<ClientResponse[]>([]);

  form = this.fb.group({
    clientId: [0, [Validators.required, Validators.min(1)]],
    brand: ['', [Validators.required]],
    model: ['', [Validators.required]],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(2100)]],
    licensePlate: ['', [Validators.required]],
    vin: [''],
  });

  private editId: number | null = null;

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    this.clientService.loadAll().subscribe({
      next: () => this.clients.set(this.clientService.clients()),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.vehicleService.getById(this.editId).subscribe(v => {
        this.form.patchValue({
          clientId: v.clientId,
          brand: v.brand,
          model: v.model,
          year: v.year,
          licensePlate: v.licensePlate,
          vin: v.vin || '',
        });
      });
    }
  }

  isEditMode() {
    return this.editId !== null;
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const { clientId, brand, model, year, licensePlate, vin } = this.form.value;

    if (this.editId) {
      this.vehicleService.update(this.editId, {
        brand: brand!,
        model: model!,
        year: year!,
        licensePlate: licensePlate!,
        vin: vin || undefined,
      }).subscribe({
        next: () => this.router.navigate(['/vehicles', this.editId]),
        error: () => this.saving.set(false),
      });
    } else {
      this.vehicleService.create({
        clientId: clientId!,
        brand: brand!,
        model: model!,
        year: year!,
        licensePlate: licensePlate!,
        vin: vin || undefined,
      }).subscribe({
        next: (v) => this.router.navigate(['/vehicles', v.id]),
        error: () => this.saving.set(false),
      });
    }
  }
}
