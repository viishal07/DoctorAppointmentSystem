import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/department.model';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-register-doctor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <div class="auth-form">
      <h2>Register as Doctor</h2>
      <p class="subtitle">Your account will be reviewed by an admin before activation</p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName">
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Phone Number</mat-label>
          <input matInput formControlName="phoneNumber">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <mat-select formControlName="departmentId">
            @for (dept of departments(); track dept.id) {
              <mat-option [value]="dept.id">{{ dept.name }}</mat-option>
            }
          </mat-select>
          @if (f['departmentId'].invalid && f['departmentId'].touched) {
            <mat-error>Department is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>License Number</mat-label>
          <input matInput formControlName="licenseNumber">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Qualifications</mat-label>
          <input matInput formControlName="qualifications" placeholder="MBBS, MD Cardiology...">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Bio</mat-label>
          <textarea matInput rows="3" formControlName="bio"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Consultation Fee (₹)</mat-label>
          <input matInput type="number" formControlName="consultationFee" min="1">
          @if (f['consultationFee'].hasError('min') && f['consultationFee'].touched) {
            <mat-error>Fee must be greater than 0</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" autocomplete="new-password">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Confirm Password</mat-label>
          <input matInput type="password" formControlName="confirmPassword" autocomplete="new-password">
          @if (f['confirmPassword'].hasError('passwordMismatch') && f['confirmPassword'].touched) {
            <mat-error>Passwords do not match</mat-error>
          }
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" class="submit-btn"
                [disabled]="form.invalid || loading">
          {{ loading ? 'Submitting...' : 'Submit for Approval' }}
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
    .subtitle { opacity: 0.6; font-size: 0.85rem; margin: 0 0 1.25rem; }
    form { display: flex; flex-direction: column; gap: 0.1rem; }
    mat-form-field { width: 100%; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .submit-btn { width: 100%; margin-top: 0.5rem; height: 44px; }
    .auth-links { text-align: center; margin-top: 1.25rem; font-size: 0.85rem; }
    .auth-links a { color: #0284c7; text-decoration: none; }
  `]
})
export class RegisterDoctorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private deptService = inject(DepartmentService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  departments = signal<Department[]>([]);
  loading = false;

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
    departmentId: ['', Validators.required],
    licenseNumber: ['', [Validators.required, Validators.maxLength(100)]],
    qualifications: ['', [Validators.required, Validators.maxLength(500)]],
    bio: [''],
    consultationFee: [0, [Validators.required, Validators.min(1)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator('password', 'confirmPassword') });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.deptService.getAll().subscribe(d => this.departments.set(d));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.registerDoctor(this.form.value as any).subscribe({
      next: (msg) => {
        this.snack.open(msg, 'OK', { duration: 5000 });
        this.router.navigate(['/auth/verify-otp'], { queryParams: { email: this.form.value.email } });
      },
      error: () => { this.loading = false; }
    });
  }
}
