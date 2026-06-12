import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IonIcon],
  template: `
    <div class="flex flex-col items-center justify-center py-16">
      <ion-icon [name]="icon" class="text-6xl" color="medium"></ion-icon>
      <p class="text-gray-500 mt-4">{{ message }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'folder-open-outline';
  @Input() message = 'No se encontraron resultados';

  constructor() {
    addIcons(allIcons);
  }
}
