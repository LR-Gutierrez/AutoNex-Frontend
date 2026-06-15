import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ToolCategoryResponse, CreateToolCategoryRequest, UpdateToolCategoryRequest } from '../models/tool-category.model';
import { HttpParams } from '@angular/common/http';
import { PagedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ToolCategoryService {
  private readonly api = inject(ApiService);

  loadAll(params?: HttpParams): Observable<PagedResponse<ToolCategoryResponse>> {
    return this.api.getPaged<ToolCategoryResponse>('/tool-categories', params);
  }

  getById(id: number): Observable<ToolCategoryResponse> {
    return this.api.getById<ToolCategoryResponse>('/tool-categories', id);
  }

  create(request: CreateToolCategoryRequest): Observable<ToolCategoryResponse> {
    return this.api.post<ToolCategoryResponse>('/tool-categories', request);
  }

  update(id: number, request: UpdateToolCategoryRequest): Observable<ToolCategoryResponse> {
    return this.api.put<ToolCategoryResponse>('/tool-categories', id, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>('/tool-categories', id);
  }
}
