import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStore } from '../../../core/stores/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="auth-form">
      <h2>Welcome back</h2>
      <p class="subtitle">Sign in to your account</p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="email">
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
            <mat-error>Enter a valid email</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput [type]="showPw ? 'text' : 'password'" formControlName="password" autocomplete="current-password">
          <button mat-icon-button matSuffix type="button" (click)="showPw = !showPw" [attr.aria-label]="showPw ? 'Hide password' : 'Show password'">
            <i [class]="'ti ' + (showPw ? 'ti-eye-off' : 'ti-eye')" aria-hidden="true"></i>
          </button>
          @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
        </mat-form-field>
        <div class="forgot-link">
          <a routerLink="/auth/forgot-password">Forgot password?</a>
        </div>
        <button mat-flat-button color="primary" type="submit" class="submit-btn"
                [disabled]="form.invalid || loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      <div class="auth-links">
        <a routerLink="/auth/register-patient">Register as Patient</a>
        <span>·</span>
        <a routerLink="/auth/register-doctor">Register as Doctor</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-form { display: flex; flex-direction: column; }
    h2 { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; }
    .subtitle { opacity: 0.6; font-size: 0.9rem; margin: 0 0 1.5rem; }
    form { display: flex; flex-direction: column; gap: 0.1rem; }
    mat-form-field { width: 100%; }
    .forgot-link { text-align: right; margin: -0.5rem 0 0.75rem; }
    .forgot-link a { font-size: 0.82rem; color: #0284c7; text-decoration: none; }
    .submit-btn { width: 100%; margin-top: 0.5rem; height: 44px; }
    .auth-links { display: flex; justify-content: center; gap: 0.75rem; margin-top: 1.25rem;
      font-size: 0.85rem; }
    .auth-links a { color: #0284c7; text-decoration: none; }
    .auth-links span { opacity: 0.4; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private snack = inject(MatSnackBar);

  showPw = false;
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
      this.loading = true;

      this.authService.login(this.form.value as any).subscribe({
          next: (res) => {
              console.log('LOGIN RESPONSE:', res);
              this.authStore.login(res);
          },
          error: (err) => {
              console.error('LOGIN ERROR:', err);
              this.loading = false;
          },
          complete: () => {
              this.loading = false;
          }
      });
    //this.authService.login(this.form.value as any).subscribe({
    //  next: (res) => { this.authStore.login(res); },
    //  error: () => { this.loading = false; },
    //  complete: () => { this.loading = false; }
    //});
  }
}
