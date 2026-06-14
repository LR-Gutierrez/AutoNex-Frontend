import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonRange, IonIcon } from '@ionic/angular/standalone';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-range-field',
  standalone: true,
  imports: [ReactiveFormsModule, IonRange, IonIcon, RevealDirective],
  template: `
    <div class="field-group" [appReveal]="revealDelay">
      @if (label) {
        <label class="field-label">{{ label }}</label>
      }
      <div class="range-wrapper" [class.has-icon]="!!icon">
        @if (icon) {
          <ion-icon [name]="icon" class="field-icon"></ion-icon>
        }
        <ion-range
          [formControl]="control"
          [min]="min"
          [max]="max"
          [step]="step"
          [snaps]="snaps"
          [pin]="pin"
          [ticks]="ticks"
          [color]="color"
        ></ion-range>
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

    .range-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
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

      ion-icon.field-icon {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.5);
        flex-shrink: 0;
      }

      ion-range {
        --bar-background: rgba(255, 255, 255, 0.15);
        --bar-background-active: #d31d1d;
        --knob-background: #d31d1d;
        --pin-background: #d31d1d;
        --pin-color: white;
        flex: 1;
        padding: 0;
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

      .range-wrapper {
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

        ion-range {
          --bar-background: rgba(0, 0, 0, 0.1);
        }
      }
    }
    `,
  ],
})
export class RangeFieldComponent {
  @Input({ required: true }) control!: any;
  @Input() label = '';
  @Input() icon = '';
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() snaps = false;
  @Input() pin = true;
  @Input() ticks = false;
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
