import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import {
  SupplierResponse,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '../models/supplier.model';
import { PaginationMeta, PagedResponse } from '../models/api-response.model';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private readonly api = inject(ApiService);

  private readonly suppliersSignal = signal<SupplierResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);

  readonly suppliers = this.suppliersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  loadAll(params?: HttpParams): Observable<PagedResponse<SupplierResponse>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<SupplierResponse>('/suppliers', params).pipe(
      tap(response => {
        this.suppliersSignal.set(response.items);
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

  getById(id: number): Observable<SupplierResponse> {
    return this.api.getById<SupplierResponse>('/suppliers', id);
  }

  create(request: CreateSupplierRequest): Observable<SupplierResponse> {
    return this.api.post<SupplierResponse>('/suppliers', request);
  }

  update(id: number, request: UpdateSupplierRequest): Observable<SupplierResponse> {
    return this.api.put<SupplierResponse>('/suppliers', id, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>('/suppliers', id);
  }
}
