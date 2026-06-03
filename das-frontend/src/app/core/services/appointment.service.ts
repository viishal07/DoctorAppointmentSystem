import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  BookAppointmentRequest, AppointmentResponse,
  AppointmentSummary, UpdateAppointmentStatusRequest
} from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/appointments`;

  book(body: BookAppointmentRequest): Observable<AppointmentResponse> {
    return this.http.post<ApiResponse<AppointmentResponse>>(this.base, body)
      .pipe(map(r => r.data));
  }

  getById(id: string): Observable<AppointmentResponse> {
    return this.http.get<ApiResponse<AppointmentResponse>>(`${this.base}/${id}`)
      .pipe(map(r => r.data));
  }

  getDoctorAppointments(): Observable<AppointmentSummary[]> {
    return this.http.get<ApiResponse<AppointmentSummary[]>>(`${this.base}/doctor`)
      .pipe(map(r => r.data));
  }

  getPatientAppointments(): Observable<AppointmentSummary[]> {
    return this.http.get<ApiResponse<AppointmentSummary[]>>(`${this.base}/patient`)
      .pipe(map(r => r.data));
  }

  approve(id: string, body: UpdateAppointmentStatusRequest): Observable<string> {
    return this.http.put<ApiResponse<null>>(`${this.base}/${id}/approve`, body)
      .pipe(map(r => r.message));
  }

  reject(id: string, body: UpdateAppointmentStatusRequest): Observable<string> {
    return this.http.put<ApiResponse<null>>(`${this.base}/${id}/reject`, body)
      .pipe(map(r => r.message));
  }

  cancel(id: string): Observable<string> {
    return this.http.put<ApiResponse<null>>(`${this.base}/${id}/cancel`, {})
      .pipe(map(r => r.message));
  }
}
