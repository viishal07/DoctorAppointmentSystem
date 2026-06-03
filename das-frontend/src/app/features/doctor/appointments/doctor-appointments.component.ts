import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AppointmentSummary } from '../../../core/models/appointment.model';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatDialogModule,
    AppointmentCardComponent, PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header title="Appointments" subtitle="Manage your patient appointments" />
    @if (appointments().length > 0) {
      <div class="list">
        @for (a of appointments(); track a.id) {
          <app-appointment-card [appointment]="a" [showActions]="true">
            @if (a.status === 'Pending') {
              <button mat-flat-button color="primary" (click)="changeStatus(a, 'approve')">Approve</button>
              <button mat-stroked-button color="warn" (click)="changeStatus(a, 'reject')">Reject</button>
            }
            @if (a.status === 'Pending' || a.status === 'Approved') {
              <button mat-button color="warn" (click)="cancel(a)">Cancel</button>
            }
          </app-appointment-card>
        }
      </div>
    } @else {
      <app-empty-state message="No appointments found" icon="ti-calendar" />
    }
  `,
  styles: [`.list { display: flex; flex-direction: column; gap: 0.75rem; }`]
})
export class DoctorAppointmentsComponent implements OnInit {
  private apptService = inject(AppointmentService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  appointments = signal<AppointmentSummary[]>([]);

  ngOnInit(): void { this.load(); }
  load(): void { this.apptService.getDoctorAppointments().subscribe(a => this.appointments.set(a)); }

  changeStatus(a: AppointmentSummary, action: 'approve' | 'reject'): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: action === 'approve' ? 'Approve Appointment' : 'Reject Appointment',
        message: `Are you sure you want to ${action} this appointment?`,
        confirmText: action === 'approve' ? 'Approve' : 'Reject' }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      const obs = action === 'approve'
        ? this.apptService.approve(a.id, {})
        : this.apptService.reject(a.id, {});
      obs.subscribe({ next: (msg) => { this.snack.open(msg, 'OK', { duration: 3000 }); this.load(); } });
    });
  }

  cancel(a: AppointmentSummary): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Cancel Appointment', message: 'Cancel this appointment?', confirmText: 'Yes, Cancel' }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.apptService.cancel(a.id).subscribe({ next: (msg) => { this.snack.open(msg, 'OK', { duration: 3000 }); this.load(); } });
    });
  }
}
