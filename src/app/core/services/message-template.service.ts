import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import {
  MessageTemplateResponse,
  CreateMessageTemplateRequest,
  UpdateMessageTemplateRequest,
} from '../models/message-template.model';
import { PaginationMeta, PagedResponse } from '../models/api-response.model';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MessageTemplateService {
  private readonly api = inject(ApiService);

  private readonly templatesSignal = signal<MessageTemplateResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);

  readonly templates = this.templatesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  loadAll(params?: HttpParams): Observable<PagedResponse<MessageTemplateResponse>> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<MessageTemplateResponse>('/message-templates', params).pipe(
      tap(response => {
        this.templatesSignal.set(response.items);
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

  getById(id: number): Observable<MessageTemplateResponse> {
    return this.api.getById<MessageTemplateResponse>('/message-templates', id);
  }

  getByKey(key: string): Observable<MessageTemplateResponse> {
    return this.api.get<MessageTemplateResponse>(`/message-templates/by-key/${key}`);
  }

  create(request: CreateMessageTemplateRequest): Observable<MessageTemplateResponse> {
    return this.api.post<MessageTemplateResponse>('/message-templates', request);
  }

  update(id: number, request: UpdateMessageTemplateRequest): Observable<MessageTemplateResponse> {
    return this.api.put<MessageTemplateResponse>('/message-templates', id, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>('/message-templates', id);
  }
}
