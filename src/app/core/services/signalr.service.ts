import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthStateService } from './auth-state.service';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

interface HubState {
  connection: HubConnection;
  status: ReturnType<typeof signal<ConnectionStatus>>;
  subjects: Map<string, Subject<unknown>>;
}

@Injectable({ providedIn: 'root' })
export class SignalRService implements OnDestroy {
  private readonly authState = inject(AuthStateService);
  private readonly destroy$ = new Subject<void>();
  private readonly hubs = new Map<string, HubState>();

  readonly dashboardStatus = signal<ConnectionStatus>('disconnected');
  readonly notificationsStatus = signal<ConnectionStatus>('disconnected');

  ngOnDestroy(): void {
    for (const [name] of this.hubs) {
      this.stopConnection(name);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  startConnection(hubName: string): void {
    if (this.hubs.has(hubName)) return;

    const statusSignal = this.getStatusSignal(hubName);
    statusSignal.set('connecting');

    const token = this.authState.token();
    if (!token) {
      statusSignal.set('disconnected');
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/${hubName}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    const state: HubState = {
      connection,
      status: statusSignal,
      subjects: new Map(),
    };

    connection.onreconnecting(() => {
      statusSignal.set('reconnecting');
    });

    connection.onreconnected(() => {
      statusSignal.set('connected');
    });

    connection.onclose(() => {
      statusSignal.set('disconnected');
    });

    connection.start().then(() => {
      statusSignal.set('connected');
    }).catch(() => {
      statusSignal.set('disconnected');
    });

    this.hubs.set(hubName, state);
  }

  stopConnection(hubName: string): void {
    const state = this.hubs.get(hubName);
    if (state) {
      state.connection.stop();
      state.status.set('disconnected');
      this.hubs.delete(hubName);
    }
  }

  on<T>(hubName: string, event: string): Observable<T> {
    const state = this.hubs.get(hubName);
    if (!state) {
      return new Subject<T>().asObservable();
    }

    if (!state.subjects.has(event)) {
      const subject = new Subject<T>();
      state.subjects.set(event, subject as Subject<unknown>);
      state.connection.on(event, (data: T) => {
        subject.next(data);
      });
    }

    return (state.subjects.get(event) as Subject<T>).asObservable().pipe(
      filter(() => state.connection.state === HubConnectionState.Connected),
      takeUntil(this.destroy$),
    );
  }

  async joinGroup(hubName: string, groupName: string, method = 'JoinDashboardGroup'): Promise<void> {
    const state = this.hubs.get(hubName);
    if (state?.connection.state === HubConnectionState.Connected) {
      try {
        await state.connection.invoke(method, groupName);
      } catch {
        // Silently fail
      }
    }
  }

  async leaveGroup(hubName: string, groupName: string, method = 'LeaveDashboardGroup'): Promise<void> {
    const state = this.hubs.get(hubName);
    if (state?.connection.state === HubConnectionState.Connected) {
      try {
        await state.connection.invoke(method, groupName);
      } catch {
        // Silently fail
      }
    }
  }

  async invoke(hubName: string, method: string, ...args: unknown[]): Promise<unknown> {
    const state = this.hubs.get(hubName);
    if (state?.connection.state === HubConnectionState.Connected) {
      try {
        return await state.connection.invoke(method, ...args);
      } catch {
        return null;
      }
    }
    return null;
  }

  private getStatusSignal(hubName: string): ReturnType<typeof signal<ConnectionStatus>> {
    if (hubName === 'dashboard') return this.dashboardStatus;
    if (hubName === 'notifications') return this.notificationsStatus;
    return signal<ConnectionStatus>('disconnected');
  }
}
