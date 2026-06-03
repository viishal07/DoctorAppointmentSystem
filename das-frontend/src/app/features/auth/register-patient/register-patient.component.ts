import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <div class="auth-form">
      <h2>Create Patient Account</h2>
      <p class="subtitle">Sign up to book appointments</p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName">
            @if (f['firstName'].invalid && f['firstName'].touched) {
              <mat-error>First name is required</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName">
            @if (f['lastName'].invalid && f['lastName'].touched) {
              <mat-error>Last name is required</mat-error>
            }
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
          @if (f['email'].hasError('required') && f['email'].touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (f['email'].hasError('email') && f['email'].touched) {
            <mat-error>Enter a valid email</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Phone Number</mat-label>
          <input matInput formControlName="phoneNumber" placeholder="+91XXXXXXXXXX">
          @if (f['phoneNumber'].invalid && f['phoneNumber'].touched) {
            <mat-error>Enter a valid phone number (7-15 digits)</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" autocomplete="new-password">
          @if (f['password'].hasError('minlength') && f['password'].touched) {
            <mat-error>Minimum 8 characters</mat-error>
          }
          @if (f['password'].hasError('pattern') && f['password'].touched) {
            <mat-error>Must contain uppercase letter and digit</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Confirm Password</mat-label>
          <input matInput type="password" formControlName="confirmPassword" autocomplete="new-password">
          @if (f['confirmPassword'].hasError('passwordMismatch') && f['confirmPassword'].touched) {
            <mat-error>Passwords do not match</mat-error>
          }
        </mat-form-field>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Blood Group</mat-label>
            <mat-select formControlName="bloodGroup">
              @for (bg of bloodGroups; track bg) {
                <mat-option [value]="bg">{{ bg }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Date of Birth</mat-label>
            <input matInput type="date" formControlName="dateOfBirth">
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Address</mat-label>
          <input matInput formControlName="address">
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" class="submit-btn"
                [disabled]="form.invalid || loading">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
      <div class="auth-links">
        Already have an account? <a routerLink="/auth/login">Sign in</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-form { display: flex; flex-direction: column; }
    h2 { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; }
    .subtitle { opacity: 0.6; font-size: 0.9rem; margin: 0 0 1.25rem; }
    form { display: flex; flex-direction: column; gap: 0.1rem; }
    mat-form-field { width: 100%; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .submit-btn { width: 100%; margin-top: 0.5rem; height: 44px; }
    .auth-links { text-align: center; margin-top: 1.25rem; font-size: 0.85rem; }
    .auth-links a { color: #0284c7; text-decoration: none; }
  `]
})
export class RegisterPatientComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  bloodGroups = BLOOD_GROUPS;
  loading = false;

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/)]],
    confirmPassword: ['', Validators.required],
    bloodGroup: [''],
    dateOfBirth: [''],
    address: ['', Validators.required]
  }, { validators: passwordMatchValidator('password', 'confirmPassword') });

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const v = this.form.value;
    this.authService.registerPatient({ ...v } as any).subscribe({
      next: (msg) => {
        this.snack.open(msg, 'OK', { duration: 4000 });
        this.router.navigate(['/auth/verify-otp'], { queryParams: { email: v.email } });
      },
      error: () => { this.loading = false; }
    });
  }
}
