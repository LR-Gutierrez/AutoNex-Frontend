import { Component, Input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { walletOutline } from 'ionicons/icons';
import { FinancialRecordResponse } from '../../core/models/financial-record.model';
import { AmountDisplayComponent } from '../../shared/components/amount-display/amount-display.component';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';

@Component({
  selector: 'app-financial-record-detail-modal',
  standalone: true,
  host: { '[class.Expense]': 'record.type === "Expense"' },
  imports: [
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonIcon,
    IonFooter,
    AmountDisplayComponent,
    EnumLabelPipe,
  ],
  styles: `
    :host {
      --modal-accent: #4ade80;
      --modal-accent-bg: rgba(74, 222, 128, 0.12);
    }
    :host.Expense {
      --modal-accent: #fb7185;
      --modal-accent-bg: rgba(251, 113, 133, 0.12);
    }

    ion-header ion-toolbar {
      --background: var(--app-surface);
      --color: var(--app-text);
      --border-color: transparent;
    }
    ion-footer ion-toolbar {
      --background: var(--app-surface);
      --border-color: var(--app-border);
      padding: 4px 16px;
    }
    ion-content {
      --background: var(--app-bg);
    }

    .banner {
      text-align: center;
      padding: 24px 20px 16px;
    }
    .banner ion-icon {
      font-size: 48px;
      color: var(--modal-accent);
      margin-bottom: 8px;
    }
    .banner .title {
      font-size: 18px;
      font-weight: 700;
      color: var(--modal-accent);
    }
    .banner .subtitle {
      font-size: 12px;
      color: var(--app-text-muted);
      margin-top: 4px;
    }

    .amount-section {
      text-align: center;
      padding: 0 20px 20px;
      border-bottom: 1px solid var(--app-border);
      margin-bottom: 16px;
    }
    .amount-section app-amount-display {
      --amount-primary-color: var(--modal-accent);
    }
    .amount-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--app-text-muted);
    }

    .detail-list {
      padding: 0 20px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: var(--app-surface-2);
      border: 1px solid var(--app-border);
      border-radius: 12px;
    }
    .detail-label {
      font-size: 12px;
      color: var(--app-text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .detail-label ion-icon {
      font-size: 16px;
    }
    .detail-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--app-text);
      text-align: right;
    }

    .category-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
    }
    .category-tag.Services {
      background: rgba(96, 165, 250, 0.15);
      color: #60a5fa;
    }
    .category-tag.Suppliers {
      background: rgba(167, 139, 250, 0.15);
      color: #a78bfa;
    }
    .category-tag.Rent {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }
    .category-tag.Payroll {
      background: rgba(74, 222, 128, 0.15);
      color: #4ade80;
    }
    .category-tag.Utilities {
      background: rgba(248, 113, 113, 0.15);
      color: #f87171;
    }
    .category-tag.Other {
      background: rgba(148, 163, 184, 0.15);
      color: #94a3b8;
    }
  `,
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()" color="medium">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Detalle del Registro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="banner">
        @if (record.type === 'Income') {
          <ion-icon name="trending-up-outline"></ion-icon>
        } @else {
          <ion-icon name="trending-down-outline"></ion-icon>
        }
        <div class="title">{{ record.type === 'Income' ? 'Ingreso' : 'Egreso' }}</div>
        <div class="subtitle">Registro #{{ record.id }}</div>
      </div>

      <div class="amount-section">
        <div class="amount-label">Monto</div>
        <app-amount-display
          [amount]="record.amount"
          [amountBs]="record.amountInBs"
          [prefix]="record.type === 'Income' ? '+' : '-'"
        />
      </div>

      <div class="detail-list">
        <div class="detail-row">
          <span class="detail-label">
            <ion-icon name="document-text-outline"></ion-icon>
            Descripción
          </span>
          <span class="detail-value">{{ record.description }}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">
            <ion-icon name="wallet-outline"></ion-icon>
            Cuenta
          </span>
          <span class="detail-value">
            <span [class.text-blue-400]="record.accountType === 'Bolivares'" [class.text-amber-400]="record.accountType === 'Dolares'" class="font-bold">
              {{ record.accountType | enumLabel }}
            </span>
          </span>
        </div>

        <div class="detail-row">
          <span class="detail-label">
            <ion-icon name="pricetag-outline"></ion-icon>
            Categoría
          </span>
          <span class="detail-value">
            <span class="category-tag" [class]="record.category">
              {{ categoryLabel }}
            </span>
          </span>
        </div>

        <div class="detail-row">
          <span class="detail-label">
            <ion-icon name="calendar-outline"></ion-icon>
            Fecha
          </span>
          <span class="detail-value">{{ record.date | date:'dd/MM/yyyy' }}</span>
        </div>

        @if (record.userName) {
          <div class="detail-row">
            <span class="detail-label">
              <ion-icon name="person-outline"></ion-icon>
              Registrado por
            </span>
            <span class="detail-value">{{ record.userName }}</span>
          </div>
        }

        <div class="detail-row">
          <span class="detail-label">
            <ion-icon name="calendar-outline"></ion-icon>
            Creado el
          </span>
          <span class="detail-value">{{ record.createdAt | date:'dd/MM/yyyy hh:mm a' }}</span>
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button color="medium" (click)="dismiss()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
})
export class FinancialRecordDetailModalComponent {
  @Input() record!: FinancialRecordResponse;

  private readonly modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ walletOutline });
  }

  readonly categoryLabels: Record<string, string> = {
    Services: 'Servicios',
    Suppliers: 'Proveedores',
    Rent: 'Alquiler',
    Payroll: 'Nómina',
    Utilities: 'Servicios Públicos',
    Other: 'Otros',
  };

  get categoryLabel(): string {
    return this.categoryLabels[this.record.category] ?? this.record.category;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
