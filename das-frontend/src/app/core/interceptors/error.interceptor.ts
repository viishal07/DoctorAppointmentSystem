import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../stores/auth.store';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred.';

      if (error.error?.message) {
        message = error.error.message;
      }

      switch (error.status) {
        case 401:
          authStore.logout();
          break;
        case 403:
          router.navigate(['/unauthorized']);
          break;
        case 400:
        case 404:
          snackBar.open(message, 'Close', { duration: 4000, panelClass: ['error-snack'] });
          break;
        case 500:
          snackBar.open('Server error. Please try again later.', 'Close', { duration: 4000, panelClass: ['error-snack'] });
          break;
      }

      return throwError(() => error);
    })
  );
};
