import { Component, Input } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [IonButton, IonIcon, RevealDirective],
  styles: `
    :host {
      --btn-disabled-bg: rgba(255, 255, 255, 0.1);
      --btn-disabled-color: rgba(255, 255, 255, 0.3);
    }
  `,
  template: `
    <ion-button
      expand="block"
      type="submit"
      class="opacity-0 transition-opacity duration-[600ms] [&.revealed]:opacity-100 h-[52px] text-base font-semibold tracking-[1px] mt-2 mb-4 uppercase transition-all duration-300 hover:-translate-y-0.5"
      [appReveal]="revealDelay"
      [disabled]="disabled || loading"
      style="--background: linear-gradient(135deg, #d31d1d 0%, #a01515 100%); --background-hover: linear-gradient(135deg, #e02020 0%, #b01818 100%); --border-radius: 12px; --box-shadow: 0 4px 16px rgba(211, 29, 29, 0.4)"
      [style.--box-shadow]="disabled || loading ? 'none' : '0 6px 20px rgba(211, 29, 29, 0.6)'"
      [style.--background]="disabled || loading ? 'var(--btn-disabled-bg)' : 'linear-gradient(135deg, #d31d1d 0%, #a01515 100%)'"
      [style.--color]="disabled || loading ? 'var(--btn-disabled-color)' : 'white'"
    >
      {{ loading ? loadingLabel || 'PROCESANDO...' : label }}
      @if (icon && !loading) {
        <ion-icon slot="end" [name]="icon"></ion-icon>
      }
    </ion-button>
  `,
})
export class AuthButtonComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() loadingLabel?: string;
  @Input() revealDelay = 200;
}
