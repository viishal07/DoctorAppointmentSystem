import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: 'doctor',
    loadChildren: () => import('./features/doctor/doctor.routes').then(m => m.doctorRoutes)
  },
  {
    path: 'patient',
    loadChildren: () => import('./features/patient/patient.routes').then(m => m.patientRoutes)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
