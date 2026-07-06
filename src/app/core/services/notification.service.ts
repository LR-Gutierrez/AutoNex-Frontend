import { Injectable, OnDestroy, inject, signal, effect, untracked } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from './api.service';
import { SignalRService } from './signalr.service';
import { NotificationResponse, NotificationStatus, NotificationType } from '../models/notification.model';
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

  constructor() {
    this.signalr.startConnection('notifications');

    this.signalr.on<NotificationResponse>('notifications', 'newNotification')
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        let isNew = false;
        this.notificationsSignal.update(list => {
          const existing = list.find(n => n.id === notification.id);
          if (existing) return list.map(n => n.id === notification.id ? notification : n);
          isNew = true;
          return [notification, ...list];
        });
        if (isNew) this.unreadCountSignal.update(c => c + 1);
        if (notification.status !== NotificationStatus.Pending && notification.type !== NotificationType.WhatsApp) {
          this.playNotificationSound();
        }
      });

    effect(() => {
      const status = this.signalr.notificationsStatus();
      if (status === 'connected') {
        untracked(() => this.signalr.joinGroup('notifications', 'all', 'JoinGroup'));
      }
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
      new Audio('/assets/sounds/notification-pop.wav').play().catch(() => {});
    } catch {
      // Silently fail - audio not available
    }
  }
}
