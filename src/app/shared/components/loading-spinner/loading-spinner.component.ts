import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    @if (loading) {
    <div class="loader-container">
      <div class="loader">
        <div class="loader-inner"></div>
      </div>
      @if (message) {
        <p class="loader-text">{{ message }}</p>
      }
    </div>
    }
  `,
})
export class LoadingSpinnerComponent {
  @Input() loading = false;
  @Input() message?: string;
}
