import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import {
  VehicleResponse,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../models/vehicle.model';
import { PaginationMeta, PagedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly api = inject(ApiService);

  private readonly vehiclesSignal = signal<VehicleResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);

  readonly vehicles = this.vehiclesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  loadAll(): Observable<PagedResponse<VehicleResponse>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<VehicleResponse>('/vehicles').pipe(
      tap(response => {
        this.vehiclesSignal.set(response.items);
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

  getById(id: number): Observable<VehicleResponse> {
    return this.api.getById<VehicleResponse>('/vehicles', id);
  }

  create(request: CreateVehicleRequest): Observable<VehicleResponse> {
    return this.api.post<VehicleResponse>('/vehicles', request);
  }

  update(id: number, request: UpdateVehicleRequest): Observable<VehicleResponse> {
    return this.api.put<VehicleResponse>('/vehicles', id, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>('/vehicles', id);
  }
}
