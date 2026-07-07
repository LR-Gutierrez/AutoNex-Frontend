import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, barcodeOutline, calendarOutline, carOutline, clipboardOutline, personOutline } from 'ionicons/icons';
import type { MaskitoOptions } from '@maskito/core';
import { VehicleService } from '../../core/services/vehicle.service';
import { ClientService } from '../../core/services/client.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { SelectFieldComponent } from '../../shared/components/select-field/select-field.component';
import type { SelectOption } from '../../shared/components/select-field/select-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonIcon,
    TextInputComponent,
    SelectFieldComponent,
    AuthButtonComponent,
  ],
  styles: `
    :host {
      display: block;
      --card-bg: var(--app-surface);
    }
  `,
  template: `
    <div class="p-5 max-md:p-3.5 text-(--app-text) box-border">
      <section class="mb-5">
        <div class="flex items-center gap-3 mb-1">
          <a
            routerLink="/vehicles"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {{ isEdit() ? 'Editar Vehículo' : 'Nuevo Vehículo' }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{
                isEdit()
                  ? 'Modifica los datos del vehículo'
                  : 'Registra un nuevo vehículo en el sistema'
              }}
            </p>
          </div>
        </div>
      </section>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingVehicle()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando datos del vehículo...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            @if (!isEdit()) {
              <app-select-field
                [control]="form.get('clientId')!"
                label="Cliente propietario"
                icon="person-outline"
                placeholder="Selecciona un cliente"
                [options]="clientOptions()"
              ></app-select-field>
            }

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

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-2">
              <app-auth-button
                [label]="
                  isEdit() ? 'ACTUALIZAR VEHÍCULO' : 'REGISTRAR VEHÍCULO'
                "
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/vehicles"
                class="inline-flex items-center justify-center h-[52px] px-6 border-2 border-(--app-border) text-(--app-text-muted) text-sm font-bold rounded-[12px] no-underline transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-(--app-text)"
              >
                Cancelar
              </a>
            </div>
          </form>
        }
      </div>
    </div>
  `,
})
export class VehicleFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vehicleService = inject(VehicleService);
  private readonly clientService = inject(ClientService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingVehicle = signal(false);
  readonly clientOptions = signal<SelectOption[]>([]);

  private vehicleId: number | null = null;

  readonly uppercaseMask: MaskitoOptions = {
    mask: ({ value }) => value.split('').map(() => /./),
    preprocessors: [
      ({ elementState, data }) => {
        return { elementState, data: data.toUpperCase() };
      },
    ],
  };

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
    clientId: [0, Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: ['', Validators.required],
    licensePlate: ['', Validators.required],
    vin: [''],
  });

  constructor() {
    addIcons({ arrowBackOutline, barcodeOutline, calendarOutline, carOutline, clipboardOutline, personOutline });
  }

  ngOnInit() {
    this.loadClients();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.vehicleId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Vehículo');
      this.pageTitle.subtitle.set('Modifica los datos del vehículo');
      this.loadVehicle();
    } else {
      this.pageTitle.title.set('Nuevo Vehículo');
      this.pageTitle.subtitle.set('Registra un nuevo vehículo en el sistema');
    }
  }

  private loadClients() {
    this.clientService.loadAll().subscribe({
      next: () => {
        this.clientOptions.set(
          this.clientService.clients().map((c) => ({
            value: c.id,
            label: `${c.fullName}${c.phone ? ` - ${c.phone}` : ''}`,
          })),
        );
      },
    });
  }

  private loadVehicle() {
    if (!this.vehicleId) return;
    this.loadingVehicle.set(true);
    this.vehicleService.getById(this.vehicleId).subscribe({
      next: (vehicle) => {
        this.form.patchValue({
          clientId: vehicle.clientId,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year.toString(),
          licensePlate: vehicle.licensePlate,
          vin: vehicle.vin ?? '',
        });
        this.loadingVehicle.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loadingVehicle.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    const baseRequest = {
      brand: this.form.value.brand!,
      model: this.form.value.model!,
      year: Number(this.form.value.year!),
      licensePlate: this.form.value.licensePlate!,
      vin: this.form.value.vin || undefined,
    };

    if (this.isEdit() && this.vehicleId) {
      this.vehicleService.update(this.vehicleId, baseRequest).subscribe({
        next: () => this.router.navigate(['/vehicles']),
        error: (err) => {
          this.error.set(err.message);
          this.submitting.set(false);
        },
        complete: () => this.submitting.set(false),
      });
    } else {
      const request = {
        ...baseRequest,
        clientId: Number(this.form.value.clientId!),
      };
      this.vehicleService.create(request).subscribe({
        next: () => this.router.navigate(['/vehicles']),
        error: (err) => {
          this.error.set(err.message);
          this.submitting.set(false);
        },
        complete: () => this.submitting.set(false),
      });
    }
  }
}
