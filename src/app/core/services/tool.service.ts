import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import {
  ToolResponse,
  CreateToolRequest,
  UpdateToolRequest,
} from '../models/tool.model';
import { PaginationMeta, PagedResponse } from '../models/api-response.model';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ToolService {
  private readonly api = inject(ApiService);

  private readonly toolsSignal = signal<ToolResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);

  readonly tools = this.toolsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  loadAll(params?: HttpParams): Observable<PagedResponse<ToolResponse>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<ToolResponse>('/tools', params).pipe(
      tap(response => {
        this.toolsSignal.set(response.items);
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

  getById(id: number): Observable<ToolResponse> {
    return this.api.getById<ToolResponse>('/tools', id);
  }

  create(request: CreateToolRequest): Observable<ToolResponse> {
    return this.api.post<ToolResponse>('/tools', request);
  }

  update(id: number, request: UpdateToolRequest): Observable<ToolResponse> {
    return this.api.put<ToolResponse>('/tools', id, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>('/tools', id);
  }
}
