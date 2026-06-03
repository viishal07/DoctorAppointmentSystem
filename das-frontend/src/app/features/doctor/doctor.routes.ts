import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const doctorRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Doctor'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./profile/doctor-profile.component').then(m => m.DoctorProfileComponent) },
      { path: 'availability', loadComponent: () => import('./availability/doctor-availability.component').then(m => m.DoctorAvailabilityComponent) },
      { path: 'appointments', loadComponent: () => import('./appointments/doctor-appointments.component').then(m => m.DoctorAppointmentsComponent) },
      { path: 'issue-prescription', loadComponent: () => import('./issue-prescription/issue-prescription.component').then(m => m.IssuePrescriptionComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
