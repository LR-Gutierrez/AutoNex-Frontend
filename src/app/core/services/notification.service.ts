import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from './api.service';
import { SignalRService } from './signalr.service';
import { NotificationResponse } from '../models/notification.model';
import { PagedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private readonly api = inject(ApiService);
  private readonly signalr = inject(SignalRService);
  private readonly destroy$ = new Subject<void>();

  private readonly notificationsSignal = signal<NotificationResponse[]>([]);
  private readonly unreadCountSignal = signal(0);
  private readonly loadingSignal = signal(false);

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly unreadCount = this.unreadCountSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.signalr.startConnection('notifications');

    this.signalr.on<NotificationResponse>('notifications', 'NewNotification')
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        this.notificationsSignal.update(list => [notification, ...list]);
        this.unreadCountSignal.update(c => c + 1);
        this.playNotificationSound();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(page = 1, pageSize = 20): void {
    this.loadingSignal.set(true);
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    this.api.get<PagedResponse<NotificationResponse>>('/notifications', params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.notificationsSignal.set(response.items);
          this.loadingSignal.set(false);
        },
        error: () => this.loadingSignal.set(false),
      });
  }

  markAllRead(): void {
    this.unreadCountSignal.set(0);
  }

  private playNotificationSound(): void {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Silently fail - audio not available
    }
  }
}
