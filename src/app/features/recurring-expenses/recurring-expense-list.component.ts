import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, createOutline } from 'ionicons/icons';
import { RecurringExpenseService } from '../../core/services/recurring-expense.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RecurringExpenseResponse } from '../../core/models/recurring-expense.model';

@Component({
  selector: 'app-recurring-expense-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, IonIcon],
  styles: `
    :host {
      display: block;
    }
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .create-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #dc2626;
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }
    .create-btn:hover {
      background: #ef4444;
    }
    .card {
      background: var(--card-bg, linear-gradient(180deg, rgba(30,32,52,0.96), rgba(24,25,42,0.96)));
      border: 1px solid var(--app-border, rgba(255,255,255,0.1));
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 10px;
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .expense-name {
      font-size: 16px;
      font-weight: 700;
    }
    .badge {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 6px;
      font-weight: 600;
    }
    .badge-active {
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
    }
    .badge-inactive {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.4);
    }
    .card-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 13px;
      color: var(--app-text-muted, rgba(255,255,255,0.5));
    }
    .card-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    .icon-btn {
      background: rgba(255, 255, 255, 0.06);
      border: none;
      color: var(--app-text-muted, rgba(255,255,255,0.5));
      cursor: pointer;
      border-radius: 8px;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: var(--app-text);
    }
    .icon-btn--danger:hover {
      background: rgba(255, 59, 48, 0.2);
      color: #ff5a52;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--app-text-muted);
    }
  `,
  template: `
    <div class="p-5 max-md:p-3.5 text-(--app-text) box-border">
      <div class="page-header">
        <div>
          <h1
            class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]"
          >
            Gastos Recurrentes
          </h1>
          <p class="mt-1.5 text-(--app-text-muted) text-sm">
            Administra gastos fijos como servicios básicos y alquiler
          </p>
        </div>
        <a routerLink="/recurring-expenses/new" class="create-btn">
          <ion-icon name="add-outline" class="text-[18px]"></ion-icon>
          Nuevo gasto
        </a>
      </div>

      @if (loading()) {
        <div class="text-center py-8 text-(--app-text-muted) text-sm">
          Cargando gastos recurrentes...
        </div>
      } @else if (expenses().length === 0) {
        <div class="empty-state">
          <p class="text-lg font-semibold mb-1">
            No hay gastos recurrentes
          </p>
          <p class="text-sm">
            Crea tu primer gasto recurrente para empezar
          </p>
        </div>
      } @else {
        @for (expense of expenses(); track expense.id) {
          <div class="card">
            <div class="card-header">
              <span class="expense-name">{{ expense.name }}</span>
              <span
                class="badge"
                [class.badge-active]="expense.isActive"
                [class.badge-inactive]="!expense.isActive"
              >
                {{ expense.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="card-details">
              <span>
                {{ expense.amount | currency : 'USD' : 'symbol' : '1.2-2' }}
              </span>
              <span>
                {{
                  expense.frequency === 'Monthly'
                    ? 'Mensual'
                    : 'Quincenal'
                }}
                - Día {{ expense.dayOfMonth }}
              </span>
              <span>
                {{
                  expense.accountType === 'Bolivares'
                    ? 'Bolívares'
                    : 'Dólares'
                }}
              </span>
              @if (expense.description) {
                <span>{{ expense.description }}</span>
              }
            </div>
            <div class="card-actions">
              <a
                [routerLink]="['/recurring-expenses', expense.id, 'edit']"
                class="icon-btn"
                title="Editar"
              >
                <ion-icon name="create-outline" class="text-[16px]"></ion-icon>
              </a>
              <button
                class="icon-btn icon-btn--danger"
                title="Eliminar"
                (click)="onDelete(expense.id)"
              >
                <ion-icon
                  name="trash-outline"
                  class="text-[16px]"
                ></ion-icon>
              </button>
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class RecurringExpenseListComponent implements OnInit {
  private readonly service = inject(RecurringExpenseService);
  private readonly pageTitle = inject(PageTitleService);

  readonly loading = signal(true);
  readonly expenses = this.service.expenses;

  constructor() {
    addIcons({ addOutline, trashOutline, createOutline });
  }

  ngOnInit() {
    this.pageTitle.title.set('Gastos Recurrentes');
    this.pageTitle.subtitle.set('Administra gastos fijos como servicios básicos y alquiler');
    this.service.loadAll().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  onDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar este gasto recurrente?')) return;
    this.service.delete(id).subscribe(() => this.service.loadAll().subscribe());
  }
}
