import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonTextarea, IonIcon } from '@ionic/angular/standalone';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-textarea-field',
  standalone: true,
  imports: [ReactiveFormsModule, IonTextarea, IonIcon, RevealDirective],
  template: `
    <div class="textarea-field" [appReveal]="revealDelay">
      @if (label) {
        <label class="field-label">{{ label }}</label>
      }
      <div class="textarea-wrapper" [style.min-height]="minHeight">
        @if (icon) {
          <ion-icon [name]="icon" class="input-icon"></ion-icon>
        }
        <ion-textarea
          [formControl]="control"
          [placeholder]="placeholder"
          [rows]="rows"
          [autoGrow]="autoGrow"
          [counter]="counter"
          [maxlength]="maxlength"
          [counterFormatter]="counterFormatterFn"
        ></ion-textarea>
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
    .textarea-field {
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

    .textarea-wrapper {
      display: flex;
      align-items: flex-start;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px 16px;
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
        margin-top: 4px;
      }

      ion-textarea {
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

      .textarea-wrapper {
        background: white;
        border-color: rgba(0, 0, 0, 0.18);

        &:focus-within {
          background: white;
          border-color: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
        }

        ion-icon.input-icon {
          color: rgba(0, 0, 0, 0.7);
        }

        ion-textarea {
          --color: #1a1a2e;
          --placeholder-color: rgba(0, 0, 0, 0.5);
        }
      }
    }
    `,
  ],
})
export class TextareaFieldComponent {
  @Input({ required: true }) control!: any;
  @Input() label = '';
  @Input() icon = '';
  @Input() placeholder = '';
  @Input() rows = 2;
  @Input() autoGrow = false;
  @Input() counter = false;
  @Input() maxlength: string | number | null = null;
  @Input() minHeight: string | undefined;
  @Input() revealDelay = 200;

  @Input() errorMessages: Record<string, string> = {
    required: 'Requerido',
    minlength: 'Mínimo {n} caracteres',
  };

  readonly counterFormatterFn = (inputLength: number, maxLength: number): string => {
    if (maxLength > 0) {
      return `${inputLength} / ${maxLength}`;
    }
    return `${inputLength}`;
  };

  get activeErrors(): string[] {
    if (!this.control?.errors) return [];
    const msgs: string[] = [];
    for (const [key, msg] of Object.entries(this.errorMessages)) {
      if (this.control.errors[key]) {
        if (key === 'minlength') {
          msgs.push(msg.replace('{n}', this.control.errors[key].requiredLength));
        } else {
          msgs.push(msg);
        }
      }
    }
    return msgs;
  }
}
