import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, callOutline, locationOutline, mailOutline, personOutline } from 'ionicons/icons';
import { ClientService } from '../../core/services/client.service';
import { PageTitleService } from '../../core/services/page-title.service';
import type { MaskitoOptions } from '@maskito/core';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';

@Component({
  selector: 'app-client-form',
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
            routerLink="/clients"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {{ isEdit() ? 'Editar Cliente' : 'Nuevo Cliente' }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{
                isEdit()
                  ? 'Modifica los datos del cliente'
                  : 'Registra un nuevo cliente en el sistema'
              }}
            </p>
          </div>
        </div>
      </section>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingClient()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando datos del cliente...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-text-input
              [control]="form.get('fullName')!"
              label="Nombre completo"
              icon="person-outline"
              placeholder="Nombre y apellido"
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
              placeholder="cliente@correo.com"
            ></app-text-input>

            <app-text-input
              [control]="form.get('address')!"
              label="Dirección"
              icon="location-outline"
              placeholder="Dirección física"
            ></app-text-input>

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-2">
              <app-auth-button
                [label]="isEdit() ? 'ACTUALIZAR CLIENTE' : 'CREAR CLIENTE'"
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/clients"
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
export class ClientFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientService = inject(ClientService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingClient = signal(false);
  private clientId: number | null = null;

  form = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    address: [''],
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
    addIcons({ arrowBackOutline, callOutline, locationOutline, mailOutline, personOutline });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clientId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Cliente');
      this.pageTitle.subtitle.set('Modifica los datos del cliente');
      this.loadClient();
    } else {
      this.pageTitle.title.set('Nuevo Cliente');
      this.pageTitle.subtitle.set('Registra un nuevo cliente en el sistema');
    }
  }

  private loadClient() {
    if (!this.clientId) return;
    this.loadingClient.set(true);
    this.clientService.getById(this.clientId).subscribe({
      next: (client) => {
        this.form.patchValue({
          fullName: client.fullName,
          phone: client.phone,
          email: client.email ?? '',
          address: client.address ?? '',
        });
        this.loadingClient.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loadingClient.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    const request = {
      fullName: this.form.value.fullName!,
      phone: this.form.value.phone!,
      email: this.form.value.email || undefined,
      address: this.form.value.address || undefined,
    };

    const action =
      this.isEdit() && this.clientId
        ? this.clientService.update(this.clientId, request)
        : this.clientService.create(request);

    action.subscribe({
      next: () => this.router.navigate(['/clients']),
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
