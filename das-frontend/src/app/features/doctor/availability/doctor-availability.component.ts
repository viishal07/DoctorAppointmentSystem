import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvailabilityService } from '../../../core/services/availability.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AvailabilityResponse, AVAILABILITY_DAYS, AvailabilityDay } from '../../../core/models/availability.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';

@Component({
  selector: 'app-doctor-availability',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSlideToggleModule,
    PageHeaderComponent, TimeFormatPipe],
  template: `
    <app-page-header title="Availability" subtitle="Set your weekly consultation hours" />
    <div class="avail-grid">
      @for (day of days; track day) {
        <div class="day-row" [class.available]="getSlot(day)?.isAvailable">
          <div class="day-label">{{ day }}</div>
          <div class="day-times">
            @if (getSlot(day); as slot) {
              <span>{{ slot.startTime | timeFormat }} – {{ slot.endTime | timeFormat }}</span>
              <span class="avail-tag" [class.on]="slot.isAvailable">
                {{ slot.isAvailable ? 'Available' : 'Unavailable' }}
              </span>
            } @else {
              <span class="no-slot">Not set</span>
            }
          </div>
          <button mat-stroked-button (click)="openEdit(day)">
            {{ getSlot(day) ? 'Edit' : 'Set' }}
          </button>
        </div>
      }
    </div>
    @if (editingDay()) {
      <div class="edit-panel">
        <h3>Set availability for {{ editingDay() }}</h3>
        <form [formGroup]="form" (ngSubmit)="onSave()">
          <div class="time-row">
            <mat-form-field appearance="outline">
              <mat-label>Start Time</mat-label>
              <input matInput type="time" formControlName="startTime">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>End Time</mat-label>
              <input matInput type="time" formControlName="endTime">
            </mat-form-field>
          </div>
          <mat-slide-toggle formControlName="isAvailable">Mark as available</mat-slide-toggle>
          <div class="form-actions">
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
            <button mat-button type="button" (click)="editingDay.set(null)">Cancel</button>
          </div>
        </form>
      </div>
    }
  `,
  styles: [`
    .avail-grid { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
    .day-row { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem;
      border-radius: 8px; border: 1px solid var(--mat-app-outline-variant);
      background: var(--mat-app-surface); }
    .day-row.available { border-left: 4px solid #0f9b72; }
    .day-label { width: 100px; font-weight: 500; font-size: 0.9rem; flex-shrink: 0; }
    .day-times { flex: 1; font-size: 0.85rem; display: flex; align-items: center; gap: 0.75rem; }
    .no-slot { opacity: 0.4; }
    .avail-tag { padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 500; }
    .avail-tag.on { background: #d1fae5; color: #065f46; }
    .avail-tag:not(.on) { background: #fee2e2; color: #991b1b; }
    .edit-panel { max-width: 480px; padding: 1.25rem; border-radius: 12px;
      border: 1px solid var(--mat-app-outline-variant); }
    .edit-panel h3 { margin: 0 0 1rem; font-size: 1rem; font-weight: 600; }
    form { display: flex; flex-direction: column; gap: 0.75rem; }
    .time-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    mat-form-field { width: 100%; }
    .form-actions { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
  `]
})
export class DoctorAvailabilityComponent implements OnInit {
  private availService = inject(AvailabilityService);
  private doctorService = inject(DoctorService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  days = AVAILABILITY_DAYS;
  slots = signal<AvailabilityResponse[]>([]);
  editingDay = signal<AvailabilityDay | null>(null);
  saving = false;
  doctorId = '';

  form = this.fb.group({
    startTime: ['09:00', Validators.required],
    endTime: ['17:00', Validators.required],
    isAvailable: [true]
  });

  ngOnInit(): void {
    this.doctorService.getProfile().subscribe(p => {
      this.doctorId = p.id;
      this.availService.getByDoctor(p.id).subscribe(s => this.slots.set(s));
    });
  }

  getSlot(day: AvailabilityDay): AvailabilityResponse | undefined {
    return this.slots().find(s => s.dayOfWeek === day);
  }

  openEdit(day: AvailabilityDay): void {
    this.editingDay.set(day);
    const existing = this.getSlot(day);
    this.form.patchValue({
      startTime: existing?.startTime?.substring(0, 5) ?? '09:00',
      endTime: existing?.endTime?.substring(0, 5) ?? '17:00',
      isAvailable: existing?.isAvailable ?? true
    });
  }

  onSave(): void {
    if (this.form.invalid || !this.editingDay()) return;
    this.saving = true;
    const v = this.form.value;
    this.availService.set({
      dayOfWeek: this.editingDay()!,
      startTime: v.startTime! + ':00',
      endTime: v.endTime! + ':00',
      isAvailable: v.isAvailable ?? true
    }).subscribe({
      next: (msg) => {
        this.snack.open(msg, 'OK', { duration: 3000 });
        this.saving = false;
        this.editingDay.set(null);
        this.availService.getByDoctor(this.doctorId).subscribe(s => this.slots.set(s));
      },
      error: () => { this.saving = false; }
    });
  }
}
