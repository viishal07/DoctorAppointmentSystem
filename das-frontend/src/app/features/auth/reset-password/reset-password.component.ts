import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="auth-form">
      <h2>Reset Password</h2>
      <p class="subtitle">Enter the OTP from your email and choose a new password</p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>OTP Code</mat-label>
          <input matInput formControlName="otpCode" maxlength="6">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>New Password</mat-label>
          <input matInput type="password" formControlName="newPassword" autocomplete="new-password">
          @if (f['newPassword'].hasError('minlength') && f['newPassword'].touched) {
            <mat-error>Minimum 8 characters required</mat-error>
          }
          @if (f['newPassword'].hasError('pattern') && f['newPassword'].touched) {
            <mat-error>Must contain uppercase letter and digit</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Confirm New Password</mat-label>
          <input matInput type="password" formControlName="confirmPassword" autocomplete="new-password">
          @if (f['confirmPassword'].hasError('passwordMismatch') && f['confirmPassword'].touched) {
            <mat-error>Passwords do not match</mat-error>
          }
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" class="submit-btn"
                [disabled]="form.invalid || loading">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
      <div class="auth-links">
        <a routerLink="/auth/login">Back to login</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-form { display: flex; flex-direction: column; }
    h2 { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; }
    .subtitle { opacity: 0.65; font-size: 0.88rem; margin: 0 0 1.25rem; }
    form { display: flex; flex-direction: column; gap: 0.1rem; }
    mat-form-field { width: 100%; }
    .submit-btn { width: 100%; margin-top: 0.5rem; height: 44px; }
    .auth-links { text-align: center; margin-top: 1.25rem; font-size: 0.85rem; }
    .auth-links a { color: #0284c7; text-decoration: none; }
  `]
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator('newPassword', 'confirmPassword') });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.form.patchValue({ email });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.resetPassword(this.form.value as any).subscribe({
      next: (msg) => {
        this.snack.open(msg, 'OK', { duration: 4000 });
        this.router.navigate(['/auth/login']);
      },
      error: () => { this.loading = false; }
    });
  }
}
