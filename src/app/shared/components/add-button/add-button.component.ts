import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [RouterLink, IonIcon],
  template: `
    <a
      [routerLink]="route"
      class="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#d31d1d] text-[#d31d1d] text-sm font-bold rounded-xl no-underline transition-all duration-300 hover:bg-[#d31d1d] hover:text-white hover:-translate-y-0.5 shrink-0"
    >
      <ion-icon name="add-outline" class="text-[18px]"></ion-icon>
      {{ label }}
    </a>
  `,
})
export class AddButtonComponent {
  @Input({ required: true }) route!: string;
  @Input({ required: true }) label!: string;

  constructor() {
    addIcons({ addOutline });
  }
}
