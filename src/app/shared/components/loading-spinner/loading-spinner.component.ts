import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="loader-container" *ngIf="loading">
      <div class="loader">
        <div class="loader-inner"></div>
      </div>
      @if (message) {
        <p class="loader-text">{{ message }}</p>
      }
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() loading = false;
  @Input() message?: string;
}
