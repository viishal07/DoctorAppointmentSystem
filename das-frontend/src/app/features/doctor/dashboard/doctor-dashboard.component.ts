import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentSummary } from '../../../core/models/appointment.model';
import { DoctorProfile } from '../../../core/models/doctor.model';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, AppointmentCardComponent,
    StatCardComponent, PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header [title]="'Welcome, Dr. ' + (profile()?.fullName ?? '')" subtitle="Your appointments overview" />
    @if (!profile()?.isApproved) {
      <div class="pending-notice">
        <i class="ti ti-info-circle" aria-hidden="true"></i>
        Your account is pending admin approval. You cannot accept appointments yet.
      </div>
    }
    <div class="stats-row">
      <app-stat-card label="Total Appointments" [value]="appointments().length" icon="ti-calendar" color="teal" />
      <app-stat-card label="Pending Review" [value]="pendingCount()" icon="ti-clock" color="amber" />
      <app-stat-card label="Approved" [value]="approvedCount()" icon="ti-check" color="green" />
    </div>
    <div class="section-header">
      <h2>Recent Appointments</h2>
      <a mat-stroked-button routerLink="/doctor/appointments">View all</a>
    </div>
    @if (recent().length > 0) {
      <div class="list">
        @for (a of recent(); track a.id) {
          <app-appointment-card [appointment]="a" />
        }
      </div>
    } @else {
      <app-empty-state message="No appointments yet" icon="ti-calendar" />
    }
  `,
  styles: [`
    .pending-notice { display: flex; align-items: center; gap: 0.5rem;
      padding: 0.85rem 1rem; border-radius: 8px; background: #fef3c7; color: #92400e;
      font-size: 0.87rem; margin-bottom: 1.25rem; }
    .stats-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr));
      gap: 1rem; margin-bottom: 1.5rem; }
    .section-header { display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 0.75rem; }
    .section-header h2 { font-size: 1.1rem; font-weight: 600; margin: 0; }
    .list { display: flex; flex-direction: column; gap: 0.75rem; }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  private apptService = inject(AppointmentService);
  private doctorService = inject(DoctorService);

  profile = signal<DoctorProfile | null>(null);
  appointments = signal<AppointmentSummary[]>([]);

  get pendingCount() { return () => this.appointments().filter(a => a.status === 'Pending').length; }
  get approvedCount() { return () => this.appointments().filter(a => a.status === 'Approved').length; }
  get recent() { return () => this.appointments().slice(0, 5); }

  ngOnInit(): void {
    this.doctorService.getProfile().subscribe(p => this.profile.set(p));
    this.apptService.getDoctorAppointments().subscribe(a => this.appointments.set(a));
  }
}
