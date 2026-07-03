import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface WaStatus {
  ready: boolean;
  status: 'initializing' | 'qr' | 'ready' | 'disconnected' | 'error';
}

export interface WaMessageLog {
  id: number;
  phone: string;
  message: string;
  type: 'Test' | 'Reminder';
  success: boolean;
  errorMessage: string | null;
  sentBy: string;
  createdAt: string;
}

export interface WaLogsResponse {
  items: WaMessageLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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
    return this.api.post<{ success: boolean; messageId: string }>('/whatsapp/test-send', { phone, message });
  }

  getLogs(page = 1, pageSize = 100) {
    return this.api.get<WaLogsResponse>(`/whatsapp/logs?page=${page}&pageSize=${pageSize}`);
  }
}
