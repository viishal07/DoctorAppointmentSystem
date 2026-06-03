import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const patientRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent) },
      { path: 'search-doctors', loadComponent: () => import('./search-doctors/search-doctors.component').then(m => m.SearchDoctorsComponent) },
      { path: 'book-appointment', loadComponent: () => import('./book-appointment/book-appointment.component').then(m => m.BookAppointmentComponent) },
      { path: 'appointments', loadComponent: () => import('./appointments/patient-appointments.component').then(m => m.PatientAppointmentsComponent) },
      { path: 'prescriptions', loadComponent: () => import('./prescriptions/patient-prescriptions.component').then(m => m.PatientPrescriptionsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
