import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import {
  ServiceResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
} from '../models/service.model';
import { PaginationMeta, PagedResponse } from '../models/api-response.model';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly api = inject(ApiService);

  private readonly servicesSignal = signal<ServiceResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);

  readonly services = this.servicesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  loadAll(params?: HttpParams): Observable<PagedResponse<ServiceResponse>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<ServiceResponse>('/services', params).pipe(
      tap(response => {
        this.servicesSignal.set(response.items);
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

  getById(id: number): Observable<ServiceResponse> {
    return this.api.getById<ServiceResponse>('/services', id);
  }

  create(request: CreateServiceRequest): Observable<ServiceResponse> {
    return this.api.post<ServiceResponse>('/services', request);
  }

  update(id: number, request: UpdateServiceRequest): Observable<ServiceResponse> {
    return this.api.put<ServiceResponse>('/services', id, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>('/services', id);
  }
}
