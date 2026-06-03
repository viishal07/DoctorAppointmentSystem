import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../../layouts/auth-layout/auth-layout.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
      { path: 'register-patient', loadComponent: () => import('./register-patient/register-patient.component').then(m => m.RegisterPatientComponent) },
      { path: 'register-doctor', loadComponent: () => import('./register-doctor/register-doctor.component').then(m => m.RegisterDoctorComponent) },
      { path: 'verify-otp', loadComponent: () => import('./verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent) },
      { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
      { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];
