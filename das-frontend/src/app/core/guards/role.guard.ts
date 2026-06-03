import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const allowedRoles: string[] = route.data['roles'] ?? [];
  const userRole = authStore.userRole();

  if (!userRole || !allowedRoles.includes(userRole)) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
