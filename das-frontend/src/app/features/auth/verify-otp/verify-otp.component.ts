import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="auth-form">
      <h2>Verify Your Email</h2>
      <p class="subtitle">Enter the 6-digit OTP sent to <strong>{{ email }}</strong></p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>OTP Code</mat-label>
          <input matInput formControlName="otpCode" maxlength="6" placeholder="123456">
          @if (f['otpCode'].hasError('minlength') && f['otpCode'].touched) {
            <mat-error>OTP must be exactly 6 digits</mat-error>
          }
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" class="submit-btn"
                [disabled]="form.invalid || loading">
          {{ loading ? 'Verifying...' : 'Verify Email' }}
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
    .subtitle { opacity: 0.65; font-size: 0.88rem; margin: 0 0 1.25rem; line-height: 1.5; }
    form { display: flex; flex-direction: column; gap: 0.1rem; }
    mat-form-field { width: 100%; }
    .submit-btn { width: 100%; margin-top: 0.5rem; height: 44px; }
    .auth-links { text-align: center; margin-top: 1.25rem; font-size: 0.85rem; }
    .auth-links a { color: #0284c7; text-decoration: none; }
  `]
})
export class VerifyOtpComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  loading = false;
  email = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.form.patchValue({ email: this.email });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.verifyOtp(this.form.value as any).subscribe({
      next: (msg) => {
        this.snack.open(msg, 'OK', { duration: 4000 });
        this.router.navigate(['/auth/login']);
      },
      error: () => { this.loading = false; }
    });
  }
}
