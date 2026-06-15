import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonIcon } from '@ionic/angular/standalone';
import { MaskitoDirective } from '@maskito/angular';
import type { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonInput,
    IonIcon,
    MaskitoDirective,
    RevealDirective,
  ],
  styles: `
    :host {
      --input-bg: rgba(255, 255, 255, 0.05);
      --input-border: rgba(255, 255, 255, 0.1);
      --input-focus-bg: rgba(255, 255, 255, 0.08);
      --input-focus-border: rgba(211, 29, 29, 0.5);
      --input-focus-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
      --input-icon: rgba(255, 255, 255, 0.5);
      --input-icon-hover: rgba(255, 255, 255, 0.8);
      --input-placeholder: rgba(255, 255, 255, 0.4);
      --input-error: #ff6b6b;
    }
  `,
  template: `
    <div
      class="mb-5 opacity-0 transition-opacity duration-[600ms] [&.revealed]:opacity-100"
      [appReveal]="revealDelay"
    >
      @if (label) {
        <label class="block text-(--app-text-muted) text-[13px] mb-1.5 ml-1">{{
          label
        }}</label>
      }
      <div
        class="flex items-center bg-[var(--input-bg)] border border-[var(--input-border)] rounded-[12px] px-4 transition-all duration-300 focus-within:bg-[var(--input-focus-bg)] focus-within:border-[var(--input-focus-border)] focus-within:shadow-[var(--input-focus-shadow)]"
        [class.pr-2]="showPasswordToggle"
      >
        @if (icon) {
          <ion-icon
            [name]="icon"
            class="text-[20px] text-[var(--input-icon)] mr-3 shrink-0"
          ></ion-icon>
        }
        <ion-input
          [type]="effectiveType"
          [formControl]="control"
          [placeholder]="placeholder"
          [maskito]="mask"
          [maskitoElement]="maskitoPredicate"
          [maxlength]="maxlength"
          class="flex-1 text-[15px]"
          style="--background: transparent; --color: var(--app-text); --placeholder-color: var(--input-placeholder); --padding-start: 0; --padding-end: 0"
        ></ion-input>
        @if (showPasswordToggle) {
          <ion-icon
            [name]="isPasswordVisible ? 'eye-off-outline' : 'eye-outline'"
            class="text-[20px] text-[var(--input-icon)] cursor-pointer shrink-0 transition-colors duration-300 hover:text-[var(--input-icon-hover)]"
            (click)="togglePassword()"
          ></ion-icon>
        }
      </div>
      @if (control.invalid && (control.dirty || control.touched)) {
        <div class="text-xs text-[var(--input-error)] mt-1.5 ml-4">
          @for (msg of activeErrors; track msg; let i = $index) {
            @if (i > 0) {
              <span class="mx-1">•</span>
            }
            <span>{{ msg }}</span>
          }
        </div>
      }
    </div>
  `,
})
export class TextInputComponent {
  @Input({ required: true }) control!: any;
  @Input() label = '';
  @Input() icon = '';
  @Input() maxlength: string | number | null = null;
  @Input() type:
    | 'text'
    | 'email'
    | 'password'
    | 'tel'
    | 'url'
    | 'number'
    | 'search'
    | 'time' = 'text';
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
          msgs.push(
            msg.replace('{n}', this.control.errors[key].requiredLength),
          );
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
