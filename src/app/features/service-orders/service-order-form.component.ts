import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline, calendarOutline, carOutline, cashOutline, constructOutline, cubeOutline, documentTextOutline, peopleOutline, speedometerOutline, swapHorizontalOutline, trashOutline, waterOutline } from 'ionicons/icons';
import { ServiceOrderService } from '../../core/services/service-order.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { ServiceService } from '../../core/services/service.service';
import { ConsumableService } from '../../core/services/consumable.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import {
  SelectFieldComponent,
  SelectOption,
} from '../../shared/components/select-field/select-field.component';
import { DateFieldComponent } from '../../shared/components/date-field/date-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';
import { priceMask } from '../../shared/masks/price.mask';
import { kmMask } from '../../shared/masks/km.mask';
import type { MaskitoOptions } from '@maskito/core';

@Component({
  selector: 'app-service-order-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonIcon,
    TextInputComponent,
    SelectFieldComponent,
    DateFieldComponent,
    AuthButtonComponent,
  ],
  styles: `
    :host {
      display: block;
      --card-bg: linear-gradient(
        180deg,
        rgba(30, 32, 52, 0.96),
        rgba(24, 25, 42, 0.96)
      );
    }
    .cancel-link {
      color: var(--app-text-muted);
      transition:
        color 0.2s ease,
        background-color 0.2s ease;
    }
    .cancel-link:hover {
      color: var(--app-text);
    }
    .item-row {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--app-border);
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 8px;
    }
    .remove-btn {
      background: rgba(255, 59, 48, 0.15);
      color: #ff5a52;
      border: none;
      cursor: pointer;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .remove-btn:hover {
      background: rgba(255, 59, 48, 0.25);
    }
    .add-item-btn {
      background: rgba(255, 255, 255, 0.06);
      color: var(--app-text-muted);
      border: 1px dashed var(--app-border);
      cursor: pointer;
      border-radius: 10px;
      padding: 10px 16px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .add-item-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--app-text);
    }
  `,
  template: `
    <div class="p-5 max-md:p-3.5 text-(--app-text) box-border">
      <section class="mb-5">
        <div class="flex items-center gap-3 mb-1">
          <a
            routerLink="/service-orders"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {{ isEdit() ? 'Editar Orden' : 'Nueva Orden de Servicio' }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{
                isEdit()
                  ? 'Modifica la orden de servicio'
                  : 'Registra una nueva orden de servicio'
              }}
            </p>
          </div>
        </div>
      </section>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingOrder()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando orden de servicio...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-select-field
              [control]="form.get('vehicleId')!"
              label="Vehículo"
              icon="car-outline"
              placeholder="Selecciona un vehículo"
              [options]="vehicleOptions()"
            ></app-select-field>

            @if (selectedClientName()) {
              <div
                class="flex items-center gap-2 mb-5 px-1 text-xs text-(--app-text-muted)"
              >
                <ion-icon name="people-outline" class="text-[14px]"></ion-icon>
                Cliente:
                <span class="font-semibold text-(--app-text)">{{
                  selectedClientName()
                }}</span>
              </div>
            }

            <app-text-input
              [control]="form.get('currentKm')!"
              label="Kilometraje actual"
              icon="speedometer-outline"
              placeholder="0"
              [mask]="kmMask"
              [maxlength]="9"
            ></app-text-input>

            <div class="mt-6 mb-2">
              <label class="text-(--app-text-muted) text-[13px] font-semibold"
                >Uso estimado del vehículo (opcional)</label
              >
            </div>
            <div class="flex gap-3">
              <app-text-input
                [control]="form.get('estimatedDailyKm')!"
                label="Km por día"
                icon="speedometer-outline"
                placeholder="35"
                [mask]="kmMask"
                [maxlength]="7"
              ></app-text-input>
              <app-text-input
                [control]="form.get('daysPerWeek')!"
                label="Días a la semana"
                icon="calendar-outline"
                placeholder="5"
                [mask]="daysPerWeekMask"
              ></app-text-input>
            </div>
            @if (weeklyKmText()) {
              <div
                class="text-xs px-1 mt-1 mb-5 italic"
                [class.text-green-400]="weeklyKmValid()"
                [class.text-yellow-400]="!weeklyKmValid()"
              >
                {{ weeklyKmText() }}
              </div>
            }

            <app-date-field
              [control]="form.get('date')!"
              label="Fecha de la orden"
              icon="calendar-outline"
            ></app-date-field>

            <app-text-input
              [control]="form.get('notes')!"
              label="Notas (opcional)"
              icon="document-text-outline"
              placeholder="Observaciones adicionales"
            ></app-text-input>

            <div class="mt-6 mb-2">
              <label class="text-(--app-text-muted) text-[13px] font-semibold"
                >Ítems de la orden</label
              >
            </div>

            <div formArrayName="items">
              @for (item of items.controls; track item; let i = $index) {
                <div class="item-row" [formGroupName]="i">
                  <div class="grid grid-cols-2 gap-3">
                    <app-select-field
                      [control]="item.get('type')!"
                      label="Tipo"
                      icon="swap-horizontal-outline"
                      placeholder="Tipo de ítem"
                      [options]="itemTypeOptions"
                      [revealDelay]="0"
                    ></app-select-field>
                    @if (item.get('type')?.value === 'Service') {
                      <app-select-field
                        [control]="item.get('serviceId')!"
                        label="Servicio"
                        icon="construct-outline"
                        placeholder="Seleccionar"
                        [options]="serviceOptions()"
                        [revealDelay]="0"
                      ></app-select-field>
                    } @else {
                      <app-select-field
                        [control]="item.get('consumableId')!"
                        label="Consumible"
                        icon="water-outline"
                        placeholder="Seleccionar"
                        [options]="consumableOptions()"
                        [revealDelay]="0"
                        emptyMessage="No hay consumibles disponibles con stock. Crea uno desde el inventario."
                      ></app-select-field>
                      @if (consumableOptions().length === 0) {
                        <p class="text-xs text-yellow-400 mt-1 mb-0 px-1">
                          No hay consumibles disponibles con stock. Crea uno desde el inventario.
                        </p>
                      }
                    }
                  </div>
                  <div class="grid grid-cols-2 gap-3 mt-2">
                    <app-text-input
                      [control]="item.get('quantity')!"
                      label="Cantidad"
                      icon="cube-outline"
                      type="number"
                      placeholder="1"
                    ></app-text-input>
                    <app-text-input
                      [control]="item.get('unitPrice')!"
                      label="Precio unitario"
                      icon="cash-outline"
                      placeholder="0.00"
                      [mask]="priceMask"
                    ></app-text-input>
                  </div>
                  <div class="flex justify-end mt-2">
                    <button
                      type="button"
                      class="remove-btn"
                      (click)="removeItem(i)"
                    >
                      <ion-icon
                        name="trash-outline"
                        class="text-[16px]"
                      ></ion-icon>
                    </button>
                  </div>
                </div>
              }
            </div>

            <button type="button" class="add-item-btn" (click)="addItem()">
              <ion-icon name="add-outline" class="text-[16px]"></ion-icon>
              Agregar ítem
            </button>

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mt-4 mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-5">
              <app-auth-button
                [label]="isEdit() ? 'ACTUALIZAR ORDEN' : 'CREAR ORDEN'"
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/service-orders"
                class="inline-flex items-center justify-center h-13 px-6 border-2 border-(--app-border) text-(--app-text-muted) text-sm font-bold rounded-xl no-underline transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-(--app-text) cancel-link"
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
export class ServiceOrderFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(ServiceOrderService);
  private readonly vehicleService = inject(VehicleService);
  private readonly serviceService = inject(ServiceService);
  private readonly consumableService = inject(ConsumableService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingOrder = signal(false);
  readonly vehicleOptions = signal<SelectOption[]>([]);
  readonly serviceOptions = signal<SelectOption[]>([]);
  readonly consumableOptions = signal<SelectOption[]>([]);
  readonly selectedClientName = signal('');
  private orderId: number | null = null;
  private skipAutoFill = false;

  readonly priceMask = priceMask;
  readonly kmMask = kmMask;

  readonly daysPerWeekMask: MaskitoOptions = {
    mask: [/[1-7]/],
    preprocessors: [
      ({ elementState, data }) => ({
        elementState,
        data: data.replace(/\D/g, '').replace(/0/g, '').replace(/[8-9]/g, ''),
      }),
    ],
  };

  readonly itemTypeOptions: SelectOption[] = [
    { value: 'Service', label: 'Servicio' },
    { value: 'Consumable', label: 'Consumible' },
  ];

  form = this.fb.group({
    vehicleId: [0, Validators.required],
    currentKm: ['', Validators.required],
    estimatedDailyKm: [''],
    daysPerWeek: [''],
    date: [this.todayString(), Validators.required],
    notes: [''],
    items: this.fb.array([]),
  });

  readonly weeklyKmText = computed(() => {
    const rawDaily = this.form.get('estimatedDailyKm')?.value;
    const rawDays = this.form.get('daysPerWeek')?.value;
    const daily = parseInt(String(rawDaily ?? '').replace(/\./g, ''), 10);
    const days = parseInt(String(rawDays ?? ''), 10);
    if (daily > 0 && days > 0) {
      return `Uso semanal estimado: ~${(daily * days).toLocaleString()} km`;
    }
    if ((rawDaily && rawDaily !== '') || (rawDays && rawDays !== '')) {
      return 'Completa ambos campos para calcular el uso semanal';
    }
    return '';
  });

  readonly weeklyKmValid = computed(() => {
    const rawDaily = this.form.get('estimatedDailyKm')?.value;
    const rawDays = this.form.get('daysPerWeek')?.value;
    const daily = parseInt(String(rawDaily ?? '').replace(/\./g, ''), 10);
    const days = parseInt(String(rawDays ?? ''), 10);
    return daily > 0 && days > 0;
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  constructor() {
    addIcons({ addOutline, arrowBackOutline, calendarOutline, carOutline, cashOutline, constructOutline, cubeOutline, documentTextOutline, peopleOutline, speedometerOutline, swapHorizontalOutline, trashOutline, waterOutline });
  }

  private todayString(): string {
    const d = new Date();
    return d.toISOString().substring(0, 10);
  }

  ngOnInit() {
    this.loadVehicles();
    this.loadServices();
    this.loadConsumables();

    this.form.get('vehicleId')?.valueChanges.subscribe((id) => {
      const v = this.vehicleService.vehicles().find((v) => v.id === id);
      this.selectedClientName.set(v?.clientName ?? '');
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.orderId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Orden');
      this.pageTitle.subtitle.set('Modifica la orden de servicio');
      this.loadOrder();
    } else {
      this.addItem();
      this.pageTitle.title.set('Nueva Orden de Servicio');
      this.pageTitle.subtitle.set('Registra una nueva orden de servicio');
    }
  }

  private loadVehicles() {
    this.vehicleService.loadAll().subscribe({
      next: () => {
        this.vehicleOptions.set(
          this.vehicleService.vehicles().map((v) => ({
            value: v.id,
            label: `${v.brand} ${v.model} (${v.licensePlate})`,
          })),
        );
      },
    });
  }

  private loadServices() {
    this.serviceService.loadAll().subscribe({
      next: () => {
        this.serviceOptions.set(
          this.serviceService.services().map((s) => ({
            value: s.id,
            label: s.name,
          })),
        );
      },
    });
  }

  private loadConsumables() {
    this.consumableService.loadAll().subscribe({
      next: () => {
        this.consumableOptions.set(
          this.consumableService
            .consumables()
            .filter((c) => c.stockQuantity > 0)
            .map((c) => ({
              value: c.id,
              label: `${c.name} (stock: ${c.stockQuantity})`,
            })),
        );
      },
    });
  }

  private loadOrder() {
    if (!this.orderId) return;
    this.loadingOrder.set(true);
    this.orderService.getById(this.orderId).subscribe({
      next: (order) => {
        this.skipAutoFill = true;
        this.items.clear();
        for (const item of order.items) {
          this.items.push(
            this.createItemGroup(
              item.type,
              item.serviceId ?? null,
              item.consumableId ?? null,
              item.quantity,
              item.unitPrice,
            ),
          );
        }
        this.skipAutoFill = false;
        this.form.patchValue({
          vehicleId: order.vehicleId,
          currentKm: order.currentKm.toString(),
          estimatedDailyKm: order.estimatedDailyKm?.toString() ?? '',
          daysPerWeek: order.daysPerWeek?.toString() ?? '',
          date: order.date.substring(0, 10),
          notes: order.notes ?? '',
        });
        this.selectedClientName.set(order.clientName);
        this.loadingOrder.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loadingOrder.set(false);
      },
    });
  }

  private createItemGroup(
    type: 'Service' | 'Consumable' = 'Service',
    serviceId: number | null = null,
    consumableId: number | null = null,
    quantity: number = 1,
    unitPrice: number = 0,
  ) {
    const group = this.fb.group({
      type: [type, Validators.required],
      serviceId: [null as number | null],
      consumableId: [null as number | null],
      quantity: [quantity, [Validators.required, Validators.min(1)]],
      unitPrice: [unitPrice.toFixed(2), Validators.required],
    });

    if (type === 'Service') {
      group.get('serviceId')!.setValidators(Validators.required);
    } else {
      group.get('consumableId')!.setValidators(Validators.required);
    }

    group.get('serviceId')!.valueChanges.subscribe((id) => {
      if (!id || this.skipAutoFill) return;
      const service = this.serviceService.services().find((s) => s.id === id);
      if (service && !group.get('unitPrice')!.dirty) {
        group.get('unitPrice')!.setValue(service.defaultPrice.toFixed(2));
        queueMicrotask(() => group.get('unitPrice')!.updateValueAndValidity());
      }
    });

    group.get('consumableId')!.valueChanges.subscribe((id) => {
      if (!id || this.skipAutoFill) return;
      const consumable = this.consumableService
        .consumables()
        .find((c) => c.id === id);
      if (consumable && !group.get('unitPrice')!.dirty) {
        group.get('unitPrice')!.setValue(consumable.unitPrice.toFixed(2));
        queueMicrotask(() => group.get('unitPrice')!.updateValueAndValidity());
      }
      const qtyControl = group.get('quantity')!;
      if (consumable && consumable.stockQuantity > 0) {
        qtyControl.setValidators([Validators.required, Validators.min(1), Validators.max(consumable.stockQuantity)]);
      } else {
        qtyControl.setValidators([Validators.required, Validators.min(1)]);
      }
      qtyControl.updateValueAndValidity();
    });

    group.get('type')!.valueChanges.subscribe((t) => {
      group.get('unitPrice')!.markAsPristine();
      queueMicrotask(() => {
        if (t === 'Service') {
          group.get('serviceId')!.setValidators(Validators.required);
          group.get('consumableId')!.clearValidators();
          group.get('consumableId')!.setValue(null);
          group.get('quantity')!.setValidators([Validators.required, Validators.min(1)]);
        } else {
          group.get('consumableId')!.setValidators(Validators.required);
          group.get('serviceId')!.clearValidators();
          group.get('serviceId')!.setValue(null);
          const consumableId = group.get('consumableId')!.value;
          if (consumableId) {
            const consumable = this.consumableService.consumables().find(c => c.id === consumableId);
            if (consumable && consumable.stockQuantity > 0) {
              group.get('quantity')!.setValidators([Validators.required, Validators.min(1), Validators.max(consumable.stockQuantity)]);
            }
          }
        }
        group.get('serviceId')!.updateValueAndValidity();
        group.get('consumableId')!.updateValueAndValidity();
        group.get('quantity')!.updateValueAndValidity();
      });
    });

    return group;
  }

  addItem() {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    const items = this.items.value.map((item: any) => {
      const rawPrice = item.unitPrice;
      return {
        type: item.type,
        ...(item.type === 'Service'
          ? {
              serviceId: item.serviceId,
              consumableId: item.consumableId ?? undefined,
            }
          : { consumableId: item.consumableId }),
        quantity: item.quantity,
        unitPrice: parseFloat(
          String(rawPrice).replace?.(/\./g, '').replace(',', '.') ?? rawPrice,
        ),
      };
    });

    const vehicle = this.vehicleService
      .vehicles()
      .find((v) => v.id === this.form.value.vehicleId);
    const request = {
      vehicleId: this.form.value.vehicleId!,
      clientId: vehicle?.clientId ?? 0,
      currentKm:
        parseInt((this.form.value.currentKm ?? '').replace(/\./g, ''), 10) || 0,
      estimatedDailyKm: this.form.value.estimatedDailyKm
        ? parseInt(this.form.value.estimatedDailyKm.replace(/\./g, ''), 10)
        : undefined,
      daysPerWeek: this.form.value.daysPerWeek
        ? parseInt(this.form.value.daysPerWeek, 10)
        : undefined,
      notes: this.form.value.notes || undefined,
      items,
    };

    const action =
      this.isEdit() && this.orderId
        ? this.orderService.update(this.orderId, request)
        : this.orderService.create(request);

    action.subscribe({
      next: () => this.router.navigate(['/service-orders']),
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
