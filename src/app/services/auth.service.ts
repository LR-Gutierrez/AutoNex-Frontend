import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.checkAuth(),
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private checkAuth(): boolean {
    return !!localStorage.getItem('token');
  }
  private getCurrentUser(): any {
    const s = localStorage.getItem('currentUser');
    return s ? JSON.parse(s) : null;
  }

  login(email: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post<any>(`${this.apiUrl}/auth/login`, { email, password })
        .subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('currentUser', JSON.stringify(res.user));
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(res.user);
            this.fetchProfile().subscribe();
            observer.next(res);
            observer.complete();
          },
          error: (err) => observer.error(err),
        });
    });
  }

  fetchProfile(): Observable<any> {
    return new Observable((observer) => {
      this.http
        .get<any>(`${this.apiUrl}/auth/profile`, {
          headers: { Authorization: `Bearer ${this.getToken()}` },
        })
        .subscribe({
          next: (user) => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            observer.next(user);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
            observer.complete();
          },
        });
    });
  }

  register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    profession?: string;
    gender?: string;
    linkedin?: string;
    country?: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
  getUser(): any {
    return this.currentUserSubject.value;
  }
  getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
