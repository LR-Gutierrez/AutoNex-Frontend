import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthStateService } from '../services/auth-state.service';
import { AppError } from '../models/api-response.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authState.clearAuth();
        router.navigate(['/auth/login']);
      }

      return throwError(() => normalizeError(error));
    }),
  );
};

function normalizeError(error: HttpErrorResponse): AppError {
  if (error.status === 400) {
    return {
      message: error.error?.message || 'Error de validación',
      validationErrors: error.error?.errors,
    };
  }
  if (error.status === 403) {
    return { message: 'No tienes permisos para esta acción' };
  }
  if (error.status === 404) {
    return { message: 'El recurso solicitado no existe' };
  }
  return { message: 'Error inesperado. Intenta de nuevo.' };
}
