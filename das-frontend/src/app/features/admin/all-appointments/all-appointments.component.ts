import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AppointmentSummary } from '../../../core/models/appointment.model';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-all-appointments',
  standalone: true,
  imports: [CommonModule, AppointmentCardComponent, PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header title="All Appointments" subtitle="System-wide appointment history" />
    @if (appointments().length > 0) {
      <div class="list">
        @for (a of appointments(); track a.id) {
          <app-appointment-card [appointment]="a" />
        }
      </div>
    } @else {
      <app-empty-state message="No appointments found" icon="ti-calendar" />
    }
  `,
  styles: [`.list { display: flex; flex-direction: column; gap: 0.75rem; }`]
})
export class AllAppointmentsComponent implements OnInit {
  private adminService = inject(AdminService);
  appointments = signal<AppointmentSummary[]>([]);

  ngOnInit(): void {
    this.adminService.getAllAppointments().subscribe(a => this.appointments.set(a));
  }
}
