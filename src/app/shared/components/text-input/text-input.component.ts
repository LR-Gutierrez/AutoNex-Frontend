import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonIcon } from '@ionic/angular/standalone';
import { MaskitoDirective } from '@maskito/angular';
import type { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [ReactiveFormsModule, IonInput, IonIcon, MaskitoDirective, RevealDirective],
  template: `
    <div class="field-group" [appReveal]="revealDelay">
      @if (label) {
        <label class="field-label">{{ label }}</label>
      }
      <div class="input-wrapper" [class.has-password-toggle]="showPasswordToggle">
        @if (icon) {
          <ion-icon [name]="icon" class="input-icon"></ion-icon>
        }
        <ion-input
          [type]="effectiveType"
          [formControl]="control"
          [placeholder]="placeholder"
          [maskito]="mask"
          [maskitoElement]="maskitoPredicate"
        ></ion-input>
        @if (showPasswordToggle) {
          <ion-icon
            [name]="isPasswordVisible ? 'eye-off-outline' : 'eye-outline'"
            class="toggle-password"
            (click)="togglePassword()"
          ></ion-icon>
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

      &.has-password-toggle {
        padding-right: 8px;
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

      .toggle-password {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        flex-shrink: 0;
        transition: color 0.3s ease;

        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .error-message {
      font-size: 12px;
      color: #ff6b6b;
      margin-top: 6px;
      margin-left: 16px;

      span + span {
        &::before {
          content: ' • ';
        }
      }
    }

    @media (prefers-color-scheme: light) {
      .field-label {
        color: rgba(0, 0, 0, 0.6);
      }

      .input-wrapper {
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

        ion-input {
          --color: #1a1a2e;
          --placeholder-color: rgba(0, 0, 0, 0.5);
        }

        .toggle-password {
          color: rgba(0, 0, 0, 0.7);

          &:hover {
            color: rgba(0, 0, 0, 0.7);
          }
        }
      }
    }
    `,
  ],
})
export class TextInputComponent {
  @Input({ required: true }) control!: any;
  @Input() label = '';
  @Input() icon = '';
  @Input() type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'search' | 'time' = 'text';
  @Input() placeholder = '';
  @Input() mask: MaskitoOptions | null = null;
  @Input() showPasswordToggle = false;
  @Input() revealDelay = 200;

  @Input() errorMessages: Record<string, string> = {
    required: 'Requerido',
    invalidEmail: 'Correo inválido',
    minlength: 'Mínimo {n} caracteres',
  };

  isPasswordVisible = false;

  readonly maskitoPredicate: MaskitoElementPredicate = (el: HTMLElement) =>
    (el as any).getInputElement();

  get effectiveType(): string {
    if (this.type === 'password' && this.isPasswordVisible) return 'text';
    return this.type;
  }

  get activeErrors(): string[] {
    if (!this.control?.errors) return [];
    const msgs: string[] = [];
    for (const [key, msg] of Object.entries(this.errorMessages)) {
      if (this.control.errors[key]) {
        if (key === 'minlength') {
          msgs.push(msg.replace('{n}', this.control.errors[key].requiredLength));
        } else if (key === 'invalidPassword') {
          msgs.push(this.control.errors[key].message || msg);
        } else {
          msgs.push(msg);
        }
      }
    }
    return msgs;
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
