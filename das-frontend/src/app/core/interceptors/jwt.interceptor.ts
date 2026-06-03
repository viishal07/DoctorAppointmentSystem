import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../stores/auth.store';

const PUBLIC_URLS = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const isPublic = PUBLIC_URLS.some(url => req.url.includes(url));

  if (isPublic || !authStore.token()) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${authStore.token()}` }
  });
  return next(cloned);
};
