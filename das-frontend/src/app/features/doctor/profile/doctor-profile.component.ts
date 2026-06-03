import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DoctorService } from '../../../core/services/doctor.service';
import { DepartmentService } from '../../../core/services/department.service';
import { DoctorProfile } from '../../../core/models/doctor.model';
import { Department } from '../../../core/models/department.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, PageHeaderComponent],
  template: `
    <app-page-header title="My Profile" subtitle="Manage your professional information" />
    @if (profile()) {
      <div class="profile-card">
        <form [formGroup]="form" (ngSubmit)="onSave()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Full Name</mat-label>
              <input matInput [value]="profile()!.fullName" readonly>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput [value]="profile()!.email" readonly>
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline">
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phoneNumber">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select formControlName="departmentId">
              @for (d of departments(); track d.id) {
                <mat-option [value]="d.id">{{ d.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Qualifications</mat-label>
            <input matInput formControlName="qualifications">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Bio</mat-label>
            <textarea matInput rows="3" formControlName="bio"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Consultation Fee (₹)</mat-label>
            <input matInput type="number" formControlName="consultationFee">
          </mat-form-field>
          <div class="form-actions">
            <div class="approval-badge" [class.approved]="profile()!.isApproved">
              <i [class]="'ti ' + (profile()!.isApproved ? 'ti-circle-check' : 'ti-clock')" aria-hidden="true"></i>
              {{ profile()!.isApproved ? 'Approved' : 'Pending approval' }}
            </div>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving">
              {{ saving ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>
        </form>
      </div>
    }
  `,
  styles: [`
    .profile-card { max-width: 680px; }
    form { display: flex; flex-direction: column; gap: 0.1rem; }
    mat-form-field { width: 100%; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .form-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 1rem; }
    .approval-badge { display: flex; align-items: center; gap: 0.4rem;
      font-size: 0.85rem; padding: 0.3rem 0.8rem; border-radius: 999px;
      background: #fef3c7; color: #92400e; }
    .approval-badge.approved { background: #d1fae5; color: #065f46; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class DoctorProfileComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private deptService = inject(DepartmentService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  profile = signal<DoctorProfile | null>(null);
  departments = signal<Department[]>([]);
  saving = false;

  form = this.fb.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
    departmentId: ['', Validators.required],
    qualifications: ['', Validators.required],
    bio: [''],
    consultationFee: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.deptService.getAll().subscribe(d => this.departments.set(d));
    this.doctorService.getProfile().subscribe(p => {
      this.profile.set(p);
      this.form.patchValue({
        phoneNumber: p.phoneNumber, departmentId: p.departmentId,
        qualifications: p.qualifications, bio: p.bio, consultationFee: p.consultationFee
      });
    });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.doctorService.updateProfile(this.form.value as any).subscribe({
      next: (msg) => { this.snack.open(msg, 'OK', { duration: 3000 }); this.saving = false; },
      error: () => { this.saving = false; }
    });
  }
}
