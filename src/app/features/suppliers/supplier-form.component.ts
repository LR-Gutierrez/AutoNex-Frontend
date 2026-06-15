import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { SupplierService } from '../../core/services/supplier.service';
import { PageTitleService } from '../../core/services/page-title.service';
import type { MaskitoOptions } from '@maskito/core';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonIcon,
    TextInputComponent,
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
            routerLink="/suppliers"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {{ isEdit() ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{
                isEdit()
                  ? 'Modifica los datos del proveedor'
                  : 'Registra un nuevo proveedor en el sistema'
              }}
            </p>
          </div>
        </div>
      </section>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingSupplier()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando datos del proveedor...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-text-input
              [control]="form.get('name')!"
              label="Nombre del proveedor"
              icon="business-outline"
              placeholder="Nombre de la empresa"
            ></app-text-input>

            <app-text-input
              [control]="form.get('contactPerson')!"
              label="Persona de contacto"
              icon="person-outline"
              placeholder="Nombre del contacto"
            ></app-text-input>

            <app-text-input
              [control]="form.get('phone')!"
              label="Teléfono"
              icon="call-outline"
              type="tel"
              placeholder="(0412) 123-4567"
              [mask]="phoneMask"
            ></app-text-input>

            <app-text-input
              [control]="form.get('email')!"
              label="Correo electrónico"
              icon="mail-outline"
              type="email"
              placeholder="proveedor@correo.com"
            ></app-text-input>

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-2">
              <app-auth-button
                [label]="isEdit() ? 'ACTUALIZAR PROVEEDOR' : 'CREAR PROVEEDOR'"
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/suppliers"
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
export class SupplierFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly supplierService = inject(SupplierService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingSupplier = signal(false);
  private supplierId: number | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    contactPerson: [''],
    phone: [''],
    email: [''],
  });

  readonly phoneMask: MaskitoOptions = {
    mask: [
      '(',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  };

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.supplierId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Proveedor');
      this.pageTitle.subtitle.set('Modifica los datos del proveedor');
      this.loadSupplier();
    } else {
      this.pageTitle.title.set('Nuevo Proveedor');
      this.pageTitle.subtitle.set('Registra un nuevo proveedor en el sistema');
    }
  }

  private loadSupplier() {
    if (!this.supplierId) return;
    this.loadingSupplier.set(true);
    this.supplierService.getById(this.supplierId).subscribe({
      next: (supplier) => {
        this.form.patchValue({
          name: supplier.name,
          contactPerson: supplier.contactPerson ?? '',
          phone: supplier.phone ?? '',
          email: supplier.email ?? '',
        });
        this.loadingSupplier.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loadingSupplier.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    const request = {
      name: this.form.value.name!,
      contactPerson: this.form.value.contactPerson || undefined,
      phone: this.form.value.phone || undefined,
      email: this.form.value.email || undefined,
    };

    const action =
      this.isEdit() && this.supplierId
        ? this.supplierService.update(this.supplierId, request)
        : this.supplierService.create(request);

    action.subscribe({
      next: () => this.router.navigate(['/suppliers']),
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
