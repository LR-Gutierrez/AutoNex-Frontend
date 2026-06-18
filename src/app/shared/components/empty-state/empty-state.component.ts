import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { folderOpenOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IonIcon],
  styles: `
    :host {
      display: block;
    }

    .empty-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.4;
    }

    .empty-message {
      color: var(--app-text-muted);
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      margin: 0;
    }
  `,
  template: `
    <div class="empty-wrap">
      <ion-icon [name]="icon" class="empty-icon"></ion-icon>
      <p class="empty-message">{{ message }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'folder-open-outline';
  @Input() message = 'No se encontraron resultados';

  constructor() {
    addIcons({ folderOpenOutline });
  }
}
