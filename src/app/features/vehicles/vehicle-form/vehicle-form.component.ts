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
  IonSelect,
  IonSelectOption,
  IonNote,
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
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonNote,
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
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <ion-list>
          <ion-item>
            <ion-label>Cliente</ion-label>
            <ion-select formControlName="clientId" placeholder="Seleccionar cliente">
              @for (c of clients(); track c.id) {
                <ion-select-option [value]="c.id">{{ c.fullName }}</ion-select-option>
              }
            </ion-select>
          </ion-item>
          @if (form.get('clientId')?.invalid && form.get('clientId')?.touched) {
            <ion-note color="danger" class="px-4">El cliente es requerido</ion-note>
          }

          <ion-item>
            <ion-label position="floating">Marca</ion-label>
            <ion-input formControlName="brand" type="text"></ion-input>
          </ion-item>
          @if (form.get('brand')?.invalid && form.get('brand')?.touched) {
            <ion-note color="danger" class="px-4">La marca es requerida</ion-note>
          }

          <ion-item>
            <ion-label position="floating">Modelo</ion-label>
            <ion-input formControlName="model" type="text"></ion-input>
          </ion-item>
          @if (form.get('model')?.invalid && form.get('model')?.touched) {
            <ion-note color="danger" class="px-4">El modelo es requerido</ion-note>
          }

          <ion-item>
            <ion-label position="floating">Año</ion-label>
            <ion-input formControlName="year" type="number"></ion-input>
          </ion-item>
          @if (form.get('year')?.invalid && form.get('year')?.touched) {
            <ion-note color="danger" class="px-4">Año inválido</ion-note>
          }

          <ion-item>
            <ion-label position="floating">Placa</ion-label>
            <ion-input formControlName="licensePlate" type="text"></ion-input>
          </ion-item>
          @if (form.get('licensePlate')?.invalid && form.get('licensePlate')?.touched) {
            <ion-note color="danger" class="px-4">La placa es requerida</ion-note>
          }

          <ion-item>
            <ion-label position="floating">VIN (opcional)</ion-label>
            <ion-input formControlName="vin" type="text"></ion-input>
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
