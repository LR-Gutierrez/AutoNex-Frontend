import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${path}`, { params })
      .pipe(map(res => res.data));
  }

  getPaged<T>(path: string, params?: HttpParams): Observable<PagedResponse<T>> {
    return this.http
      .get<ApiResponse<PagedResponse<T>>>(`${this.baseUrl}${path}`, { params })
      .pipe(map(res => res.data));
  }

  getById<T>(path: string, id: number): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${path}/${id}`)
      .pipe(map(res => res.data));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(res => res.data));
  }

  put<T>(path: string, id: number, body: unknown): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}${path}/${id}`, body)
      .pipe(map(res => res.data));
  }

  patch<T>(path: string, id: number, body: unknown): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(`${this.baseUrl}${path}/${id}`, body)
      .pipe(map(res => res.data));
  }

  delete<T = void>(path: string, id: number): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}${path}/${id}`)
      .pipe(map(res => res.data));
  }
}
