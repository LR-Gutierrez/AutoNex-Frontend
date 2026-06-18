import { Injectable, OnDestroy, inject, signal, effect, untracked } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError, takeUntil, Subject, debounceTime, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { SignalRService } from './signalr.service';
import { DashboardResponse, DateRange, PresetKey } from '../models/dashboard.model';

export const PRESETS: { key: PresetKey; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'yesterday', label: 'Ayer' },
  { key: 'this-week', label: 'Esta semana' },
  { key: 'this-month', label: 'Mes actual' },
  { key: 'last-month', label: 'Mes anterior' },
  { key: 'custom', label: 'Rango personalizado' },
];

function buildPresetRange(preset: PresetKey, customStart?: string, customEnd?: string): DateRange {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (preset) {
    case 'today': {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    }
    case 'yesterday': {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      start = new Date(y.getFullYear(), y.getMonth(), y.getDate());
      end = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59, 999);
      break;
    }
    case 'this-week': {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(now.getFullYear(), now.getMonth(), diff);
      end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case 'this-month': {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }
    case 'last-month': {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    }
    case 'custom': {
      const rawStart = customStart ? new Date(customStart) : new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const rawEnd = customEnd ? new Date(customEnd) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      if (customEnd) rawEnd.setHours(23, 59, 59, 999);
      start = rawStart <= rawEnd ? rawStart : rawEnd;
      end = rawStart <= rawEnd ? rawEnd : rawStart;
      break;
    }
  }

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const label = preset === 'custom'
    ? `${fmt(start)} → ${fmt(end)}`
    : PRESETS.find(p => p.key === preset)!.label;

  return {
    preset,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    label,
  };
}

@Injectable({ providedIn: 'root' })
export class DashboardService implements OnDestroy {
  private readonly api = inject(ApiService);
  private readonly signalr = inject(SignalRService);
  private readonly destroy$ = new Subject<void>();

  private readonly dataSignal = signal<DashboardResponse | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly rangeSignal = signal<DateRange>(buildPresetRange('today'));

  readonly data = this.dataSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedRange = this.rangeSignal.asReadonly();

  private previousPreset: PresetKey | null = null;

  constructor() {
    this.signalr.startConnection('dashboard');

    this.signalr.on<void>('dashboard', 'dashboardUpdated')
      .pipe(
        debounceTime(500),
        switchMap(() => this.load()),
        takeUntil(this.destroy$),
      )
      .subscribe();

    effect(() => {
      const status = this.signalr.dashboardStatus();
      if (status === 'connected') {
        const preset = untracked(() => this.rangeSignal().preset);
        if (preset && preset !== 'custom') {
          this.signalr.joinGroup('dashboard', preset);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setRange(preset: PresetKey, customStart?: string, customEnd?: string): void {
    const range = buildPresetRange(preset, customStart, customEnd);
    this.rangeSignal.set(range);

    if (this.previousPreset && this.previousPreset !== preset && this.previousPreset !== 'custom') {
      this.signalr.leaveGroup('dashboard', this.previousPreset);
    }

    this.previousPreset = preset;

    if (preset !== 'custom') {
      this.signalr.joinGroup('dashboard', preset);
    }

    this.load().subscribe();
  }

  load(): Observable<DashboardResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const range = this.rangeSignal();
    let params = new HttpParams()
      .set('startDate', range.startDate)
      .set('endDate', range.endDate);

    return this.api.get<DashboardResponse>('/dashboard', params).pipe(
      tap(response => {
        this.dataSignal.set(response);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set(err.message);
        this.loadingSignal.set(false);
        return throwError(() => err);
      }),
    );
  }
}
