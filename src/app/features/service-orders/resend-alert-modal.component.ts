import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonFooter, IonIcon, IonCheckbox,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, closeOutline, notificationsOutline } from 'ionicons/icons';
import { MileageAlertService } from '../../core/services/mileage-alert.service';
import { AlertPreview } from '../../core/models/mileage-alert.model';

@Component({
  selector: 'app-resend-alert-modal',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonFooter, IonIcon, IonCheckbox,
  ],
  styles: [
    `
      ion-header ion-toolbar {
        --background: rgba(18, 19, 32, 0.98);
        --border-color: transparent;
        --padding-start: 12px;
      }
      ion-title {
        padding-left: 8px;
        font-size: 17px;
        font-weight: 700;
      }
      ion-footer ion-toolbar {
        --background: rgba(18, 19, 32, 0.98);
        --border-color: rgba(255, 255, 255, 0.1);
        padding: 4px 16px;
      }
      ion-content { --background: rgba(14, 15, 26, 0.98); }

      .modal-body { padding: 20px; }

      .select-all {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 4px 16px;
        font-size: 13px;
        font-weight: 600;
        color: var(--app-text-muted);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        margin-bottom: 16px;
        cursor: pointer;
      }

      .alert-card {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
      }

      .alert-card-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        cursor: pointer;
      }

      .alert-card-header h3 {
        margin: 0;
        font-size: 13px;
        font-weight: 700;
        color: var(--app-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .message-preview {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 14px;
        font-size: 13px;
        line-height: 1.6;
        color: var(--app-text);
        white-space: pre-wrap;
        word-break: break-word;
        font-family: var(--ion-font-family);
      }

      .no-alerts {
        text-align: center;
        padding: 40px 20px;
        color: var(--app-text-muted);
        font-size: 14px;
      }

      .no-alerts ion-icon {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.4;
      }
    `,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Reenviar Alerta</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cancel()">
            <ion-icon slot="icon-only" name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="modal-body">
        @if (loading()) {
          <div class="no-alerts">
            <p>Cargando vista previa...</p>
          </div>
        } @else if (error()) {
          <div class="no-alerts">
            <ion-icon name="notifications-outline"></ion-icon>
            <p>{{ error() }}</p>
          </div>
        } @else if (previews().length === 0) {
          <div class="no-alerts">
            <ion-icon name="notifications-outline"></ion-icon>
            <p>No hay alertas activas para esta orden.</p>
          </div>
        } @else {
          <div class="select-all" (click)="toggleSelectAll()">
            <ion-checkbox [checked]="allSelected()" [indeterminate]="someSelected()"></ion-checkbox>
            <span>{{ allSelected() ? 'Deseleccionar todo' : 'Seleccionar todo' }}</span>
          </div>

          @for (preview of previews(); track preview.alertId) {
            <div class="alert-card">
              <div class="alert-card-header" (click)="toggleAlert(preview.alertId)">
                <ion-checkbox [checked]="selectedIds().has(preview.alertId)"></ion-checkbox>
                <h3>{{ preview.serviceName }}</h3>
              </div>
              <div class="message-preview">{{ preview.message }}</div>
            </div>
          }
        }
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button fill="clear" color="medium" (click)="cancel()">
            Cancelar
          </ion-button>
          <ion-button
            fill="solid"
            color="warning"
            (click)="send()"
            [disabled]="sending() || selectedIds().size === 0"
          >
            <ion-icon slot="start" name="send-outline"></ion-icon>
            {{ sending() ? 'Enviando...' : 'Enviar (' + selectedIds().size + ')' }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
})
export class ResendAlertModalComponent implements OnInit {
  orderId!: number;

  private readonly modalCtrl = inject(ModalController);
  private readonly toastCtrl = inject(ToastController);
  private readonly alertService = inject(MileageAlertService);

  readonly loading = signal(true);
  readonly sending = signal(false);
  readonly error = signal<string | null>(null);
  readonly previews = signal<AlertPreview[]>([]);
  readonly selectedIds = signal<Set<number>>(new Set());

  readonly allSelected = computed(() =>
    this.previews().length > 0 && this.selectedIds().size === this.previews().length
  );

  readonly someSelected = computed(() =>
    this.selectedIds().size > 0 && this.selectedIds().size < this.previews().length
  );

  constructor() {
    addIcons({ sendOutline, closeOutline, notificationsOutline });
  }

  ngOnInit() {
    this.loadPreview();
  }

  private loadPreview() {
    this.loading.set(true);
    this.error.set(null);
    this.alertService.alertPreview(this.orderId).subscribe({
      next: (previews) => {
        this.previews.set(previews);
        this.selectedIds.set(new Set(previews.map(p => p.alertId)));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar vista previa');
        this.loading.set(false);
      },
    });
  }

  toggleAlert(alertId: number) {
    const next = new Set(this.selectedIds());
    if (next.has(alertId)) {
      next.delete(alertId);
    } else {
      next.add(alertId);
    }
    this.selectedIds.set(next);
  }

  toggleSelectAll() {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.previews().map(p => p.alertId)));
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  send() {
    if (this.sending() || this.selectedIds().size === 0) return;

    this.sending.set(true);
    const ids = Array.from(this.selectedIds());
    this.alertService.resendAlerts(this.orderId, ids).subscribe({
      next: async (res) => {
        this.sending.set(false);
        await (await this.toastCtrl.create({
          message: `${res.sentCount} notificación(es) reenviada(s)`,
          duration: 3000,
          color: 'success',
          position: 'bottom',
        })).present();
        this.modalCtrl.dismiss({ sent: true });
      },
      error: async (err) => {
        this.sending.set(false);
        await (await this.toastCtrl.create({
          message: err.error?.message || 'Error al reenviar notificaciones',
          duration: 3000,
          color: 'danger',
          position: 'bottom',
        })).present();
      },
    });
  }
}
