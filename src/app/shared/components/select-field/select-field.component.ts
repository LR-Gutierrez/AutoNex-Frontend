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
  styles: `
    :host {
      --select-bg: rgba(255, 255, 255, 0.05);
      --select-border: rgba(255, 255, 255, 0.1);
      --select-focus-bg: rgba(255, 255, 255, 0.08);
      --select-focus-border: rgba(211, 29, 29, 0.5);
      --select-focus-shadow: 0 0 0 3px rgba(211, 29, 29, 0.1);
      --select-icon: rgba(255, 255, 255, 0.5);
      --select-placeholder: rgba(255, 255, 255, 0.4);
      --select-error: #ff6b6b;
    }
  `,
  template: `
    <div class="mb-5 opacity-0 transition-opacity duration-[600ms] [&.revealed]:opacity-100" [appReveal]="revealDelay">
      @if (label) {
        <label class="block text-(--app-text-muted) text-[13px] mb-1.5 ml-1">{{ label }}</label>
      }
      <div
        class="flex items-center bg-[var(--select-bg)] border border-[var(--select-border)] rounded-[12px] transition-all duration-300 focus-within:bg-[var(--select-focus-bg)] focus-within:border-[var(--select-focus-border)] focus-within:shadow-[var(--select-focus-shadow)]"
        [class.pl-4]="!!icon"
      >
        @if (icon) {
          <ion-icon [name]="icon" class="text-[20px] text-[var(--select-icon)] mr-3 shrink-0"></ion-icon>
        }
        <ion-select
          [formControl]="control"
          [placeholder]="placeholder"
          [interface]="interface"
          [cancelText]="cancelText"
          [okText]="okText"
          class="w-full"
          style="--padding-start: 16px; --padding-end: 16px; --color: var(--app-text); --placeholder-color: var(--select-placeholder)"
        >
          @for (opt of options; track opt.value) {
            <ion-select-option [value]="opt.value">{{ opt.label }}</ion-select-option>
          }
        </ion-select>
      </div>
      @if (control.invalid && (control.dirty || control.touched)) {
        <div class="text-xs text-[var(--select-error)] mt-1.5 ml-4">
          @for (msg of activeErrors; track msg; let i = $index) {
            @if (i > 0) { <span class="mx-1">•</span> }
            <span>{{ msg }}</span>
          }
        </div>
      }
    </div>
  `,
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
