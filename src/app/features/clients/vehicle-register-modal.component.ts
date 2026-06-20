import { Component, Input, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonFooter,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, carOutline, calendarOutline, clipboardOutline, barcodeOutline } from 'ionicons/icons';
import type { MaskitoOptions } from '@maskito/core';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { VehicleService } from '../../core/services/vehicle.service';
import { CreateVehicleRequest } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-register-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonIcon,
    IonFooter,
    IonSpinner,
    TextInputComponent,
  ],
  styles: `
    ion-header ion-toolbar {
      --background: rgba(18, 19, 32, 0.98);
      --border-color: transparent;
    }
    ion-footer ion-toolbar {
      --background: rgba(18, 19, 32, 0.98);
      --border-color: rgba(255, 255, 255, 0.1);
      padding: 4px 16px;
    }
    ion-footer ion-buttons {
      gap: 8px;
    }
    ion-content {
      --background: rgba(14, 15, 26, 0.98);
    }

    .modal-body {
      padding: 20px;
    }

    .client-info {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 20px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
    }
    .client-info strong {
      color: #fff;
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(220, 38, 38, 0.12);
      border: 1px solid rgba(220, 38, 38, 0.3);
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #f87171;
    }
  `,
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="cancel()" color="light">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Registrar Vehículo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="modal-body">
        <div class="client-info">
          <ion-icon name="person-outline" style="font-size:16px;flex-shrink:0"></ion-icon>
          Cliente: <strong>{{ clientName }}</strong>
        </div>

        <form [formGroup]="form">
          <app-text-input
            [control]="form.get('brand')!"
            label="Marca"
            icon="car-outline"
            placeholder="Ej: Toyota, Ford, Chevrolet"
          ></app-text-input>

          <app-text-input
            [control]="form.get('model')!"
            label="Modelo"
            icon="car-outline"
            placeholder="Ej: Hilux, Ranger, Onix"
          ></app-text-input>

          <app-text-input
            [control]="form.get('year')!"
            label="Año"
            icon="calendar-outline"
            type="number"
            placeholder="Ej: 2020"
          ></app-text-input>

          <app-text-input
            [control]="form.get('licensePlate')!"
            label="Placa"
            icon="clipboard-outline"
            placeholder="Ej: AB123CD"
            [mask]="vinMask"
          ></app-text-input>

          <app-text-input
            [control]="form.get('vin')!"
            label="VIN (opcional)"
            icon="barcode-outline"
            placeholder="Número de serie del vehículo"
            [maxlength]="17"
            [mask]="vinMask"
          ></app-text-input>

        </form>

          @if (error()) {
            <div class="error-msg" role="alert">
              <ion-icon name="close-outline" style="font-size:16px;flex-shrink:0"></ion-icon>
              <span>{{ error() }}</span>
            </div>
          }
      </div>
    </ion-content>

    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" (click)="cancel()" [disabled]="saving()">
            Cancelar
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button
            color="danger"
            [disabled]="form.invalid || saving()"
            (click)="save()"
          >
            @if (saving()) {
              <div class="flex items-center gap-2">
                <ion-spinner name="crescent" style="width:18px;height:18px"></ion-spinner>
                <span>Guardando...</span>
              </div>
            } @else {
              <span>Registrar Vehículo</span>
            }
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
})
export class VehicleRegisterModalComponent {
  @Input() clientId: number = 0;
  @Input() clientName: string = '';

  private readonly fb = inject(FormBuilder);
  private readonly modalCtrl = inject(ModalController);
  private readonly vehicleService = inject(VehicleService);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly vinMask: MaskitoOptions = {
    mask: ({ value }) => value.split('').map(() => /./),
    preprocessors: [
      ({ elementState, data }) => ({
        elementState,
        data: data.toUpperCase().replace(/[^0-9A-Z]/g, ''),
      }),
    ],
  };

  form = this.fb.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: ['', Validators.required],
    licensePlate: ['', Validators.required],
    vin: [''],
  });

  constructor() {
    addIcons({ closeOutline, carOutline, calendarOutline, clipboardOutline, barcodeOutline });
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.error.set(null);

    const request: CreateVehicleRequest = {
      clientId: this.clientId,
      brand: this.form.value.brand!,
      model: this.form.value.model!,
      year: Number(this.form.value.year!),
      licensePlate: this.form.value.licensePlate!,
      vin: this.form.value.vin || undefined,
    };

    this.vehicleService.create(request).subscribe({
      next: () => {
        this.modalCtrl.dismiss({ success: true }, 'confirm');
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Error al registrar el vehículo. Intenta de nuevo.');
      },
    });
  }
}
