import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { ApiService } from './api.service';
import {
  FinancialRecordResponse,
  CreateFinancialRecordRequest,
  UpdateFinancialRecordRequest,
  FinancialSummaryResponse,
  CategorySummaryResponse,
} from '../models/financial-record.model';
import { PaginationMeta, PagedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class FinancialRecordService {
  private readonly api = inject(ApiService);

  private readonly recordsSignal = signal<FinancialRecordResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);
  private readonly summarySignal = signal<FinancialSummaryResponse | null>(null);
  private readonly categorySummarySignal = signal<CategorySummaryResponse[]>([]);

  readonly records = this.recordsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();
  readonly summary = this.summarySignal.asReadonly();
  readonly categorySummary = this.categorySummarySignal.asReadonly();

  loadAll(): Observable<PagedResponse<FinancialRecordResponse>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<FinancialRecordResponse>('/financial-records').pipe(
      tap(response => {
        this.recordsSignal.set(response.items);
        this.paginationSignal.set({
          page: response.page,
          pageSize: response.pageSize,
          totalCount: response.totalCount,
          totalPages: response.totalPages,
        });
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set(err.message);
        this.loadingSignal.set(false);
        return throwError(() => err);
      }),
    );
  }

  loadSummary(): Observable<FinancialSummaryResponse | null> {
    return this.api.get<FinancialSummaryResponse>('/financial-records/summary').pipe(
      tap(summary => this.summarySignal.set(summary)),
      catchError(() => {
        this.summarySignal.set(null);
        return of(null);
      }),
    );
  }

  getById(id: number): Observable<FinancialRecordResponse> {
    return this.api.getById<FinancialRecordResponse>('/financial-records', id);
  }

  create(request: CreateFinancialRecordRequest): Observable<FinancialRecordResponse> {
    return this.api.post<FinancialRecordResponse>('/financial-records', request);
  }

  update(id: number, request: UpdateFinancialRecordRequest): Observable<FinancialRecordResponse> {
    return this.api.put<FinancialRecordResponse>('/financial-records', id, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>('/financial-records', id);
  }
}
