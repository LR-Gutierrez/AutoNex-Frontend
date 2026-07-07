import { Component, inject, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, chevronBackOutline, chevronForwardOutline, checkmarkCircleOutline, alertCircleOutline, timeOutline } from 'ionicons/icons';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { BcvFetchLogResponse, bcvActionKind } from '../../core/models/exchange-rate.model';

@Component({
  selector: 'app-bcv-fetch-log-modal',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonIcon,
  ],
  styles: `
    :host {
      --width: 600px;
      --height: 80vh;
      --max-height: 90vh;
      --border-radius: 18px;
      --modal-accent: #34d399;
      --modal-accent-bg: rgba(52, 211, 153, 0.12);
    }
    ion-header ion-toolbar {
      --background: var(--app-surface);
      --color: var(--app-text);
      --border-color: transparent;
    }
    ion-content {
      --background: var(--app-bg);
    }

    .log-item {
      padding: 16px 20px;
      border-bottom: 1px solid var(--app-border);
    }
    .log-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .log-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .log-icon ion-icon {
      font-size: 15px;
    }
    .log-icon.inserted {
      background: rgba(52, 211, 153, 0.15);
      color: #34d399;
    }
    .log-icon.skipped {
      background: rgba(250, 204, 21, 0.12);
      color: #facc15;
    }
    .log-icon.failed {
      background: rgba(248, 113, 113, 0.15);
      color: #f87171;
    }
    .log-header-text {
      flex: 1;
    }
    .log-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--app-text);
    }
    .log-subtitle {
      font-size: 12px;
      color: var(--app-text-muted);
      margin-top: 1px;
    }
    .log-desc {
      font-size: 13px;
      color: var(--app-text-muted);
      line-height: 1.5;
      margin-top: 2px;
    }
    .log-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 8px;
      padding: 10px 12px;
      background: var(--app-surface-2);
      border-radius: 10px;
      border: 1px solid var(--app-border);
    }
    .log-meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--app-text-muted);
    }
    .log-meta-item ion-icon {
      font-size: 14px;
    }
    .log-meta-item strong {
      color: var(--app-text);
      font-weight: 600;
    }
    .log-error {
      margin-top: 8px;
      padding: 10px 12px;
      background: rgba(248, 113, 113, 0.08);
      border: 1px solid rgba(248, 113, 113, 0.15);
      border-radius: 10px;
      font-size: 12px;
      color: #f87171;
      line-height: 1.5;
    }
    .log-rates {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .rate-chip {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 8px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(52, 211, 153, 0.1);
      color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.2);
    }
    .empty {
      text-align: center;
      padding: 40px 20px;
      color: var(--app-text-muted);
      font-size: 14px;
    }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px;
      border-top: 1px solid var(--app-border);
    }
    .pagination button {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      background: var(--app-surface-2);
      border: 1px solid var(--app-border);
      color: var(--app-text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .pagination button:hover:not(:disabled) {
      color: var(--app-text);
    }
    .pagination button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .pagination span {
      font-size: 13px;
      color: var(--app-text-muted);
    }
  `,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Logs de Sincronización BCV</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      @if (logs().length === 0) {
        <div class="empty">No hay logs registrados</div>
      }

      @for (log of logs(); track log.id) {
        <div class="log-item">
          <div class="log-header">
            <div class="log-icon" [class.inserted]="log.action.endsWith('Inserted')" [class.skipped]="log.action.includes('Skipped')" [class.failed]="log.action.endsWith('Failed')">
              @if (log.action.endsWith('Inserted')) {
                <ion-icon name="checkmark-circle-outline"></ion-icon>
              } @else if (log.action.includes('Skipped')) {
                <ion-icon name="time-outline"></ion-icon>
              } @else {
                <ion-icon name="alert-circle-outline"></ion-icon>
              }
            </div>
            <div class="log-header-text">
              <div class="log-title">{{ title(log) }}</div>
              <div class="log-subtitle">{{ subtitle(log) }}</div>
            </div>
          </div>

          <div class="log-desc">{{ description(log) }}</div>

          <div class="log-meta">
            <span class="log-meta-item">
              <ion-icon name="time-outline"></ion-icon>
              Consulta: <strong>{{ log.fetchedAt | date: 'hh:mm a' }}</strong>
            </span>
            <span class="log-meta-item">
              Fecha BCV: <strong>{{ log.valueDate | date: 'dd/MM/yyyy' }}</strong>
            </span>
            <span class="log-meta-item">
              Origen: <strong>{{ origenLabel(log.fetchedBy) }}</strong>
            </span>
          </div>

          @if (log.error) {
            <div class="log-error">{{ log.error }}</div>
          }

          @if (log.action.endsWith('Inserted') && log.ratesJson) {
            <div class="log-rates">
              @for (r of parsedRates(log); track $index) {
                <span class="rate-chip">{{ r.symbol }} {{ r.value | number:'1.2-2' }} {{ r.code }}</span>
              }
            </div>
          }
        </div>
      }
    </ion-content>

    @if (totalPages > 1) {
      <div class="pagination">
        <button [disabled]="currentPage <= 1" (click)="goToPage(currentPage - 1)">
          <ion-icon name="chevron-back-outline"></ion-icon>
          Anterior
        </button>
        <span>Pág {{ currentPage }} de {{ totalPages }}  ·  {{ totalItems() }} registros</span>
        <button [disabled]="currentPage >= totalPages" (click)="goToPage(currentPage + 1)">
          Siguiente
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </div>
    }
  `,
})
export class BcvFetchLogModalComponent {
  private readonly modalCtrl = inject(ModalController);
  private readonly exchangeRateService = inject(ExchangeRateService);

  readonly logs = signal<BcvFetchLogResponse[]>([]);
  currentPage = 1;
  totalPages = 1;
  readonly totalItems = signal(0);
  private perPage = 20;

  constructor() {
    addIcons({ closeOutline, chevronBackOutline, chevronForwardOutline, checkmarkCircleOutline, alertCircleOutline, timeOutline });
    this.loadLogs();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadLogs();
  }

  private loadLogs() {
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('perPage', this.perPage.toString());

    this.exchangeRateService.getFetchLogs(params).subscribe({
      next: (res) => {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.fetchedAt).getTime() - new Date(a.fetchedAt).getTime(),
        );
        this.logs.set(sorted);
        this.totalPages = Math.ceil(res.total / res.perPage);
        this.totalItems.set(res.total);
      },
    });
  }

  title(log: BcvFetchLogResponse): string {
    const kind = bcvActionKind(log.action);
    switch (kind) {
      case 'Inserted':
        return 'Nuevo boletín creado';
      case 'Skipped_AlreadyPublished':
        return 'BCV sin cambios';
      case 'Skipped_AlreadyDraft':
        return 'Borrador existente';
      case 'Skipped_OutsideWindow':
        return 'Fuera de ventana horaria';
      case 'Failed':
        return 'Error de conexión';
      default:
        return log.action;
    }
  }

  subtitle(log: BcvFetchLogResponse): string {
    const time = this.formatTime(log.fetchedAt);
    const kind = bcvActionKind(log.action);

    if (kind === 'Inserted') {
      if (log.fetchedBy === 'Retry') return `¡El BCV publicó la tasa! Insertado a las ${time}`;
      return `Creado a las ${time}`;
    }
    if (kind === 'Skipped_AlreadyPublished') {
      if (log.fetchedBy === 'Retry') return 'BCV aún sin publicar tasa nueva, reintentando en 10 min';
      return `La consulta de las ${time} no encontró una tasa nueva del BCV`;
    }
    if (kind === 'Skipped_AlreadyDraft') {
      if (log.fetchedBy === 'Retry') return 'BCV aún sin publicar tasa nueva, reintentando en 10 min';
      return `La consulta de las ${time} detectó que ya existe un borrador`;
    }
    if (kind === 'Skipped_OutsideWindow') return 'Fuera de ventana horaria (6pm–11:50pm)';
    if (kind === 'Failed') {
      if (log.fetchedBy === 'Retry') return 'Error de conexión al BCV, reintentando en 10 min';
      return `La consulta de las ${time} falló al conectar con el BCV`;
    }
    return '';
  }

  description(log: BcvFetchLogResponse): string {
    const time = this.formatTime(log.fetchedAt);
    const date = new Date(log.valueDate).toLocaleDateString('es-VE');
    const kind = bcvActionKind(log.action);

    switch (kind) {
      case 'Inserted':
        return `Se realizó la consulta al BCV y se creó un nuevo boletín en estado Borrador con las tasas publicadas para el ${date}.`;
      case 'Skipped_AlreadyPublished':
        return `Se consultó el BCV a las ${time}, pero las tasas del ${date} ya estaban registradas y vigentes en el sistema. El BCV aún no ha publicado la siguiente tasa.`;
      case 'Skipped_AlreadyDraft':
        return `Se consultó el BCV a las ${time}, pero ya existía un borrador en el sistema para las tasas del ${date}.`;
      case 'Skipped_OutsideWindow':
        return `El reintento automático está fuera de la ventana horaria permitida (6:00 PM – 11:50 PM VET).`;
      case 'Failed':
        return `No se pudo completar la consulta al BCV.`;
      default:
        return '';
    }
  }

  origenLabel(fetchedBy: string): string {
    switch (fetchedBy) {
      case 'Auto': return 'Automático';
      case 'Manual': return 'Manual';
      case 'Retry': return 'Reintento';
      default: return fetchedBy;
    }
  }

  private formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  parsedRates(log: BcvFetchLogResponse): { code: string; symbol: string; value: number }[] {
    if (!log.ratesJson) return [];
    try {
      const parsed = JSON.parse(log.ratesJson);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'object') {
        return Object.entries(parsed).map(([code, value]) => ({
          code,
          symbol: code === 'USD' ? '$' : code === 'EUR' ? '€' : '',
          value: Number(value),
        }));
      }
      return [];
    } catch {
      return [];
    }
  }
}
