import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonDatetime } from '@ionic/angular/standalone';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-datetime-field',
  standalone: true,
  imports: [ReactiveFormsModule, IonDatetime, RevealDirective],
  template: `
    <div class="field-group" [appReveal]="revealDelay">
      @if (label) {
        <label class="field-label">{{ label }}</label>
      }
      <ion-datetime
        [formControl]="control"
        [locale]="locale"
        [presentation]="presentation"
        [hourCycle]="hourCycle"
        [preferWheel]="preferWheel"
        size="cover"
      ></ion-datetime>
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

      ion-datetime {
        --background: rgba(255, 255, 255, 0.05);
        --color: white;
        --placeholder-color: rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
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

        ion-datetime {
          --background: white;
          --color: #1a1a2e;
          --placeholder-color: rgba(0, 0, 0, 0.5);
          border-color: rgba(0, 0, 0, 0.18);
        }
      }
    `,
  ],
})
export class DatetimeFieldComponent {
  @Input({ required: true }) control!: any;
  @Input() label = '';
  @Input() locale = 'es-ES';
  @Input() presentation: 'date' | 'date-time' | 'time' | 'month' | 'year' =
    'date-time';
  @Input() hourCycle: 'h11' | 'h12' | 'h23' | 'h24' = 'h12';
  @Input() preferWheel = false;
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
