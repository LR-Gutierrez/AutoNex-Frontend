import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  CreateRecurringExpenseRequest,
  RecurringExpenseOccurrenceResponse,
  RecurringExpenseResponse,
  UpdateRecurringExpenseRequest,
  PayRecurringExpenseRequest,
} from '../models/recurring-expense.model';
import { Observable, tap } from 'rxjs';
import { SignalRService } from './signalr.service';

@Injectable({ providedIn: 'root' })
export class RecurringExpenseService {
  private readonly http = inject(HttpClient);
  private readonly signalr = inject(SignalRService);
  private readonly baseUrl = `${environment.apiUrl}/recurring-expenses`;

  readonly expenses = signal<RecurringExpenseResponse[]>([]);
  readonly dueToday = signal<RecurringExpenseOccurrenceResponse[]>([]);

  constructor() {
    this.signalr
      .on<RecurringExpenseOccurrenceResponse[]>('dashboard', 'recurringExpensesDue')
      .subscribe((due) => this.dueToday.set(due ?? []));
  }

  loadAll(): Observable<ApiResponse<RecurringExpenseResponse[]>> {
    return this.http
      .get<ApiResponse<RecurringExpenseResponse[]>>(this.baseUrl)
      .pipe(tap((res) => this.expenses.set(res.data ?? [])));
  }

  getById(id: number): Observable<ApiResponse<RecurringExpenseResponse>> {
    return this.http.get<ApiResponse<RecurringExpenseResponse>>(
      `${this.baseUrl}/${id}`,
    );
  }

  create(
    request: CreateRecurringExpenseRequest,
  ): Observable<ApiResponse<RecurringExpenseResponse>> {
    return this.http.post<ApiResponse<RecurringExpenseResponse>>(
      this.baseUrl,
      request,
    );
  }

  update(
    id: number,
    request: UpdateRecurringExpenseRequest,
  ): Observable<ApiResponse<RecurringExpenseResponse>> {
    return this.http.put<ApiResponse<RecurringExpenseResponse>>(
      `${this.baseUrl}/${id}`,
      request,
    );
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }

  loadDueToday(): Observable<ApiResponse<RecurringExpenseOccurrenceResponse[]>> {
    return this.http
      .get<ApiResponse<RecurringExpenseOccurrenceResponse[]>>(
        `${this.baseUrl}/due-today`,
      )
      .pipe(tap((res) => this.dueToday.set(res.data ?? [])));
  }

  payOccurrence(
    occurrenceId: number,
    request: PayRecurringExpenseRequest,
  ): Observable<ApiResponse<RecurringExpenseOccurrenceResponse>> {
    return this.http.post<ApiResponse<RecurringExpenseOccurrenceResponse>>(
      `${this.baseUrl}/occurrences/${occurrenceId}/pay`,
      request,
    );
  }

  dismissOccurrence(
    occurrenceId: number,
  ): Observable<ApiResponse<RecurringExpenseOccurrenceResponse>> {
    return this.http.post<ApiResponse<RecurringExpenseOccurrenceResponse>>(
      `${this.baseUrl}/occurrences/${occurrenceId}/dismiss`,
      {},
    );
  }
}
