import { Component, Input, signal, inject } from '@angular/core';
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
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  phonePortraitOutline,
  businessOutline,
  cashOutline,
  closeOutline,
  checkmarkCircleOutline,
  calendarOutline,
  peopleOutline,
  carOutline,
} from 'ionicons/icons';
import { ServiceOrderResponse } from '../../core/models/service-order.model';

@Component({
  selector: 'app-payment-detail-modal',
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
    IonSpinner,
  ],
  styles: `
    :host {
      --modal-accent: #22c55e;
      --modal-accent-bg: rgba(34, 197, 94, 0.12);
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

    .success-banner {
      text-align: center;
      padding: 24px 20px 16px;
    }
    .success-banner ion-icon {
      font-size: 48px;
      color: var(--modal-accent);
      margin-bottom: 8px;
    }
    .success-banner .title {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }
    .success-banner .subtitle {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 4px;
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
      color: #fff;
      letter-spacing: -0.02em;
      margin-top: 2px;
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
    .detail-value .method-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
    }
    .method-tag.PagoMovil {
      background: rgba(96, 165, 250, 0.15);
      color: #60a5fa;
    }
    .method-tag.Transferencia {
      background: rgba(167, 139, 250, 0.15);
      color: #a78bfa;
    }
    .method-tag.EfectivoDolares {
      background: rgba(74, 222, 128, 0.15);
      color: #4ade80;
    }
    .method-tag.EfectivoBolivares {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }

    .bs-amount {
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.02em;
      margin-top: 2px;
    }
    .bs-amount .bs-label {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      margin-right: 4px;
    }
    .usd-equivalent {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 4px;
      letter-spacing: -0.01em;
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
        <ion-title>Detalle del Pago</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="success-banner">
        <ion-icon name="checkmark-circle-outline"></ion-icon>
        <div class="title">Pago Confirmado</div>
        <div class="subtitle">Orden #{{ order.id }}</div>
      </div>

      <div class="amount-section">
        <div class="amount-label">Total cancelado</div>
        @if (isBsPayment) {
          <div class="bs-amount">
            <span class="bs-label">Bs.</span>
            {{ order.amountInBs | number:'1.2-2' }}
          </div>
          <div class="usd-equivalent">≈ {{ order.totalAmount | currency:'USD':'symbol':'1.2-2' }}</div>
        } @else {
          <div class="amount-value">{{ order.totalAmount | currency:'USD':'symbol':'1.2-2' }}</div>
        }
      </div>

      <div class="detail-list">
        <div class="detail-row">
          <span class="detail-label">
            <ion-icon name="cash-outline"></ion-icon>
            Método de pago
          </span>
          <span class="detail-value">
            <span class="method-tag" [class]="order.paymentMethod">
              {{ methodLabel }}
            </span>
          </span>
        </div>

        @if (order.operationNumber) {
          <div class="detail-row">
            <span class="detail-label">
              <ion-icon name="business-outline"></ion-icon>
              N° de operación
            </span>
            <span class="detail-value">{{ order.operationNumber }}</span>
          </div>
        }

        @if (order.operationDate) {
          <div class="detail-row">
            <span class="detail-label">
              <ion-icon name="calendar-outline"></ion-icon>
              Fecha de pago
            </span>
            <span class="detail-value">{{ order.operationDate | date:'dd/MM/yyyy' }}</span>
          </div>
        }

        <div class="detail-row">
          <span class="detail-label">
            <ion-icon name="people-outline"></ion-icon>
            Cliente
          </span>
          <span class="detail-value">{{ order.clientName }}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">
            <ion-icon name="car-outline"></ion-icon>
            Vehículo
          </span>
          <span class="detail-value">{{ order.vehicleInfo }}</span>
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
export class PaymentDetailModalComponent {
  @Input() order!: ServiceOrderResponse;

  private readonly modalCtrl = inject(ModalController);

  readonly methodLabels: Record<string, string> = {
    PagoMovil: 'Pago Móvil',
    Transferencia: 'Transferencia Bancaria',
    EfectivoDolares: 'Efectivo Dólares',
    EfectivoBolivares: 'Efectivo Bolívares',
  };

  constructor() {
    addIcons({
      phonePortraitOutline,
      businessOutline,
      cashOutline,
      closeOutline,
      checkmarkCircleOutline,
      calendarOutline,
      peopleOutline,
      carOutline,
    });
  }

  get isBsPayment(): boolean {
    return this.order.paymentMethod === 'PagoMovil'
      || this.order.paymentMethod === 'Transferencia'
      || this.order.paymentMethod === 'EfectivoBolivares';
  }

  get methodLabel(): string {
    return this.order.paymentMethod
      ? this.methodLabels[this.order.paymentMethod] ?? this.order.paymentMethod
      : '—';
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
