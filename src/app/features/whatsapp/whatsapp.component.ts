import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalController, ToastController } from '@ionic/angular';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logoWhatsapp,
  refreshOutline,
  logOutOutline,
  sendOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import {
  WaNotifierService,
  WaMessageLog,
} from '../../core/services/wa-notifier.service';
import { SignalRService } from '../../core/services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-whatsapp',
  standalone: true,
  imports: [IonIcon, IonButton, DatePipe],
  styles: `
    :host {
      display: block;
    }
    .page-shell {
      padding: 20px;
      max-width: 640px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .page-header {
      margin-bottom: 24px;
    }
    .page-header h1 {
      margin: 0;
      font-size: 34px;
      line-height: 1.1;
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .page-header p {
      margin: 6px 0 0;
      color: var(--app-text-muted);
      font-size: 14px;
    }

    .wa-card {
      background: linear-gradient(
        180deg,
        rgba(30, 32, 52, 0.96),
        rgba(24, 25, 42, 0.96)
      );
      border: 1px solid var(--app-border);
      border-radius: 18px;
      padding: 40px 32px;
      text-align: center;
    }

    .wa-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-bottom: 8px;
    }

    .wa-icon {
      font-size: 40px;
      color: #25d366;
      flex-shrink: 0;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 700;
    }
    .status-badge.ready {
      background: rgba(52, 211, 153, 0.1);
      color: #4ade80;
      border: 1px solid rgba(52, 211, 153, 0.3);
    }
    .status-badge.qr {
      background: rgba(250, 204, 21, 0.1);
      color: #facc15;
      border: 1px solid rgba(250, 204, 21, 0.3);
    }
    .status-badge.initializing,
    .status-badge.disconnected {
      background: rgba(156, 163, 175, 0.1);
      color: #9ca3af;
      border: 1px solid rgba(156, 163, 175, 0.3);
    }
    .status-badge.error {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }
    .status-dot.ready {
      background: #4ade80;
      box-shadow: 0 0 6px rgba(52, 211, 153, 0.5);
    }
    .status-dot.qr {
      background: #facc15;
      box-shadow: 0 0 6px rgba(250, 204, 21, 0.5);
      animation: pulse-dot 1.5s ease-in-out infinite;
    }
    .status-dot.initializing {
      background: #9ca3af;
    }
    .status-dot.disconnected {
      background: #9ca3af;
    }
    .status-dot.error {
      background: #ef4444;
    }

    @keyframes pulse-dot {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
    }

    .qr-container {
      background: white;
      border-radius: 12px;
      padding: 16px;
      display: inline-block;
      margin: 16px 0;
    }
    .qr-container img {
      width: 256px;
      height: 256px;
      display: block;
    }
    .qr-hint {
      font-size: 13px;
      color: var(--app-text-muted);
      margin-top: 8px;
      line-height: 1.5;
    }

    .status-message {
      color: var(--app-text-muted);
      font-size: 14px;
      margin: 24px 0;
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 24px;
      flex-wrap: wrap;
    }

    /* Logs section */
    .logs-section {
      margin-top: 32px;
    }
    .logs-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .logs-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
    }
    .logs-header .badge-total {
      font-size: 12px;
      padding: 2px 10px;
      border-radius: 100px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--app-text-muted);
    }

    .logs-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .logs-table thead th {
      text-align: left;
      padding: 8px 10px;
      color: var(--app-text-muted);
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .logs-table tbody td {
      padding: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: top;
    }
    .logs-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .type-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .type-badge.test {
      background: rgba(59, 130, 246, 0.12);
      color: #60a5fa;
    }
    .type-badge.reminder {
      background: rgba(168, 85, 247, 0.12);
      color: #c084fc;
    }

    .status-icon {
      font-size: 16px;
    }
    .status-icon.success {
      color: #4ade80;
    }
    .status-icon.fail {
      color: #ef4444;
    }

    .msg-cell {
      max-width: 220px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .logs-empty {
      text-align: center;
      padding: 32px 0;
      color: var(--app-text-muted);
      font-size: 13px;
    }

    .logs-card {
      background: linear-gradient(
        180deg,
        rgba(30, 32, 52, 0.96),
        rgba(24, 25, 42, 0.96)
      );
      border: 1px solid var(--app-border);
      border-radius: 18px;
      padding: 24px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .logs-card table {
      min-width: 100%;
      white-space: nowrap;
    }
    .logs-card table th,
    .logs-card table td {
      white-space: nowrap;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 16px 0 0;
      font-size: 13px;
      color: var(--app-text-muted);
    }
    .page-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 6px 14px;
      color: var(--app-text);
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .page-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
    .page-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .page-info {
      white-space: nowrap;
    }
  `,
  template: `
    <div class="page-shell">
      <div class="page-header">
        <h1>WhatsApp</h1>
        <p>Gestión de la conexión WhatsApp</p>
      </div>

      <div class="wa-card">
        <div class="wa-header">
          <ion-icon name="logo-whatsapp" class="wa-icon"></ion-icon>

          <div
            class="status-badge"
            [class.ready]="status() === 'ready'"
            [class.qr]="status() === 'qr'"
            [class.initializing]="status() === 'initializing'"
            [class.disconnected]="status() === 'disconnected'"
            [class.error]="status() === 'error'"
          >
            <span
              class="status-dot"
              [class.ready]="status() === 'ready'"
              [class.qr]="status() === 'qr'"
              [class.initializing]="status() === 'initializing'"
              [class.disconnected]="status() === 'disconnected'"
              [class.error]="status() === 'error'"
            ></span>
            {{ statusLabel() }}
          </div>
        </div>

        @if (status() === 'qr' && qrDataUrl(); as qr) {
          <div class="qr-container">
            <img [src]="qr" alt="Código QR de WhatsApp" />
          </div>
          <p class="qr-hint">
            Escanea este código con WhatsApp en tu teléfono.<br />
            Ve a <strong>Ajustes &gt; Dispositivos vinculados</strong> y escanea
            el código.
          </p>
        } @else {
          <p class="status-message">
            @if (status() === 'initializing') {
              Inicializando cliente de WhatsApp...
            } @else if (status() === 'ready') {
              Conectado y listo para enviar mensajes.
            } @else if (status() === 'disconnected') {
              Sesión cerrada. Presiona <strong>Reiniciar</strong> para
              reconectar.
            } @else if (status() === 'error') {
              Error de autenticación. Presiona <strong>Reiniciar</strong> para
              reconectar.
            }
          </p>
        }

        <div class="actions">
          <ion-button
            fill="outline"
            color="danger"
            (click)="logout()"
            [disabled]="status() !== 'ready' && status() !== 'qr'"
          >
            <ion-icon slot="start" name="log-out-outline"></ion-icon>
            Cerrar Sesión
          </ion-button>
          <ion-button
            fill="outline"
            color="success"
            (click)="openTestModal()"
            [disabled]="status() !== 'ready'"
          >
            <ion-icon slot="start" name="send-outline"></ion-icon>
            Probar Envío
          </ion-button>
          <ion-button
            fill="solid"
            color="primary"
            (click)="restart()"
            [disabled]="restarting()"
          >
            <ion-icon slot="start" name="refresh-outline"></ion-icon>
            Reiniciar
          </ion-button>
        </div>

        @if (lastChecked()) {
          <p class="text-xs text-(--app-text-muted) mt-4 opacity-60">
            Última actualización: {{ lastChecked() | date: 'HH:mm:ss' }}
          </p>
        }
      </div>

      <!-- Logs Section -->
      <div class="logs-section">
        <div class="logs-header">
          <h2>Historial de mensajes</h2>
          @if (logsTotal(); as total) {
            <span class="badge-total">{{ total }} envíos</span>
          }
        </div>

        <div class="logs-card">
          @if (logs().length === 0) {
            <div class="logs-empty">No hay mensajes enviados todavía.</div>
          } @else {
            <table class="logs-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Teléfono</th>
                  <th>Mensaje</th>
                  <th>Tipo</th>
                  <th>Enviado por</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                @for (log of logs(); track log.id) {
                  <tr>
                    <td>{{ log.id }}</td>
                    <td>{{ log.phone }}</td>
                    <td>
                      <div class="msg-cell" [title]="log.message">
                        {{ log.message }}
                      </div>
                    </td>
                    <td>
                      <span
                        class="type-badge"
                        [class.test]="log.type === 'Test'"
                        [class.reminder]="log.type === 'Reminder'"
                      >
                        {{ log.type === 'Test' ? 'Prueba' : 'Recordatorio' }}
                      </span>
                    </td>
                    <td>{{ log.sentBy }}</td>
                    <td>
                      @if (log.success) {
                        <span class="status-icon success">&#10003;</span>
                      } @else {
                        <span
                          class="status-icon fail"
                          [title]="log.errorMessage ?? ''"
                          >&#10007;</span
                        >
                      }
                    </td>
                    <td>{{ log.createdAt | date: 'dd/MM/yy HH:mm' }}</td>
                  </tr>
                }
              </tbody>
            </table>
            @if (totalPages() > 1) {
              <div class="pagination">
                <button
                  class="page-btn"
                  [disabled]="currentPage() <= 1"
                  (click)="goToPage(currentPage() - 1)"
                >
                  <ion-icon name="chevron-back-outline"></ion-icon>
                  Anterior
                </button>
                <span class="page-info"
                  >Pág {{ currentPage() }} de {{ totalPages() }} ·
                  {{ logsTotal() }} registros</span
                >
                <button
                  class="page-btn"
                  [disabled]="currentPage() >= totalPages()"
                  (click)="goToPage(currentPage() + 1)"
                >
                  Siguiente
                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </button>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class WhatsAppComponent implements OnInit, OnDestroy {
  private readonly waNotifier = inject(WaNotifierService);
  private readonly signalr = inject(SignalRService);
  private readonly modalCtrl = inject(ModalController);
  private readonly toastController = inject(ToastController);

  readonly status = signal<
    'initializing' | 'qr' | 'ready' | 'disconnected' | 'error'
  >('initializing');
  readonly ready = signal(false);
  readonly qrDataUrl = signal<string | null>(null);
  readonly lastChecked = signal<Date | null>(null);
  readonly restarting = signal(false);

  readonly logs = signal<WaMessageLog[]>([]);
  readonly logsTotal = signal(0);
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  private readonly pageSize = 10;

  private subs: Subscription[] = [];

  readonly statusLabel = () => {
    switch (this.status()) {
      case 'ready':
        return 'Conectado';
      case 'qr':
        return 'Esperando escaneo QR';
      case 'initializing':
        return 'Inicializando...';
      case 'disconnected':
        return 'Desconectado';
      case 'error':
        return 'Error de autenticación';
    }
  };

  constructor() {
    addIcons({
      logoWhatsapp,
      refreshOutline,
      logOutOutline,
      sendOutline,
      chevronBackOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit() {
    this.fetchInitial();
    this.connectSignalR();
    this.fetchLogs();
  }

  ngOnDestroy() {
    for (const sub of this.subs) sub.unsubscribe();
    this.signalr.stopConnection('whatsapp');
  }

  private fetchInitial() {
    this.waNotifier.getStatus().subscribe({
      next: (res) => {
        this.status.set(res.status);
        this.ready.set(res.ready);
        this.lastChecked.set(new Date());
      },
    });

    this.waNotifier.getQr().subscribe({
      next: (res) => this.qrDataUrl.set(res.qr),
    });
  }

  private fetchLogs(page?: number) {
    const p = page ?? this.currentPage();
    this.waNotifier.getLogs(p, this.pageSize).subscribe({
      next: (res) => {
        this.logs.set(res.items);
        this.logsTotal.set(res.total);
        this.currentPage.set(res.page);
        this.totalPages.set(res.totalPages);
      },
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.fetchLogs(page);
  }

  private connectSignalR() {
    this.signalr.startConnection('whatsapp');

    this.subs.push(
      this.signalr
        .on<{
          ready: boolean;
          status: 'initializing' | 'qr' | 'ready' | 'disconnected' | 'error';
        }>('whatsapp', 'StatusChanged')
        .subscribe((res) => {
          this.status.set(res.status);
          this.ready.set(res.ready);
          this.lastChecked.set(new Date());
        }),
    );

    this.subs.push(
      this.signalr
        .on<{ qr: string | null }>('whatsapp', 'QrChanged')
        .subscribe((res) => {
          this.qrDataUrl.set(res.qr);
        }),
    );

    this.subs.push(
      this.signalr
        .on<{
          messageId: string;
          success: boolean;
          phone: string;
          error?: string;
        }>('whatsapp', 'MessageSent')
        .subscribe(async (res) => {
          this.fetchLogs(this.currentPage());
          if (res.success) {
            new Audio('/assets/sounds/notification-pop.wav')
              .play()
              .catch(() => {});
          }
          const toast = await this.toastController.create({
            message: res.success
              ? 'Mensaje enviado correctamente'
              : `Error: ${res.error ?? 'no se pudo enviar'}`,
            duration: 4000,
            color: res.success ? 'success' : 'danger',
            position: 'bottom',
          });
          toast.present();
        }),
    );
  }

  async openTestModal() {
    const { TestMessageModalComponent } =
      await import('./test-message-modal.component');
    const modal = await this.modalCtrl.create({
      component: TestMessageModalComponent,
      cssClass: 'test-message-modal',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.['queued']) {
      (
        await this.toastController.create({
          message: 'Mensaje agregado a la cola',
          duration: 3000,
          cssClass: 'toast-info',
          position: 'bottom',
        })
      ).present();
    }
  }

  async logout() {
    this.waNotifier.logout().subscribe({
      next: () => {
        this.status.set('disconnected');
        this.ready.set(false);
        this.qrDataUrl.set(null);
        this.toastController
          .create({
            message: 'Sesión de WhatsApp cerrada',
            duration: 3000,
            color: 'success',
            position: 'bottom',
          })
          .then((t) => t.present());
      },
      error: async () => {
        (
          await this.toastController.create({
            message: 'Error al cerrar sesión',
            duration: 3000,
            color: 'danger',
            position: 'bottom',
          })
        ).present();
      },
    });
  }

  restart() {
    this.restarting.set(true);
    this.waNotifier.restart().subscribe({
      next: () => {
        this.status.set('initializing');
        this.qrDataUrl.set(null);
        this.restarting.set(false);
        this.toastController
          .create({
            message: 'Reiniciando cliente WhatsApp...',
            duration: 3000,
            color: 'tertiary',
            position: 'bottom',
          })
          .then((t) => t.present());
      },
      error: async () => {
        this.restarting.set(false);
        (
          await this.toastController.create({
            message: 'Error al reiniciar',
            duration: 3000,
            color: 'danger',
            position: 'bottom',
          })
        ).present();
      },
    });
  }
}
