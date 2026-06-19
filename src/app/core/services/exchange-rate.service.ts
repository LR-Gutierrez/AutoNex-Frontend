import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ExchangeRatePublication,
  ExchangeRateListResponse,
  LiveRateResponse,
} from '../models/exchange-rate.model';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private readonly ratesSignal = signal<ExchangeRatePublication[]>([]);
  private readonly loadingSignal = signal(true);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<{ page: number; pageSize: number; totalCount: number; totalPages: number } | null>(null);

  readonly rates = this.ratesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  loadAll(params?: HttpParams): Observable<ExchangeRateListResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<ExchangeRateListResponse>(`${this.baseUrl}/exchange-rates`, { params }).pipe(
      tap(response => {
        this.ratesSignal.set(response.data ?? []);
        this.paginationSignal.set({
          page: response.page,
          pageSize: response.perPage,
          totalCount: response.total,
          totalPages: Math.ceil(response.total / response.perPage),
        });
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set(err.message ?? 'Error al cargar tasas de cambio');
        this.loadingSignal.set(false);
        return throwError(() => err);
      }),
    );
  }

  getById(id: number): Observable<ExchangeRatePublication> {
    return this.http.get<ExchangeRatePublication>(`${this.baseUrl}/exchange-rates/${id}`);
  }

  getCurrentUsd(): Observable<LiveRateResponse> {
    return this.http.get<LiveRateResponse>(`${this.baseUrl}/exchange-rates/live/USD`);
  }

  create(data: { publishedAt: string; valueDate: string; observations?: string; rates: { currencyId: number; value: number }[] }): Observable<ExchangeRatePublication> {
    return this.http.post<ExchangeRatePublication>(`${this.baseUrl}/exchange-rates`, data);
  }

  update(id: number, data: { publishedAt?: string; valueDate?: string; observations?: string; rates?: { currencyId: number; value: number }[] }): Observable<ExchangeRatePublication> {
    return this.http.put<ExchangeRatePublication>(`${this.baseUrl}/exchange-rates/${id}`, data);
  }

  authorize(id: number): Observable<ExchangeRatePublication> {
    return this.http.post<ExchangeRatePublication>(`${this.baseUrl}/exchange-rates/${id}/authorize`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/exchange-rates/${id}`);
  }
}
