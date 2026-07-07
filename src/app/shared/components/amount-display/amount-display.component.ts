import { Component, Input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-amount-display',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  template: `
    @if (amountBs != null) {
      <div class="bs-primary">
        <span class="bs-label">Bs.</span>
        {{ amountBs | number:'1.2-2' }}
      </div>
      <div class="usd-secondary">≈ {{ amount | currency:'USD':'symbol':'1.2-2' }}</div>
    } @else {
      <div class="usd-primary">{{ prefix }}{{ amount | currency:'USD':'symbol':'1.2-2' }}</div>
    }
  `,
  styles: `
    :host {
      display: block;
      text-align: center;
      --amount-primary-color: var(--app-text);
      --amount-primary-size: 28px;
      --amount-secondary-color: var(--app-text-muted);
      --amount-bs-label-color: var(--app-text-muted);
    }

    .usd-primary {
      color: var(--amount-primary-color);
      font-size: var(--amount-primary-size);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-top: 2px;
    }

    .bs-primary {
      color: var(--amount-primary-color);
      font-size: var(--amount-primary-size);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-top: 2px;
    }

    .bs-label {
      color: var(--amount-bs-label-color);
      font-size: 14px;
      font-weight: 600;
      margin-right: 4px;
    }

    .usd-secondary {
      color: var(--amount-secondary-color);
      font-size: 14px;
      font-weight: 500;
      margin-top: 4px;
      letter-spacing: -0.01em;
    }
  `,
})
export class AmountDisplayComponent {
  @Input() amount!: number;
  @Input() amountBs?: number | null;
  @Input() prefix?: string;
}
