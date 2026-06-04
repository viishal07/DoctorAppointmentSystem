import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse, UserRole } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _currentUser = signal<LoginResponse | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this._currentUser());
  readonly userRole = computed(() => this._currentUser()?.role ?? null);
  readonly fullName = computed(() => this._currentUser()?.fullName ?? '');
  readonly token = computed(() => this._currentUser()?.token ?? null);

  constructor(private router: Router) {}

  init(): void {
    const stored = localStorage.getItem(environment.userKey);
    if (!stored) return;
    try {
      const user: LoginResponse = JSON.parse(stored);
      if (new Date(user.expiresAt) > new Date()) {
        this._currentUser.set(user);
      } else {
        this.clearStorage();
      }
    } catch {
      this.clearStorage();
    }
  }

  //login(response: LoginResponse): void {
  //  localStorage.setItem(environment.tokenKey, response.token);
  //  localStorage.setItem(environment.userKey, JSON.stringify(response));
  //  this._currentUser.set(response);
  //  this.redirectByRole(response.role);
    //}

    login(response: LoginResponse): void {
        console.log('ROLE:', response.role);

        localStorage.setItem(environment.tokenKey, response.token);
        localStorage.setItem(environment.userKey, JSON.stringify(response));
        this._currentUser.set(response);

        this.router.navigate(['/doctor/dashboard']);
    }

  logout(): void {
    this.clearStorage();
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private redirectByRole(role: UserRole): void {
    const routes: Record<UserRole, string> = {
      Admin: '/admin/dashboard',
      Doctor: '/doctor/dashboard',
      Patient: '/patient/dashboard'
    };
    this.router.navigate([routes[role] ?? '/auth/login']);
  }

  private clearStorage(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.userKey);
  }
}
