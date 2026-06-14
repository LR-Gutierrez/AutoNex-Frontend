import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonSelect, IonSelectOption, IonIcon } from '@ionic/angular/standalone';
import { RevealDirective } from '../../directives/reveal.directive';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [ReactiveFormsModule, IonSelect, IonSelectOption, IonIcon, RevealDirective],
  template: `
    <div class="select-field" [appReveal]="revealDelay">
      @if (label) {
        <label class="field-label">{{ label }}</label>
      }
      <div class="input-wrapper" [class.has-icon]="!!icon">
        @if (icon) {
          <ion-icon [name]="icon" class="input-icon"></ion-icon>
        }
        <ion-select
          [formControl]="control"
          [placeholder]="placeholder"
          [interface]="interface"
          [cancelText]="cancelText"
          [okText]="okText"
        >
          @for (opt of options; track opt.value) {
            <ion-select-option [value]="opt.value">{{ opt.label }}</ion-select-option>
          }
        </ion-select>
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
    .select-field {
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

    .input-wrapper {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0;
      transition: all 0.3s ease;

      &:focus-within {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(211, 29, 29, 0.5);
        box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
      }

      &.has-icon {
        padding-left: 16px;
      }

      ion-icon.input-icon {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.5);
        margin-right: 12px;
        flex-shrink: 0;
      }

      ion-select {
        --padding-start: 16px;
        --padding-end: 16px;
        width: 100%;
        --color: white;
        --placeholder-color: rgba(255, 255, 255, 0.4);
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

      .input-wrapper {
        background: white;
        border-color: rgba(0, 0, 0, 0.1);

        &:focus-within {
          background: white;
          border-color: rgba(0, 0, 0, 0.3);
          box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
        }

        ion-icon.input-icon {
          color: rgba(0, 0, 0, 0.4);
        }

        ion-select {
          --color: #1a1a2e;
          --placeholder-color: rgba(0, 0, 0, 0.4);
        }
      }
    }
    `,
  ],
})
export class SelectFieldComponent {
  @Input({ required: true }) control!: any;
  @Input() label = '';
  @Input() icon = '';
  @Input() placeholder = '';
  @Input() options: SelectOption[] = [];
  @Input() interface: 'alert' | 'popover' | 'action-sheet' = 'alert';
  @Input() cancelText = 'Cancelar';
  @Input() okText = 'Aceptar';
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
