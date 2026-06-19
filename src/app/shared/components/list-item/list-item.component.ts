import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [RouterLink, IonIcon],
  styles: `
    :host {
      display: block;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--app-border);
      border-radius: 1rem;
      padding: 1.125rem 1.125rem 0;
      transition: all 0.2s ease;
      min-width: 0;
    }
    .card:hover {
      background: rgba(255, 255, 255, 0.03);
    }
    .action-btn {
      background: transparent !important;
      transition:
        background-color 0.18s ease,
        color 0.18s ease;
    }
    .action-btn:hover {
      background: rgba(255, 255, 255, 0.06) !important;
      color: var(--app-text) !important;
    }
    .action-btn--danger:hover {
      background: rgba(255, 59, 48, 0.15) !important;
      color: #ff5a52 !important;
    }
  `,
  template: `
    <div class="card">
      <div class="flex items-center justify-between gap-3 overflow-hidden pb-[1.125rem]">
        <div class="min-w-0 flex-1">
          <ng-content></ng-content>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <ng-content select="[actions]"></ng-content>
          @if (!hideEdit && editLink) {
            <a
              [routerLink]="editLink"
              class="flex items-center justify-center w-9 h-9 rounded-[10px] text-(--app-text-muted) transition-all duration-200 action-btn"
            >
              <ion-icon name="create-outline" class="text-[18px]"></ion-icon>
            </a>
          }
          @if (!hideDelete) {
            <button
              (click)="confirmDelete()"
              class="flex items-center justify-center w-9 h-9 rounded-[10px] text-(--app-text-muted) transition-all duration-200 cursor-pointer border-none action-btn"
            >
              <ion-icon name="trash-outline" class="text-[18px]"></ion-icon>
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class ListItemComponent {
  private readonly alertController = inject(AlertController);

  @Input({ required: true }) editLink!: any[] | null;
  @Input() deleteMessage = '';
  @Input() hideEdit = false;
  @Input() hideDelete = false;

  @Output() deleteConfirm = new EventEmitter<void>();

  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: this.deleteMessage || '¿Eliminar este elemento? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => this.deleteConfirm.emit(),
        },
      ],
    });
    await alert.present();
  }
}
