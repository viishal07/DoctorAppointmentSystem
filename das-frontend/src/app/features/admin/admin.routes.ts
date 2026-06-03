import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from '../../layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'pending-doctors', loadComponent: () => import('./pending-doctors/pending-doctors.component').then(m => m.PendingDoctorsComponent) },
      { path: 'all-appointments', loadComponent: () => import('./all-appointments/all-appointments.component').then(m => m.AllAppointmentsComponent) },
      { path: 'departments', loadComponent: () => import('./departments/departments.component').then(m => m.DepartmentsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
