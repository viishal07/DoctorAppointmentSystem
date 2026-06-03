import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AppointmentSummary } from '../../../core/models/appointment.model';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule,
    AppointmentCardComponent, ConfirmDialogComponent,
    PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header title="My Appointments" subtitle="Your complete appointment history" />
    @if (appointments().length > 0) {
      <div class="list">
        @for (a of appointments(); track a.id) {
          <app-appointment-card [appointment]="a" [showActions]="a.status === 'Pending' || a.status === 'Approved'">
            @if (a.status === 'Pending' || a.status === 'Approved') {
              <button mat-stroked-button color="warn" (click)="cancel(a)">Cancel</button>
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
export class PatientAppointmentsComponent implements OnInit {
  private apptService = inject(AppointmentService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  appointments = signal<AppointmentSummary[]>([]);

  ngOnInit(): void { this.load(); }
  load(): void { this.apptService.getPatientAppointments().subscribe(a => this.appointments.set(a)); }

  cancel(a: AppointmentSummary): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Cancel Appointment', message: 'Are you sure you want to cancel this appointment?', confirmText: 'Yes, Cancel' }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.apptService.cancel(a.id).subscribe({ next: (msg) => { this.snack.open(msg, 'OK', { duration: 3000 }); this.load(); } });
    });
  }
}
