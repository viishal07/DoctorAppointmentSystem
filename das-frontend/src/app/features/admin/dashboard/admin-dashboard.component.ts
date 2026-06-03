import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardStats } from '../../../core/models/admin.model';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Admin Dashboard" subtitle="System overview and statistics" />
    @if (stats()) {
      <div class="stats-grid">
        <app-stat-card label="Total Doctors" [value]="stats()!.totalDoctors" icon="ti-stethoscope" color="teal" />
        <app-stat-card label="Pending Approvals" [value]="stats()!.pendingDoctorApprovals" icon="ti-user-check" color="amber" />
        <app-stat-card label="Total Patients" [value]="stats()!.totalPatients" icon="ti-users" color="blue" />
        <app-stat-card label="Total Appointments" [value]="stats()!.totalAppointments" icon="ti-calendar" color="purple" />
        <app-stat-card label="Today's Appointments" [value]="stats()!.todayAppointments" icon="ti-calendar-event" color="coral" />
        <app-stat-card label="Pending Appointments" [value]="stats()!.pendingAppointments" icon="ti-clock" color="green" />
      </div>
    } @else if (!loading()) {
      <p class="error-msg">Failed to load dashboard data.</p>
    }
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
    .error-msg { opacity: 0.6; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  stats = signal<DashboardStats | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: (s) => { this.stats.set(s); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
