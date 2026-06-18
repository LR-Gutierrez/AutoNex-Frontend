import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, arrowBackOutline, businessOutline, cashOutline, cubeOutline, pricetagOutline, waterOutline } from 'ionicons/icons';
import { ConsumableService } from '../../core/services/consumable.service';
import { SupplierService } from '../../core/services/supplier.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { SelectFieldComponent, SelectOption } from '../../shared/components/select-field/select-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';
import { ConsumableCategory } from '../../core/models/consumable.model';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';
import { priceMask } from '../../shared/masks/price.mask';
import type { MaskitoOptions } from '@maskito/core';

@Component({
  selector: 'app-consumable-form',
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
  `,
  template: `
    <div class="p-5 max-md:p-3.5 text-(--app-text) box-border">
      <section class="mb-5">
        <div class="flex items-center gap-3 mb-1">
          <a
            routerLink="/consumables"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {{ isEdit() ? 'Editar Consumible' : 'Nuevo Consumible' }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{
                isEdit()
                  ? 'Modifica los datos del consumible'
                  : 'Registra un nuevo consumible en el inventario'
              }}
            </p>
          </div>
        </div>
      </section>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingConsumable()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando datos del consumible...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-text-input
              [control]="form.get('name')!"
              label="Nombre del consumible"
              icon="water-outline"
              placeholder="Ej: Aceite 20W-50"
            ></app-text-input>

            <app-select-field
              [control]="form.get('category')!"
              label="Categoría"
              icon="pricetag-outline"
              placeholder="Selecciona una categoría"
              [options]="categoryOptions"
            ></app-select-field>

            <app-text-input
              [control]="form.get('stockQuantity')!"
              label="Cantidad en stock"
              icon="cube-outline"
              type="number"
              placeholder="0"
            ></app-text-input>

            <app-text-input
              [control]="form.get('minStock')!"
              label="Stock mínimo"
              icon="alert-circle-outline"
              type="number"
              placeholder="0"
            ></app-text-input>

            <app-text-input
              [control]="form.get('unitPrice')!"
              label="Precio unitario"
              icon="cash-outline"
              placeholder="0.00"
              [mask]="priceMask"
            ></app-text-input>

            <app-select-field
              [control]="form.get('supplierId')!"
              label="Proveedor (opcional)"
              icon="business-outline"
              placeholder="Selecciona un proveedor"
              [options]="supplierOptions()"
            ></app-select-field>

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-2">
              <app-auth-button
                [label]="isEdit() ? 'ACTUALIZAR CONSUMIBLE' : 'CREAR CONSUMIBLE'"
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/consumables"
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
export class ConsumableFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly consumableService = inject(ConsumableService);
  private readonly supplierService = inject(SupplierService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingConsumable = signal(false);
  readonly supplierOptions = signal<SelectOption[]>([]);
  private consumableId: number | null = null;

  readonly categoryOptions: SelectOption[] = Object.values(ConsumableCategory).map(
    category => ({
      value: category,
      label: new EnumLabelPipe().transform(category),
    }),
  );

  readonly priceMask = priceMask;

  readonly numberMask: MaskitoOptions = {
    mask: ({ value }) => value.split('').map(() => /\d/),
  };

  form = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    minStock: [0, [Validators.required, Validators.min(0)]],
    unitPrice: ['0.00', Validators.required],
    supplierId: [null as number | null],
  });

  constructor() {
    addIcons({ alertCircleOutline, arrowBackOutline, businessOutline, cashOutline, cubeOutline, pricetagOutline, waterOutline });
  }

  ngOnInit() {
    this.loadSuppliers();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.consumableId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Consumible');
      this.pageTitle.subtitle.set('Modifica los datos del consumible');
      this.loadConsumable();
    } else {
      this.pageTitle.title.set('Nuevo Consumible');
      this.pageTitle.subtitle.set('Registra un nuevo consumible en el inventario');
    }
  }

  private loadSuppliers() {
    this.supplierService.loadAll().subscribe({
      next: () => {
        this.supplierOptions.set(
          this.supplierService.suppliers().map(s => ({
            value: s.id,
            label: s.name,
          })),
        );
      },
    });
  }

  private loadConsumable() {
    if (!this.consumableId) return;
    this.loadingConsumable.set(true);
    this.consumableService.getById(this.consumableId).subscribe({
      next: (item) => {
        this.form.patchValue({
          name: item.name,
          category: item.category,
          stockQuantity: item.stockQuantity,
          minStock: item.minStock,
          unitPrice: item.unitPrice.toFixed(2),
          supplierId: item.supplierId ?? null,
        });
        this.loadingConsumable.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loadingConsumable.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    const rawPrice = this.form.value.unitPrice!;
    const unitPrice = parseFloat(String(rawPrice).replace?.(/\./g, '').replace(',', '.') ?? rawPrice);

    const request = {
      name: this.form.value.name!,
      category: this.form.value.category as ConsumableCategory,
      stockQuantity: this.form.value.stockQuantity ?? 0,
      minStock: this.form.value.minStock ?? 0,
      unitPrice,
      supplierId: this.form.value.supplierId ?? undefined,
    };

    const action =
      this.isEdit() && this.consumableId
        ? this.consumableService.update(this.consumableId, request)
        : this.consumableService.create(request);

    action.subscribe({
      next: () => this.router.navigate(['/consumables']),
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
