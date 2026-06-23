import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { MileageAlertResponse, UpdateMileageAlertRequest } from '../models/mileage-alert.model';
import { PaginationMeta, PagedResponse } from '../models/api-response.model';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MileageAlertService {
  private readonly api = inject(ApiService);

  private readonly alertsSignal = signal<MileageAlertResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);

  readonly alerts = this.alertsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  loadAll(params?: HttpParams): Observable<PagedResponse<MileageAlertResponse>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<MileageAlertResponse>('/mileage-alerts', params).pipe(
      tap(response => {
        this.alertsSignal.set(response.items);
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

  getById(id: number): Observable<MileageAlertResponse> {
    return this.api.getById<MileageAlertResponse>('/mileage-alerts', id);
  }

  update(id: number, request: UpdateMileageAlertRequest): Observable<MileageAlertResponse> {
    return this.api.put<MileageAlertResponse>('/mileage-alerts', id, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>('/mileage-alerts', id);
  }

  createFromOrder(orderId: number): Observable<MileageAlertResponse[]> {
    return this.api.post<MileageAlertResponse[]>(`/mileage-alerts/from-order/${orderId}`, {});
  }

  attend(id: number): Observable<MileageAlertResponse> {
    return this.api.post<MileageAlertResponse>(`/mileage-alerts/${id}/attend`, {});
  }
}
