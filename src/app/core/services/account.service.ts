import { Injectable, inject, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { AccountBalance, AccountTransactionResponse, AccountType } from '../models/account.model';
import { PagedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly api = inject(ApiService);

  private readonly balancesSignal = signal<AccountBalance[]>([]);
  private readonly loadingSignal = signal(false);

  readonly balances = this.balancesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  getBalances(): Observable<AccountBalance[]> {
    this.loadingSignal.set(true);

    return this.api.get<AccountBalance[]>('/accounts/balances').pipe(
      tap(balances => {
        this.balancesSignal.set(balances);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.loadingSignal.set(false);
        return throwError(() => err);
      }),
    );
  }

  getTransactions(
    accountType: AccountType,
    params?: HttpParams,
  ): Observable<PagedResponse<AccountTransactionResponse>> {
    return this.api.getPaged<AccountTransactionResponse>(
      `/accounts/${accountType}/transactions`,
      params,
    );
  }
}
