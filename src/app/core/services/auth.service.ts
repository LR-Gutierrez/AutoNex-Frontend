import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthStateService } from './auth-state.service';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly authState = inject(AuthStateService);

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', request).pipe(
      tap(response => this.authState.setAuth(response)),
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', request);
  }

  logout(): void {
    new Audio('/assets/sounds/lock.mp3').play().catch(() => {});
    this.authState.clearAuth();
  }
}
