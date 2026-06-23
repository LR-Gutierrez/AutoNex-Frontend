import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface WaStatus {
  ready: boolean;
  status: 'initializing' | 'qr' | 'ready' | 'disconnected' | 'error';
}

@Injectable({ providedIn: 'root' })
export class WaNotifierService {
  private readonly api = inject(ApiService);

  getQr() {
    return this.api.get<{ qr: string | null }>('/whatsapp/qr');
  }

  getStatus() {
    return this.api.get<WaStatus>('/whatsapp/status');
  }

  logout() {
    return this.api.post<{ success: boolean }>('/whatsapp/logout', {});
  }

  restart() {
    return this.api.post<{ success: boolean }>('/whatsapp/restart', {});
  }

  testSend(phone: string, message: string) {
    return this.api.post<{ success: boolean }>('/whatsapp/test-send', { phone, message });
  }
}
