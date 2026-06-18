import { Component } from '@angular/core';
import { IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-skeleton',
  standalone: true,
  imports: [IonSkeletonText],
  styles: `
    :host {
      display: block;
    }

    .skeleton-stat-card {
      background: linear-gradient(
        145deg,
        rgba(28, 30, 50, 0.95),
        rgba(20, 22, 40, 0.95)
      );
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 20px;
      min-height: 130px;
      backdrop-filter: blur(12px);
    }

    .skeleton-detail-card {
      background: linear-gradient(
        145deg,
        rgba(28, 30, 50, 0.95),
        rgba(20, 22, 40, 0.95)
      );
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 20px;
      backdrop-filter: blur(12px);
    }

    .skeleton-metric-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 14px;
      padding: 14px;
    }

    .grid-cols-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .grid-cols-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 16px;
    }

    .grid-cols-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(300px, 0.95fr);
      gap: 20px;
    }

    .right-grid {
      display: grid;
      gap: 16px;
    }

    @media (max-width: 1280px) {
      .grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
      }
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .grid-cols-4 {
        grid-template-columns: 1fr;
      }
      .grid-cols-3 {
        grid-template-columns: repeat(3, 1fr);
      }
      .grid-cols-2 {
        grid-template-columns: repeat(2, 1fr);
      }
      .skeleton-stat-card {
        padding: 16px;
        min-height: 110px;
      }
      .skeleton-detail-card {
        padding: 16px;
      }
    }

    @media (max-width: 480px) {
      .skeleton-stat-card {
        padding: 14px;
        min-height: 100px;
      }
    }
  `,
  template: `
    <!-- Stat Cards Skeleton -->
    <div class="grid-cols-4">
      @for (_ of [1, 2, 3, 4]; track $index) {
        <div class="skeleton-stat-card">
          <ion-skeleton-text animated class="w-[45%]! h-3!"></ion-skeleton-text>
          <ion-skeleton-text animated class="w-[35%]! h-12! mt-4"></ion-skeleton-text>
          <ion-skeleton-text animated class="w-[28%]! h-5! mt-3"></ion-skeleton-text>
        </div>
      }
    </div>

    <!-- Detail Sections Skeleton -->
    <div class="detail-grid">
      <!-- Orders Detail Skeleton -->
      <div class="skeleton-detail-card">
        <ion-skeleton-text animated class="w-[40%]! h-5!"></ion-skeleton-text>
        <ion-skeleton-text animated class="w-[55%]! h-3! mt-2"></ion-skeleton-text>

        <div class="grid-cols-3">
          @for (_ of [1, 2, 3]; track $index) {
            <div class="skeleton-metric-box text-center">
              <ion-skeleton-text animated class="w-[40%]! h-6! mx-auto"></ion-skeleton-text>
              <ion-skeleton-text animated class="w-[50%]! h-3! mx-auto mt-2"></ion-skeleton-text>
            </div>
          }
        </div>

        <div class="mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <ion-skeleton-text animated class="w-[35%]! h-4!"></ion-skeleton-text>
          @for (_ of [1, 2]; track $index) {
            <div class="flex items-center justify-between p-3 mt-2 rounded-xl bg-[rgba(255,59,48,0.06)] border border-[rgba(255,59,48,0.1)]">
              <ion-skeleton-text animated class="w-[55%]! h-4!"></ion-skeleton-text>
              <ion-skeleton-text animated class="w-[18%]! h-4!"></ion-skeleton-text>
            </div>
          }
        </div>
      </div>

      <!-- Right Column Skeleton -->
      <div class="right-grid">
        <!-- KM Alerts Skeleton -->
        <div class="skeleton-detail-card">
          <ion-skeleton-text animated class="w-[35%]! h-5!"></ion-skeleton-text>
          <div class="grid-cols-2 mt-4">
            @for (_ of [1, 2]; track $index) {
              <div class="skeleton-metric-box text-center">
                <ion-skeleton-text animated class="w-[40%]! h-6! mx-auto"></ion-skeleton-text>
                <ion-skeleton-text animated class="w-[45%]! h-3! mx-auto mt-2"></ion-skeleton-text>
              </div>
            }
          </div>
        </div>

        <!-- Financial Skeleton -->
        <div class="skeleton-detail-card">
          <ion-skeleton-text animated class="w-[35%]! h-5!"></ion-skeleton-text>
          <div class="grid grid-cols-3 gap-3 mt-4 max-md:grid-cols-3 max-sm:grid-cols-1">
            @for (_ of [1, 2, 3]; track $index) {
              <div class="skeleton-metric-box text-center">
                <ion-skeleton-text animated class="w-[50%]! h-6! mx-auto mb-1"></ion-skeleton-text>
                <ion-skeleton-text animated class="w-[40%]! h-3! mx-auto"></ion-skeleton-text>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardSkeletonComponent {}
