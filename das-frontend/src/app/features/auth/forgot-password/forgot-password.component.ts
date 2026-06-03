import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="auth-form">
      <h2>Forgot Password</h2>
      <p class="subtitle">Enter your email to receive a password reset OTP</p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
          @if (form.get('email')?.invalid && form.get('email')?.touched) {
            <mat-error>Enter a valid email</mat-error>
          }
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" class="submit-btn"
                [disabled]="form.invalid || loading">
          {{ loading ? 'Sending OTP...' : 'Send OTP' }}
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
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  loading = false;
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.forgotPassword(this.form.value as any).subscribe({
      next: (msg) => {
        this.snack.open(msg, 'OK', { duration: 5000 });
        this.router.navigate(['/auth/reset-password'], { queryParams: { email: this.form.value.email } });
      },
      error: () => { this.loading = false; }
    });
  }
}
