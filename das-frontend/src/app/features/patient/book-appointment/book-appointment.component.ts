import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AvailabilityService } from '../../../core/services/availability.service';
import { DoctorProfile } from '../../../core/models/doctor.model';
import { AvailabilityResponse } from '../../../core/models/availability.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';
import { futureDateValidator } from '../../../shared/validators/future-date.validator';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, PageHeaderComponent, TimeFormatPipe],
  template: `
    <app-page-header title="Book Appointment" subtitle="Schedule a consultation with your doctor" />
    @if (doctor()) {
      <div class="booking-layout">
        <div class="doctor-info-card">
          <div class="doc-avatar">{{ doctor()!.fullName.charAt(0) }}</div>
          <div>
            <h2>{{ doctor()!.fullName }}</h2>
            <p>{{ doctor()!.departmentName }}</p>
            <p class="quals">{{ doctor()!.qualifications }}</p>
            <p class="fee">₹{{ doctor()!.consultationFee }} per consultation</p>
          </div>
        </div>
        @if (availability().length > 0) {
          <div class="avail-info">
            <h3>Available Hours</h3>
            <div class="avail-chips">
              @for (slot of availability(); track slot.id) {
                @if (slot.isAvailable) {
                  <span class="avail-chip">
                    {{ slot.dayOfWeek }}: {{ slot.startTime | timeFormat }} – {{ slot.endTime | timeFormat }}
                  </span>
                }
              }
            </div>
          </div>
        }
        <form [formGroup]="form" (ngSubmit)="onBook()" class="book-form">
          <mat-form-field appearance="outline">
            <mat-label>Appointment Date & Time</mat-label>
            <input matInput type="datetime-local" formControlName="scheduledAt">
            @if (form.get('scheduledAt')?.hasError('pastDate') && form.get('scheduledAt')?.touched) {
              <mat-error>Appointment must be in the future</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Reason for Visit</mat-label>
            <textarea matInput rows="3" formControlName="reason" maxlength="500"
              placeholder="Describe your symptoms or reason for the appointment..."></textarea>
            @if (form.get('reason')?.invalid && form.get('reason')?.touched) {
              <mat-error>Reason is required</mat-error>
            }
          </mat-form-field>
          <div class="form-actions">
            <button mat-flat-button color="primary" type="submit"
                    [disabled]="form.invalid || booking">
              {{ booking ? 'Booking...' : 'Confirm Booking' }}
            </button>
            <button mat-button type="button" (click)="router.navigate(['/patient/search-doctors'])">
              Back to Search
            </button>
          </div>
        </form>
      </div>
    }
  `,
  styles: [`
    .booking-layout { max-width: 560px; display: flex; flex-direction: column; gap: 1.25rem; }
    .doctor-info-card { display: flex; gap: 1rem; padding: 1.25rem;
      border-radius: 12px; border: 1px solid var(--mat-app-outline-variant); }
    .doc-avatar { width: 56px; height: 56px; border-radius: 50%; background: #0284c7;
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; font-weight: 600; flex-shrink: 0; }
    h2 { margin: 0 0 0.25rem; font-size: 1.1rem; font-weight: 600; }
    p { margin: 0 0 0.15rem; font-size: 0.82rem; opacity: 0.65; }
    .fee { color: #0284c7; opacity: 1 !important; font-weight: 500; }
    .avail-info h3 { font-size: 0.9rem; font-weight: 600; margin: 0 0 0.5rem; }
    .avail-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .avail-chip { padding: 0.2rem 0.6rem; background: #e0f2fe; color: #075985;
      border-radius: 999px; font-size: 0.78rem; }
    .book-form { display: flex; flex-direction: column; gap: 0.5rem; }
    mat-form-field { width: 100%; }
    .form-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; align-items: center; }
  `]
})
export class BookAppointmentComponent implements OnInit {
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private apptService = inject(AppointmentService);
  private doctorService = inject(DoctorService);
  private availService = inject(AvailabilityService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  doctor = signal<DoctorProfile | null>(null);
  availability = signal<AvailabilityResponse[]>([]);
  booking = false;

  form = this.fb.group({
    scheduledAt: ['', [Validators.required, futureDateValidator]],
    reason: ['', [Validators.required, Validators.maxLength(500)]]
  });

  ngOnInit(): void {
    const doctorId = this.route.snapshot.queryParamMap.get('doctorId') ?? '';
    if (!doctorId) { this.router.navigate(['/patient/search-doctors']); return; }
    this.doctorService.getById(doctorId).subscribe(d => this.doctor.set(d));
    this.availService.getByDoctor(doctorId).subscribe(s => this.availability.set(s));
  }

  onBook(): void {
    if (this.form.invalid || !this.doctor()) return;
    this.booking = true;
    const v = this.form.value;
    this.apptService.book({
      doctorId: this.doctor()!.id,
      scheduledAt: new Date(v.scheduledAt!).toISOString(),
      reason: v.reason!
    }).subscribe({
      next: () => {
        this.snack.open('Appointment booked successfully!', 'OK', { duration: 4000 });
        this.router.navigate(['/patient/appointments']);
      },
      error: () => { this.booking = false; }
    });
  }
}
