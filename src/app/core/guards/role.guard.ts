import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);
    const role = authState.role();

    if (role && allowedRoles.includes(role)) {
      return true;
    }

    return router.parseUrl('/dashboard');
  };
};
