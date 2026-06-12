import { Injectable, computed, signal } from '@angular/core';
import { AuthResponse } from '../models/auth.model';
import { UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly userSignal = signal<AuthResponse | null>(null);
  private readonly tokenSignal = signal<string | null>(
    localStorage.getItem('token'),
  );

  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);
  readonly role = computed<UserRole | null>(() => this.userSignal()?.role ?? null);

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.userSignal.set(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  setAuth(auth: AuthResponse): void {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('currentUser', JSON.stringify(auth));
    this.userSignal.set(auth);
    this.tokenSignal.set(auth.token);
  }

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.userSignal.set(null);
    this.tokenSignal.set(null);
  }
}
