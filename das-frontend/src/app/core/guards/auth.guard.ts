import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isLoggedIn()) {
    return router.createUrlTree(['/auth/login']);
  }

  const user = authStore.currentUser();
  if (user && new Date(user.expiresAt) <= new Date()) {
    authStore.logout();
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
