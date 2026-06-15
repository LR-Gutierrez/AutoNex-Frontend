import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import {
  ConsumableResponse,
  CreateConsumableRequest,
  UpdateConsumableRequest,
} from '../models/consumable.model';
import { PaginationMeta, PagedResponse } from '../models/api-response.model';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ConsumableService {
  private readonly api = inject(ApiService);

  private readonly consumablesSignal = signal<ConsumableResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);

  readonly consumables = this.consumablesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  loadAll(params?: HttpParams): Observable<PagedResponse<ConsumableResponse>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<ConsumableResponse>('/consumables', params).pipe(
      tap(response => {
        this.consumablesSignal.set(response.items);
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

  getById(id: number): Observable<ConsumableResponse> {
    return this.api.getById<ConsumableResponse>('/consumables', id);
  }

  create(request: CreateConsumableRequest): Observable<ConsumableResponse> {
    return this.api.post<ConsumableResponse>('/consumables', request);
  }

  update(id: number, request: UpdateConsumableRequest): Observable<ConsumableResponse> {
    return this.api.put<ConsumableResponse>('/consumables', id, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>('/consumables', id);
  }
}
