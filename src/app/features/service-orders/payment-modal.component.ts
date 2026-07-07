import { Component, Input, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { MaskitoDirective } from '@maskito/angular';
import type { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { priceMask } from '../../shared/masks/price.mask';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
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
  giftOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { ServiceOrderService } from '../../core/services/service-order.service';
import { PayServiceOrderRequest } from '../../core/models/service-order.model';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    DecimalPipe,
    MaskitoDirective,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonInput,
    IonIcon,
    IonFooter,
    IonSpinner,
  ],
  styles: `
    :host {
      --modal-accent: #dc2626;
      --modal-accent-hover: #ef4444;
      --modal-accent-bg: rgba(220, 38, 38, 0.12);
      --modal-input-focus: rgba(220, 38, 38, 0.5);
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
    ion-footer ion-buttons {
      gap: 8px;
    }
    ion-content {
      --background: var(--app-bg);
    }

    .total-section {
      text-align: center;
      padding: 20px 20px 16px;
      border-bottom: 1px solid var(--app-border);
      margin-bottom: 20px;
    }
    .total-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--app-text-muted);
      margin-bottom: 4px;
    }
    .total-amount {
      display: block;
      font-size: 28px;
      font-weight: 700;
      color: var(--app-text);
      letter-spacing: -0.02em;
    }

    .section-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--app-text-muted);
      padding: 0 20px;
      margin-bottom: 10px;
    }

    .method-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding: 0 20px;
    }
    .method-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 16px 10px;
      border-radius: 12px;
      border: 1.5px solid var(--app-border);
      background: var(--app-surface-2);
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .method-card:hover {
      background: var(--app-surface-2);
      border-color: var(--app-text-muted);
      opacity: 0.85;
    }
    .method-card:active {
      transform: scale(0.97);
    }
    .method-card.selected {
      border-color: var(--modal-accent);
      background: var(--modal-accent-bg);
    }
    .method-card ion-icon {
      font-size: 24px;
      color: var(--app-text-muted);
      transition: color 0.2s;
    }
    .method-card.selected ion-icon {
      color: var(--modal-accent);
    }
    .method-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--app-text);
      text-align: center;
      line-height: 1.3;
    }
    .method-desc {
      font-size: 10px;
      color: var(--app-text-muted);
      text-align: center;
      line-height: 1.3;
    }

    .form-section {
      padding: 20px;
    }

    .field-group {
      margin-bottom: 16px;
    }
    .field-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--app-text-muted);
      margin-bottom: 6px;
      margin-left: 2px;
    }
    .field-input {
      --background: var(--app-surface-2);
      --color: var(--app-text);
      --placeholder-color: var(--app-text-muted);
      --padding-start: 16px;
      --padding-end: 16px;
      --border-color: var(--app-border);
      --border-radius: 12px;
      --border-style: solid;
      --border-width: 1.5px;
      --highlight-height: 0;
      --highlight-color-focused: var(--modal-input-focus);
      font-size: 15px;
      height: 48px;
      border-radius: 12px;
    }
    .field-input.input-focused {
      --border-color: var(--modal-input-focus);
    }

    .date-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--app-text-muted);
      margin-bottom: 6px;
      margin-left: 2px;
    }
    .date-input {
      --background: var(--app-surface-2);
      --color: var(--app-text);
      --placeholder-color: var(--app-text-muted);
      --padding-start: 16px;
      --padding-end: 16px;
      --border-color: var(--app-border);
      --border-radius: 12px;
      --border-style: solid;
      --border-width: 1.5px;
      --highlight-height: 0;
      font-size: 15px;
      height: 48px;
      border-radius: 12px;
    }

    .rate-info {
      background: var(--app-surface-2);
      border: 1px solid var(--app-border);
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .rate-label {
      font-size: 12px;
      color: var(--app-text-muted);
    }
    .rate-value {
      font-size: 14px;
      font-weight: 700;
      color: var(--app-text);
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(220, 38, 38, 0.12);
      border: 1px solid rgba(220, 38, 38, 0.3);
      border-radius: 12px;
      padding: 10px 14px;
      margin: 0 20px 16px;
      font-size: 13px;
      color: #f87171;
    }

    .loading-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
  `,
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="cancel()" color="medium">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Cobrar Orden</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Total amount -->
      <div class="total-section">
        <span class="total-label">Total a cobrar</span>
        <span class="total-amount">{{ totalAmount | currency:'USD':'symbol':'1.2-2' }}</span>
      </div>

      <!-- Method selection -->
      <div class="section-label">Método de pago</div>
      <div class="method-grid" role="radiogroup" aria-label="Método de pago">
        @for (m of methods; track m.value) {
          <div
            class="method-card"
            [class.selected]="selectedMethod() === m.value"
            (click)="selectMethod(m.value)"
            (keydown.enter)="selectMethod(m.value)"
            (keydown.space)="selectMethod(m.value); $event.preventDefault()"
            role="radio"
            [attr.aria-checked]="selectedMethod() === m.value"
            tabindex="0"
          >
            <ion-icon [name]="m.icon"></ion-icon>
            <span class="method-label">{{ m.label }}</span>
            <span class="method-desc">{{ m.desc }}</span>
          </div>
        }
      </div>

      <!-- Form fields -->
      @if (selectedMethod(); as method) {
        <div class="form-section">
          <!-- Pago Móvil / Transferencia (monto en Bs.) -->
          @if (method === 'PagoMovil' || method === 'Transferencia') {
            @if (bsRate(); as rate) {
              <div class="rate-info">
                <span class="rate-label">Tasa BCV</span>
                <span class="rate-value">Bs. {{ rate | number:'1.2-2' }} / USD</span>
              </div>
            } @else if (loading()) {
              <div class="rate-info">
                <span class="rate-label">Cargando tasa...</span>
                <ion-spinner name="crescent" style="width:18px;height:18px"></ion-spinner>
              </div>
            }
            <div class="field-group">
              <label class="field-label" for="amountBsPm">Monto en Bs.</label>
              <ion-input
                id="amountBsPm"
                class="field-input"
                type="text"
                inputmode="decimal"
                placeholder="0,00"
                [(ngModel)]="amountBs"
                [maskito]="priceMask"
                [maskitoElement]="maskitoPredicate"
                [attr.aria-label]="'Monto en Bolívares'"
                readonly
              ></ion-input>
            </div>
            <div class="field-group">
              <label class="field-label" for="operationNumber">Número de operación</label>
              <ion-input
                id="operationNumber"
                class="field-input"
                type="text"
                placeholder="Ej: 012345"
                [(ngModel)]="operationNumber"
                [attr.aria-label]="'Número de operación'"
              ></ion-input>
            </div>
            <div class="field-group">
              <label class="field-label" for="operationDatePm">Fecha de pago</label>
              <ion-input
                id="operationDatePm"
                class="field-input date-input"
                type="date"
                [(ngModel)]="operationDate"
                [attr.aria-label]="'Fecha de pago'"
              ></ion-input>
            </div>
          }

          <!-- Efectivo Dólares (solo referencia en USD) -->
          @if (method === 'EfectivoDolares') {
            <div class="field-group">
              <label class="field-label" for="amountUsdEd">Total en USD</label>
              <ion-input
                id="amountUsdEd"
                class="field-input"
                type="text"
                inputmode="decimal"
                placeholder="0,00"
                [(ngModel)]="amountUsd"
                [maskito]="priceMask"
                [maskitoElement]="maskitoPredicate"
                [attr.aria-label]="'Total en USD'"
                readonly
              ></ion-input>
            </div>
            <div class="field-group">
              <label class="field-label" for="operationDateEd">Fecha de pago</label>
              <ion-input
                id="operationDateEd"
                class="field-input date-input"
                type="date"
                [(ngModel)]="operationDate"
                [attr.aria-label]="'Fecha de pago'"
              ></ion-input>
            </div>
          }

          <!-- Gratis -->
          @if (method === 'Gratis') {
            <p style="text-align:center;padding:24px 0;color:var(--app-text-muted);font-size:14px;">
              <ion-icon name="checkmark-circle-outline" style="font-size:32px;display:block;margin:0 auto 8px;color:var(--modal-accent)"></ion-icon>
              La orden se marcará como pagada sin costo.
            </p>
          }

          <!-- Efectivo Bolívares -->
          @if (method === 'EfectivoBolivares') {
            @if (bsRate(); as rate) {
              <div class="rate-info">
                <span class="rate-label">Tasa BCV</span>
                <span class="rate-value">Bs. {{ rate | number:'1.2-2' }} / USD</span>
              </div>
            } @else if (loading()) {
              <div class="rate-info">
                <span class="rate-label">Cargando tasa...</span>
                <ion-spinner name="crescent" style="width:18px;height:18px"></ion-spinner>
              </div>
            }
            <div class="field-group">
              <label class="field-label" for="amountBsEb">Monto en Bs.</label>
              <ion-input
                id="amountBsEb"
                class="field-input"
                type="text"
                inputmode="decimal"
                placeholder="0,00"
                [(ngModel)]="amountBs"
                [maskito]="priceMask"
                [maskitoElement]="maskitoPredicate"
                [attr.aria-label]="'Monto en Bolívares'"
                readonly
              ></ion-input>
            </div>
            <div class="field-group">
              <label class="field-label" for="operationDateEb">Fecha de pago</label>
              <ion-input
                id="operationDateEb"
                class="field-input date-input"
                type="date"
                [(ngModel)]="operationDate"
                [attr.aria-label]="'Fecha de pago'"
              ></ion-input>
            </div>
          }
        </div>
      }

      <!-- Error message -->
      @if (error(); as err) {
        <div class="error-msg" role="alert">
          <ion-icon name="close-outline" style="font-size:16px;flex-shrink:0"></ion-icon>
          <span>{{ err }}</span>
        </div>
      }
    </ion-content>

    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" (click)="cancel()" [disabled]="saving()">
            Cancelar
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button
            color="danger"
            [disabled]="!selectedMethod() || saving()"
            (click)="confirm()"
          >
            @if (saving()) {
              <div class="loading-overlay">
                <ion-spinner name="crescent" style="width:18px;height:18px"></ion-spinner>
                <span>Procesando...</span>
              </div>
            } @else {
              <span>Confirmar Pago</span>
            }
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
})
export class PaymentModalComponent {
  @Input() orderId: number = 0;
  @Input() totalAmount: number = 0;

  readonly priceMask = priceMask;
  readonly maskitoPredicate: MaskitoElementPredicate = (el) =>
    (el as any).getInputElement();

  private readonly modalCtrl = inject(ModalController);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly orderService = inject(ServiceOrderService);

  readonly selectedMethod = signal<string | null>(null);
  readonly bsRate = signal<number | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  today = new Date().toISOString().substring(0, 10);

  amountUsd = '';
  amountBs = '';
  operationNumber = '';
  operationDate = this.today;

  readonly methods = [
    { value: 'PagoMovil', label: 'Pago Móvil', icon: 'phone-portrait-outline', desc: 'Vinculado a teléfono, CI o RIF' },
    { value: 'Transferencia', label: 'Transferencia Bancaria', icon: 'business-outline', desc: 'Transferencia desde banco' },
    { value: 'EfectivoDolares', label: 'Efectivo Dólares', icon: 'cash-outline', desc: 'Pago en efectivo en USD' },
    { value: 'EfectivoBolivares', label: 'Efectivo Bolívares', icon: 'cash-outline', desc: 'Pago en efectivo en Bs.' },
    { value: 'Gratis', label: 'Gratis', icon: 'gift-outline', desc: 'Cortesía / $0' },
  ];

  constructor() {
    addIcons({ phonePortraitOutline, businessOutline, cashOutline, closeOutline, giftOutline, checkmarkCircleOutline });
  }

  private formatPrice(value: number): string {
    const [int, dec] = value.toFixed(2).split('.');
    const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedInt},${dec}`;
  }

  selectMethod(value: string) {
    this.selectedMethod.set(value);
    this.error.set(null);
    this.amountUsd = this.formatPrice(this.totalAmount);

    if (value === 'EfectivoDolares') {
      this.amountBs = '';
    } else {
      this.loadBsRate();
    }
  }

  private loadBsRate() {
    this.loading.set(true);
    this.bsRate.set(null);
    this.exchangeRateService.getCurrentUsd().subscribe({
      next: (rate) => {
        this.bsRate.set(rate.value);
        this.amountBs = this.formatPrice(this.totalAmount * rate.value);
        this.loading.set(false);
      },
      error: () => {
        this.bsRate.set(null);
        this.amountBs = '';
        this.loading.set(false);
      },
    });
  }

  private parsePrice(value: string): number {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const method = this.selectedMethod();
    if (!method) return;

    if (method === 'Gratis') {
      // no fields required
    } else if (method === 'PagoMovil' || method === 'Transferencia') {
      if (!this.amountBs || this.parsePrice(this.amountBs) <= 0 || !this.operationNumber?.trim() || !this.operationDate) {
        this.error.set('Completa todos los campos requeridos');
        return;
      }
    } else if (method === 'EfectivoDolares') {
      if (!this.amountUsd || this.parsePrice(this.amountUsd) <= 0) {
        this.error.set('Ingresa un monto válido en USD');
        return;
      }
    } else if (method === 'EfectivoBolivares') {
      if (!this.amountBs || this.parsePrice(this.amountBs) <= 0) {
        this.error.set('Ingresa un monto válido en Bs.');
        return;
      }
    }

    this.saving.set(true);
    this.error.set(null);

    const request: PayServiceOrderRequest = {
      paymentMethod: method as PayServiceOrderRequest['paymentMethod'],
      operationDate: this.operationDate || undefined,
    };

    if (method === 'PagoMovil' || method === 'Transferencia') {
      request.amountInBs = this.parsePrice(this.amountBs);
      request.operationNumber = this.operationNumber.trim();
    } else if (method === 'EfectivoBolivares') {
      request.amountInBs = this.parsePrice(this.amountBs);
    }

    this.orderService.payOrder(this.orderId, request).subscribe({
      next: () => {
        this.modalCtrl.dismiss({ success: true }, 'confirm');
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Error al procesar el pago. Intenta de nuevo.');
      },
    });
  }
}
