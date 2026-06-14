import { Component, Input } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [IonButton, IonIcon, RevealDirective],
  template: `
    <ion-button
      expand="block"
      type="submit"
      class="auth-button"
      [appReveal]="revealDelay"
      [disabled]="disabled || loading"
    >
      {{ loading ? loadingLabel || 'PROCESANDO...' : label }}
      @if (icon && !loading) {
        <ion-icon slot="end" [name]="icon"></ion-icon>
      }
    </ion-button>
  `,
  styles: [
    `
    .auth-button {
      opacity: 0;
      transition: opacity 0.6s ease-out;

      &.revealed {
        opacity: 1;
      }

      --background: linear-gradient(135deg, #d31d1d 0%, #a01515 100%);
      --background-hover: linear-gradient(135deg, #e02020 0%, #b01818 100%);
      --border-radius: 12px;
      --box-shadow: 0 4px 16px rgba(211, 29, 29, 0.4);
      height: 52px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 1px;
      margin-top: 8px;
      margin-bottom: 16px;
      text-transform: uppercase;
      transition: all 0.3s ease;

      &:hover:not(.button-disabled) {
        --box-shadow: 0 6px 20px rgba(211, 29, 29, 0.6);
        transform: translateY(-2px);
      }

      &.button-disabled {
        --background: rgba(255, 255, 255, 0.1);
        --color: rgba(255, 255, 255, 0.3);
        --box-shadow: none;
      }

      ion-icon {
        margin-left: 8px;
      }
    }

    @media (prefers-color-scheme: light) {
      .auth-button {
        &.button-disabled {
          --background: rgba(0, 0, 0, 0.08);
          --color: rgba(0, 0, 0, 0.25);
        }
      }
    }
    `,
  ],
})
export class AuthButtonComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() loadingLabel?: string;
  @Input() revealDelay = 200;
}
