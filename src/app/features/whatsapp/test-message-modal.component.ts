import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonFooter, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, closeOutline, callOutline, chatboxEllipsesOutline } from 'ionicons/icons';
import type { MaskitoOptions } from '@maskito/core';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { TextareaFieldComponent } from '../../shared/components/textarea-field/textarea-field.component';
import { WaNotifierService } from '../../core/services/wa-notifier.service';

@Component({
  selector: 'app-test-message-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonFooter, IonIcon,
    TextInputComponent, TextareaFieldComponent,
  ],
  styles: `
    ion-header ion-toolbar {
      --background: var(--app-surface);
      --color: var(--app-text);
      --border-color: transparent;
      --padding-start: 12px;
    }
    ion-title {
      padding-left: 8px;
      font-size: 17px;
      font-weight: 700;
    }
    ion-footer ion-toolbar {
      --background: var(--app-surface);
      --border-color: var(--app-border);
      padding: 4px 16px;
    }
    ion-content { --background: var(--app-bg); }

    .modal-body { padding: 20px; }

    .hint {
      font-size: 12px;
      color: var(--app-text-muted);
      margin: -12px 4px 16px;
      opacity: 0.6;
    }
  `,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Probar Envío WhatsApp</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cancel()">
            <ion-icon slot="icon-only" name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="modal-body">
        <app-text-input
          label="Teléfono"
          placeholder="Ej: 584241620546"
          icon="call-outline"
          [control]="phoneControl"
          [mask]="phoneMask"
        ></app-text-input>
        <p class="hint">Solo dígitos, sin + ni espacios. Ej: 584241620546</p>

        <app-textarea-field
          label="Mensaje"
          placeholder="Escribe tu mensaje..."
          icon="chatbox-ellipses-outline"
          [control]="messageControl"
          [rows]="4"
          [autoGrow]="true"
        ></app-textarea-field>
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
            color="success"
            (click)="send()"
            [disabled]="sending() || phoneControl.invalid || messageControl.invalid"
          >
            <ion-icon slot="start" name="send-outline"></ion-icon>
            {{ sending() ? 'Enviando...' : 'Enviar' }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
})
export class TestMessageModalComponent {
  private readonly modalCtrl = inject(ModalController);
  private readonly toastCtrl = inject(ToastController);
  private readonly waNotifier = inject(WaNotifierService);

  readonly phoneMask: MaskitoOptions = {
    mask: ({ value }) => value.split('').map(() => /\d/),
    preprocessors: [
      ({ elementState, data }) => ({
        elementState,
        data: data.replace(/\D/g, ''),
      }),
    ],
    postprocessors: [
      ({ value, selection }) => ({
        value: value.replace(/\D/g, '').slice(0, 15),
        selection,
      }),
    ],
  };

  readonly sending = signal(false);

  readonly phoneControl = new FormControl('', {
    validators: [Validators.required, Validators.minLength(10)],
    nonNullable: true,
  });
  readonly messageControl = new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });

  constructor() {
    addIcons({ sendOutline, closeOutline, callOutline, chatboxEllipsesOutline });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  async send() {
    if (this.phoneControl.invalid || this.messageControl.invalid || this.sending()) return;

    this.sending.set(true);
    this.waNotifier.testSend(this.phoneControl.value, this.messageControl.value).subscribe({
      next: (res) => {
        this.sending.set(false);
        this.modalCtrl.dismiss({
          queued: true,
          messageId: res.messageId,
          logId: res.logId,
          phone: this.phoneControl.value,
          message: this.messageControl.value,
        });
      },
      error: async (err) => {
        this.sending.set(false);
        await (await this.toastCtrl.create({
          message: err.error?.message || 'Error al enviar mensaje',
          duration: 3000,
          color: 'danger',
          position: 'bottom',
        })).present();
      },
    });
  }
}
