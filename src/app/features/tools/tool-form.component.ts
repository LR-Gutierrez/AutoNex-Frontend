import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import type { MaskitoOptions } from '@maskito/core';
import { ToolService } from '../../core/services/tool.service';
import { ToolCategoryService } from '../../core/services/tool-category.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { SelectFieldComponent, SelectOption } from '../../shared/components/select-field/select-field.component';
import { DateFieldComponent } from '../../shared/components/date-field/date-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';
import { ToolStatus } from '../../core/models/tool.model';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';

@Component({
  selector: 'app-tool-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonIcon,
    TextInputComponent,
    SelectFieldComponent,
    DateFieldComponent,
    AuthButtonComponent,
    EnumLabelPipe,
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
            routerLink="/tools"
            class="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-(--app-text) no-underline"
          >
            <ion-icon name="arrow-back-outline" class="text-[20px]"></ion-icon>
          </a>
          <div>
            <h1
              class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {{ isEdit() ? 'Editar Herramienta' : 'Nueva Herramienta' }}
            </h1>
            <p class="mt-1.5 text-(--app-text-muted) text-sm">
              {{
                isEdit()
                  ? 'Modifica los datos de la herramienta'
                  : 'Registra una nueva herramienta en el taller'
              }}
            </p>
          </div>
        </div>
      </section>

      <div
        class="bg-(--card-bg) border border-(--app-border) rounded-[18px] shadow-(--app-shadow) p-6 max-md:p-4.5 max-w-2xl box-border"
      >
        @if (loadingTool()) {
          <div class="text-center py-8 text-(--app-text-muted) text-sm">
            Cargando datos de la herramienta...
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <app-text-input
              [control]="form.get('name')!"
              label="Nombre"
              icon="build-outline"
              placeholder="Nombre de la herramienta"
            ></app-text-input>

            <app-select-field
              [control]="form.get('toolCategoryId')!"
              label="Categoría"
              icon="folder-outline"
              [options]="categoryOptions()"
              placeholder="Seleccionar categoría"
            ></app-select-field>

            <app-text-input
              [control]="form.get('quantity')!"
              label="Cantidad"
              icon="layers-outline"
              type="text"
              placeholder="1"
              [mask]="numberMask"
            ></app-text-input>

            <app-select-field
              [control]="form.get('status')!"
              label="Estado"
              icon="checkmark-circle-outline"
              [options]="statusOptions"
              placeholder="Seleccionar estado"
            ></app-select-field>

            <app-date-field
              [control]="form.get('purchaseDate')!"
              label="Fecha de compra"
              icon="calendar-outline"
              placeholder="Seleccionar fecha"
            ></app-date-field>

            @if (error()) {
              <div class="text-xs text-[#ff6b6b] mb-4">
                {{ error() }}
              </div>
            }

            <div class="flex items-center gap-3 mt-2">
              <app-auth-button
                [label]="isEdit() ? 'ACTUALIZAR HERRAMIENTA' : 'CREAR HERRAMIENTA'"
                [disabled]="form.invalid || submitting()"
                [loading]="submitting()"
              ></app-auth-button>

              <a
                routerLink="/tools"
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
export class ToolFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toolService = inject(ToolService);
  private readonly toolCategoryService = inject(ToolCategoryService);
  private readonly pageTitle = inject(PageTitleService);

  readonly isEdit = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly loadingTool = signal(false);
  readonly categoryOptions = signal<SelectOption[]>([]);
  private toolId: number | null = null;

  readonly numberMask: MaskitoOptions = {
    mask: ({ value }) => value.split('').map(() => /\d/),
  };

  readonly statusOptions: SelectOption[] = Object.values(ToolStatus).map(
    status => ({
      value: status,
      label: new EnumLabelPipe().transform(status),
    }),
  );

  form = this.fb.group({
    name: ['', Validators.required],
    toolCategoryId: [0, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    status: ['Available', Validators.required],
    purchaseDate: [''],
  });

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    this.loadCategories();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.toolId = Number(idParam);
      this.isEdit.set(true);
      this.pageTitle.title.set('Editar Herramienta');
      this.pageTitle.subtitle.set('Modifica los datos de la herramienta');
      this.loadTool();
    } else {
      this.pageTitle.title.set('Nueva Herramienta');
      this.pageTitle.subtitle.set('Registra una nueva herramienta en el taller');
    }
  }

  private loadCategories() {
    this.toolCategoryService.loadAll().subscribe({
      next: (res) => {
        this.categoryOptions.set(
          res.items.map(cat => ({
            value: cat.id,
            label: cat.name,
          })),
        );
      },
    });
  }

  private loadTool() {
    if (!this.toolId) return;
    this.loadingTool.set(true);
    this.toolService.getById(this.toolId).subscribe({
      next: (tool) => {
        this.form.patchValue({
          name: tool.name,
          toolCategoryId: tool.toolCategoryId,
          quantity: tool.quantity,
          status: tool.status,
          purchaseDate: tool.purchaseDate
            ? tool.purchaseDate.substring(0, 10)
            : '',
        });
        this.loadingTool.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loadingTool.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    const request = {
      name: this.form.value.name!,
      toolCategoryId: this.form.value.toolCategoryId!,
      quantity: this.form.value.quantity!,
      status: this.form.value.status! as ToolStatus,
      purchaseDate: this.form.value.purchaseDate || undefined,
    };

    const action =
      this.isEdit() && this.toolId
        ? this.toolService.update(this.toolId, request)
        : this.toolService.create(request);

    action.subscribe({
      next: () => this.router.navigate(['/tools']),
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
