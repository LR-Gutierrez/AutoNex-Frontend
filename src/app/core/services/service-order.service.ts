import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import {
  ServiceOrderResponse,
  CreateServiceOrderRequest,
  UpdateServiceOrderStatusRequest,
} from '../models/service-order.model';
import { PaginationMeta, PagedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ServiceOrderService {
  private readonly api = inject(ApiService);

  private readonly ordersSignal = signal<ServiceOrderResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);

  readonly orders = this.ordersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  loadAll(): Observable<PagedResponse<ServiceOrderResponse>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<ServiceOrderResponse>('/service-orders').pipe(
      tap(response => {
        this.ordersSignal.set(response.items);
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

  getById(id: number): Observable<ServiceOrderResponse> {
    return this.api.getById<ServiceOrderResponse>('/service-orders', id);
  }

  create(request: CreateServiceOrderRequest): Observable<ServiceOrderResponse> {
    return this.api.post<ServiceOrderResponse>('/service-orders', request);
  }

  updateStatus(id: number, request: UpdateServiceOrderStatusRequest): Observable<ServiceOrderResponse> {
    return this.api.patch<ServiceOrderResponse>('/service-orders', id, request);
  }
}
