import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonIcon } from '@ionic/angular/standalone';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [ReactiveFormsModule, IonInput, IonIcon, RevealDirective],
  template: `
    <div class="date-field" [appReveal]="revealDelay">
      @if (label) {
        <label class="field-label">{{ label }}</label>
      }
      <div class="input-wrapper">
        @if (icon) {
          <ion-icon [name]="icon" class="input-icon"></ion-icon>
        }
        <ion-input
          type="date"
          [formControl]="control"
          [placeholder]="placeholder"
        ></ion-input>
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
    .date-field {
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
      padding: 0 16px;
      transition: all 0.3s ease;

      &:focus-within {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(211, 29, 29, 0.5);
        box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
      }

      ion-icon.input-icon {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.5);
        margin-right: 12px;
        flex-shrink: 0;
      }

      ion-input {
        --background: transparent;
        --color: white;
        --placeholder-color: rgba(255, 255, 255, 0.4);
        --padding-start: 0;
        --padding-end: 0;
        font-size: 15px;
        flex: 1;
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

        ion-input {
          --color: #1a1a2e;
          --placeholder-color: rgba(0, 0, 0, 0.4);
        }
      }
    }
    `,
  ],
})
export class DateFieldComponent {
  @Input({ required: true }) control!: any;
  @Input() label = '';
  @Input() icon = 'calendar-outline';
  @Input() placeholder = '';
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
