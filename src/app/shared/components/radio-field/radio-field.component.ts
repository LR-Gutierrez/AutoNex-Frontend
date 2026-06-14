import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonRadioGroup, IonRadio, IonIcon } from '@ionic/angular/standalone';
import { RevealDirective } from '../../directives/reveal.directive';

export interface RadioOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-radio-field',
  standalone: true,
  imports: [ReactiveFormsModule, IonRadioGroup, IonRadio, IonIcon, RevealDirective],
  template: `
    <div class="field-group" [appReveal]="revealDelay">
      @if (label) {
        <label class="field-label">{{ label }}</label>
      }
      <div class="radio-wrapper" [class.has-icon]="!!icon">
        @if (icon) {
          <ion-icon [name]="icon" class="field-icon"></ion-icon>
        }
        <ion-radio-group [formControl]="control">
          @for (opt of options; track opt.value) {
            <ion-radio
              [value]="opt.value"
              [color]="color"
            >
              {{ opt.label }}
            </ion-radio>
          }
        </ion-radio-group>
      </div>
      @if (control.invalid && (control.dirty || control.touched)) {
        <div class="error-message">
          @for (msg of activeErrors; track msg) {
            <span>{{ msg }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
    .field-group {
      margin-bottom: 20px;
      opacity: 0;
      transition: opacity 0.6s ease-out;

      &.revealed {
        opacity: 1;
      }
    }

    .field-label {
      display: block;
      color: rgba(255, 255, 255, 0.7);
      font-size: 13px;
      margin-bottom: 6px;
      margin-left: 4px;
    }

    .radio-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      transition: all 0.3s ease;

      &:focus-within {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(211, 29, 29, 0.5);
        box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
      }

      ion-icon.field-icon {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 2px;
        flex-shrink: 0;
      }

      ion-radio-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;
      }

      ion-radio {
        --color: rgba(255, 255, 255, 0.5);
        --color-checked: #d31d1d;
      }
    }

    .error-message {
      font-size: 12px;
      color: #ff6b6b;
      margin-top: 6px;
      margin-left: 16px;
    }

    @media (prefers-color-scheme: light) {
      .field-label {
        color: rgba(0, 0, 0, 0.6);
      }

      .radio-wrapper {
        background: white;
        border-color: rgba(0, 0, 0, 0.18);

        &:focus-within {
          background: white;
          border-color: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
        }

        ion-icon.field-icon {
          color: rgba(0, 0, 0, 0.7);
        }

        ion-radio {
          --color: rgba(0, 0, 0, 0.3);
          --color-checked: #d31d1d;
        }
      }
    }
    `,
  ],
})
export class RadioFieldComponent {
  @Input({ required: true }) control!: any;
  @Input() label = '';
  @Input() icon = '';
  @Input() options: RadioOption[] = [];
  @Input() color = 'danger';
  @Input() revealDelay = 200;

  @Input() errorMessages: Record<string, string> = {
    required: 'Requerido',
  };

  get activeErrors(): string[] {
    if (!this.control?.errors) return [];
    const msgs: string[] = [];
    for (const [key, msg] of Object.entries(this.errorMessages)) {
      if (this.control.errors[key]) {
        msgs.push(msg);
      }
    }
    return msgs;
  }
}
