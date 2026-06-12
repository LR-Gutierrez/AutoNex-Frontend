import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <ion-badge [color]="color" [style.--padding]="'4px 8px'">
      {{ label }}
    </ion-badge>
  `,
})
export class StatusBadgeComponent {
  @Input() label = '';
  @Input() color: string = 'medium';
}
