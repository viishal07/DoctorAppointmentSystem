import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AppointmentSummary } from '../../../core/models/appointment.model';
import { PrescriptionResponse } from '../../../core/models/prescription.model';
import { PrescriptionCardComponent } from '../../../shared/components/prescription-card/prescription-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-issue-prescription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule,
    PrescriptionCardComponent, PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header title="Issue Prescription" subtitle="Create prescriptions for approved appointments" />
    <div class="two-col">
      <div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-panel">
          <mat-form-field appearance="outline">
            <mat-label>Appointment</mat-label>
            <mat-select formControlName="appointmentId">
              @for (a of approvedAppointments(); track a.id) {
                <mat-option [value]="a.id">
                  {{ a.patientName }} — {{ a.scheduledAt | date:'mediumDate' }}
                </mat-option>
              }
            </mat-select>
            @if (approvedAppointments().length === 0) {
              <mat-hint>No approved appointments available</mat-hint>
            }
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Diagnosis</mat-label>
            <textarea matInput rows="2" formControlName="diagnosis" maxlength="1000"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Medications</mat-label>
            <textarea matInput rows="3" formControlName="medications" maxlength="2000"
              placeholder="Paracetamol 500mg twice daily for 5 days..."></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Instructions</mat-label>
            <textarea matInput rows="2" formControlName="instructions" maxlength="2000"
              placeholder="Take after meals, rest well..."></textarea>
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit"
                  [disabled]="form.invalid || saving || approvedAppointments().length === 0">
            {{ saving ? 'Issuing...' : 'Issue Prescription' }}
          </button>
        </form>
      </div>
      <div>
        <h3 class="side-title">Recent Prescriptions</h3>
        @if (recent().length > 0) {
          <div class="rx-list">
            @for (rx of recent(); track rx.id) {
              <app-prescription-card [prescription]="rx" />
            }
          </div>
        } @else {
          <app-empty-state message="No prescriptions issued yet" icon="ti-prescription" />
        }
      </div>
    </div>
  `,
  styles: [`
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
    .form-panel { display: flex; flex-direction: column; gap: 0.5rem; }
    mat-form-field { width: 100%; }
    .side-title { font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem; }
    .rx-list { display: flex; flex-direction: column; gap: 0.75rem; }
    @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }
  `]
})
export class IssuePrescriptionComponent implements OnInit {
  private prescriptionService = inject(PrescriptionService);
  private apptService = inject(AppointmentService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  approvedAppointments = signal<AppointmentSummary[]>([]);
  recent = signal<PrescriptionResponse[]>([]);
  saving = false;

  form = this.fb.group({
    appointmentId: ['', Validators.required],
    diagnosis: ['', [Validators.required, Validators.maxLength(1000)]],
    medications: ['', [Validators.required, Validators.maxLength(2000)]],
    instructions: ['', Validators.maxLength(2000)]
  });

  ngOnInit(): void {
    this.apptService.getDoctorAppointments().subscribe(all => {
      this.approvedAppointments.set(all.filter(a => a.status === 'Approved'));
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.prescriptionService.create(this.form.value as any).subscribe({
      next: (rx) => {
        this.snack.open('Prescription issued successfully', 'OK', { duration: 3000 });
        this.recent.update(list => [rx, ...list]);
        this.form.reset();
        this.saving = false;
        this.apptService.getDoctorAppointments().subscribe(all =>
          this.approvedAppointments.set(all.filter(a => a.status === 'Approved'))
        );
      },
      error: () => { this.saving = false; }
    });
  }
}
