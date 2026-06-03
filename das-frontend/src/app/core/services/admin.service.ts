import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { DashboardStats, UserList } from '../models/admin.model';
import { AppointmentSummary } from '../models/appointment.model';
import { DoctorSummary } from '../models/doctor.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/admin`;

  getDashboard(): Observable<DashboardStats> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.base}/dashboard`)
      .pipe(map(r => r.data));
  }

  getUsers(): Observable<UserList[]> {
    return this.http.get<ApiResponse<UserList[]>>(`${this.base}/users`)
      .pipe(map(r => r.data));
  }

  toggleUserStatus(userId: string): Observable<string> {
    return this.http.put<ApiResponse<null>>(`${this.base}/users/${userId}/toggle-status`, {})
      .pipe(map(r => r.message));
  }

  getAllAppointments(): Observable<AppointmentSummary[]> {
    return this.http.get<ApiResponse<AppointmentSummary[]>>(`${this.base}/appointments`)
      .pipe(map(r => r.data));
  }

  getPendingDoctors(): Observable<DoctorSummary[]> {
    return this.http.get<ApiResponse<DoctorSummary[]>>(`${this.base}/doctors/pending`)
      .pipe(map(r => r.data));
  }

  approveDoctor(doctorId: string): Observable<string> {
    return this.http.put<ApiResponse<null>>(`${this.base}/doctors/${doctorId}/approve`, {})
      .pipe(map(r => r.message));
  }
}
