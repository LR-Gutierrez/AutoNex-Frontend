import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { WorkshopInfoResponse, UpdateWorkshopInfoRequest } from '../models/workshop-info.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkshopInfoService {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);

  private readonly infoSignal = signal<WorkshopInfoResponse | null>(null);
  private readonly loadingSignal = signal(false);

  readonly info = this.infoSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  get(): Observable<WorkshopInfoResponse> {
    this.loadingSignal.set(true);
    return this.api.get<WorkshopInfoResponse>('/workshop-info').pipe(
      tap(info => {
        this.infoSignal.set(info);
        this.loadingSignal.set(false);
      }),
    );
  }

  upsert(request: UpdateWorkshopInfoRequest): Observable<WorkshopInfoResponse> {
    return this.http.put<ApiResponse<WorkshopInfoResponse>>(
      `${environment.apiUrl}/workshop-info`, request,
    ).pipe(
      map(res => res.data),
      tap(info => this.infoSignal.set(info)),
    );
  }
}
