import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConnectionMonitorService {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  private readonly baseUrl = environment.apiUrl.replace(/\/api\/?$/, '');
  readonly isOnline = signal(true);
  private started = false;
  private destroyed = false;

  start(): void {
    if (this.started) return;
    this.started = true;

    this.check();

    const interval = setInterval(() => this.check(), 3000);

    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      clearInterval(interval);
    });
  }

  private check(): void {
    if (this.destroyed) return;

    this.http.get(`${this.baseUrl}/health`, { responseType: 'text' }).subscribe({
      next: () => {
        if (!this.isOnline()) {
          console.log('[CM] reconnection detected via health');
        }
        this.isOnline.set(true);
      },
      error: () => {
        if (this.isOnline()) {
          console.log('[CM] connection lost');
        }
        this.isOnline.set(false);
      },
    });
  }
}
