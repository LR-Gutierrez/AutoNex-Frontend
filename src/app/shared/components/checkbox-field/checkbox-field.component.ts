import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonCheckbox, IonIcon } from '@ionic/angular/standalone';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-checkbox-field',
  standalone: true,
  imports: [ReactiveFormsModule, IonCheckbox, IonIcon, RevealDirective],
  template: `
    <div class="field-group" [appReveal]="revealDelay">
      <div class="checkbox-row">
        <ion-checkbox
          [formControl]="control"
          [color]="color"
        >
          {{ label }}
        </ion-checkbox>
        @if (icon) {
          <ion-icon [name]="icon" class="field-icon"></ion-icon>
        }
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

    .checkbox-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      transition: all 0.3s ease;

      &:focus-within {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(211, 29, 29, 0.5);
        box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
      }

      ion-checkbox {
        --background: rgba(255, 255, 255, 0.1);
        --background-checked: rgba(211, 29, 29, 0.8);
        --border-color: rgba(255, 255, 255, 0.3);
        --border-color-checked: rgba(211, 29, 29, 0.8);
        --checkmark-color: white;
        --size: 22px;
        flex: 1;
      }

      ion-icon.field-icon {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.5);
        flex-shrink: 0;
        margin-left: 12px;
      }
    }

    .error-message {
      font-size: 12px;
      color: #ff6b6b;
      margin-top: 6px;
      margin-left: 16px;
    }

    @media (prefers-color-scheme: light) {
      .checkbox-row {
        background: white;
        border-color: rgba(0, 0, 0, 0.18);

        &:focus-within {
          background: white;
          border-color: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
        }

        ion-checkbox {
          --background: rgba(0, 0, 0, 0.05);
          --border-color: rgba(0, 0, 0, 0.2);
        }

        ion-icon.field-icon {
          color: rgba(0, 0, 0, 0.7);
        }
      }
    }
    `,
  ],
})
export class CheckboxFieldComponent {
  @Input({ required: true }) control!: any;
  @Input() label = '';
  @Input() icon = '';
  @Input() color = 'danger';
  @Input() revealDelay = 200;

  @Input() errorMessages: Record<string, string> = {};

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
