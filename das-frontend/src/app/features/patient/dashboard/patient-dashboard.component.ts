import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthStore } from '../../../core/stores/auth.store';
import { AppointmentSummary } from '../../../core/models/appointment.model';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule,
    AppointmentCardComponent, StatCardComponent, PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header [title]="'Welcome, ' + auth.fullName()" subtitle="Your health dashboard" />
    <div class="stats-row">
      <app-stat-card label="Total Appointments" [value]="appointments().length" icon="ti-calendar" color="teal" />
      <app-stat-card label="Pending" [value]="pending()" icon="ti-clock" color="amber" />
      <app-stat-card label="Completed" [value]="completed()" icon="ti-circle-check" color="green" />
    </div>
    <div class="section-header">
      <h2>Upcoming Appointments</h2>
      <a mat-stroked-button routerLink="/patient/appointments">View all</a>
    </div>
    @if (upcoming().length > 0) {
      <div class="list">
        @for (a of upcoming(); track a.id) {
          <app-appointment-card [appointment]="a" />
        }
      </div>
    } @else {
      <div class="no-appts">
        <app-empty-state message="No upcoming appointments" icon="ti-calendar" />
        <a mat-flat-button color="primary" routerLink="/patient/search-doctors">Book an appointment</a>
      </div>
    }
  `,
  styles: [`
    .stats-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr));
      gap: 1rem; margin-bottom: 1.5rem; }
    .section-header { display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 0.75rem; }
    .section-header h2 { font-size: 1.1rem; font-weight: 600; margin: 0; }
    .list { display: flex; flex-direction: column; gap: 0.75rem; }
    .no-appts { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem 0; }
  `]
})
export class PatientDashboardComponent implements OnInit {
  auth = inject(AuthStore);
  private apptService = inject(AppointmentService);

  appointments = signal<AppointmentSummary[]>([]);

  get pending() { return () => this.appointments().filter(a => a.status === 'Pending').length; }
  get completed() { return () => this.appointments().filter(a => a.status === 'Completed').length; }
  get upcoming() {
    return () => this.appointments()
      .filter(a => a.status === 'Pending' || a.status === 'Approved')
      .slice(0, 5);
  }

  ngOnInit(): void {
    this.apptService.getPatientAppointments().subscribe(a => this.appointments.set(a));
  }
}
