import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
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
import {
  trendingUpOutline,
  trendingDownOutline,
  cashOutline,
  closeOutline,
  calendarOutline,
  personOutline,
  pricetagOutline,
  swapHorizontalOutline,
  documentTextOutline,
} from 'ionicons/icons';
import { FinancialRecordResponse } from '../../core/models/financial-record.model';

@Component({
  selector: 'app-financial-record-detail-modal',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonIcon,
    IonFooter,
  ],
  styles: `
    :host {
      --modal-accent: #6366f1;
      --modal-accent-bg: rgba(99, 102, 241, 0.12);
      --modal-card-bg: rgba(255, 255, 255, 0.04);
      --modal-card-border: rgba(255, 255, 255, 0.1);
    }

    ion-header ion-toolbar {
      --background: rgba(18, 19, 32, 0.98);
      --border-color: transparent;
    }
    ion-footer ion-toolbar {
      --background: rgba(18, 19, 32, 0.98);
      --border-color: var(--modal-card-border);
      padding: 4px 16px;
    }
    ion-content {
      --background: rgba(14, 15, 26, 0.98);
    }

    .type-banner {
      text-align: center;
      padding: 24px 20px 16px;
    }
    .type-banner ion-icon {
      font-size: 48px;
      margin-bottom: 8px;
    }
    .type-banner .title {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }
    .type-banner .subtitle {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 4px;
    }
    .type-banner.income ion-icon,
    .type-banner.income .title {
      color: #4ade80;
    }
    .type-banner.expense ion-icon,
    .type-banner.expense .title {
      color: #fb7185;
    }

    .amount-section {
      text-align: center;
      padding: 0 20px 20px;
      border-bottom: 1px solid var(--modal-card-border);
      margin-bottom: 16px;
    }
    .amount-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: rgba(255, 255, 255, 0.4);
    }
    .amount-value {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-top: 2px;
    }
    .amount-value.income {
      color: #4ade80;
    }
    .amount-value.expense {
      color: #fb7185;
    }
    .bs-amount {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 4px;
    }
    .bs-amount ion-icon {
      vertical-align: middle;
      font-size: 14px;
      margin-right: 2px;
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
      background: var(--modal-card-bg);
      border: 1px solid var(--modal-card-border);
      border-radius: 12px;
    }
    .detail-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
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
      color: #fff;
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
          <ion-button (click)="dismiss()" color="light">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Detalle del Registro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="type-banner" [class.income]="record.type === 'Income'" [class.expense]="record.type === 'Expense'">
        <ion-icon [name]="record.type === 'Income' ? 'trending-up-outline' : 'trending-down-outline'"></ion-icon>
        <div class="title">{{ record.type === 'Income' ? 'Ingreso' : 'Egreso' }}</div>
        <div class="subtitle">Registro #{{ record.id }}</div>
      </div>

      <div class="amount-section">
        <div class="amount-label">Monto</div>
        <div class="amount-value" [class.income]="record.type === 'Income'" [class.expense]="record.type === 'Expense'">
          {{ record.type === 'Income' ? '+' : '-' }}{{ record.amount | currency:'USD':'symbol':'1.2-2' }}
        </div>
        @if (record.amountBs != null) {
          <div class="bs-amount">
            <ion-icon name="swap-horizontal-outline"></ion-icon>
            Bs. {{ record.amountBs | number:'1.2-2' }}
          </div>
        }
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

  readonly categoryLabels: Record<string, string> = {
    Services: 'Servicios',
    Suppliers: 'Proveedores',
    Rent: 'Alquiler',
    Payroll: 'Nómina',
    Utilities: 'Servicios Públicos',
    Other: 'Otros',
  };

  constructor() {
    addIcons({
      trendingUpOutline,
      trendingDownOutline,
      cashOutline,
      closeOutline,
      calendarOutline,
      personOutline,
      pricetagOutline,
      swapHorizontalOutline,
      documentTextOutline,
    });
  }

  get categoryLabel(): string {
    return this.categoryLabels[this.record.category] ?? this.record.category;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
