import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { ApiService } from './api.service';
import {
  ServiceOrderResponse,
  CreateServiceOrderRequest,
  UpdateServiceOrderStatusRequest,
  ServiceOrderStatus,
} from '../models/service-order.model';
import { ApiResponse, PaginationMeta, PagedResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceOrderService {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private readonly ordersSignal = signal<ServiceOrderResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);

  readonly orders = this.ordersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  loadAll(params?: HttpParams): Observable<PagedResponse<ServiceOrderResponse>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<ServiceOrderResponse>('/service-orders', params).pipe(
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

  update(id: number, request: CreateServiceOrderRequest): Observable<ServiceOrderResponse> {
    return this.api.put<ServiceOrderResponse>('/service-orders', id, request);
  }

  updateStatus(id: number, request: UpdateServiceOrderStatusRequest): Observable<ServiceOrderResponse> {
    return this.http
      .patch<ApiResponse<ServiceOrderResponse>>(`${this.baseUrl}/service-orders/${id}/status`, request)
      .pipe(map(res => res.data));
  }

  cancel(id: number): Observable<ServiceOrderResponse> {
    return this.updateStatus(id, { status: ServiceOrderStatus.Cancelled });
  }

  startOrder(id: number): Observable<ServiceOrderResponse> {
    return this.updateStatus(id, { status: ServiceOrderStatus.InProgress });
  }

  completeOrder(id: number): Observable<ServiceOrderResponse> {
    return this.updateStatus(id, { status: ServiceOrderStatus.Completed });
  }
}
