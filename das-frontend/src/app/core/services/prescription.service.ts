import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CreatePrescriptionRequest, PrescriptionResponse } from '../models/prescription.model';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/prescriptions`;

  create(body: CreatePrescriptionRequest): Observable<PrescriptionResponse> {
    return this.http.post<ApiResponse<PrescriptionResponse>>(this.base, body)
      .pipe(map(r => r.data));
  }

  getById(id: string): Observable<PrescriptionResponse> {
    return this.http.get<ApiResponse<PrescriptionResponse>>(`${this.base}/${id}`)
      .pipe(map(r => r.data));
  }

  getByPatient(patientId: string): Observable<PrescriptionResponse[]> {
    return this.http.get<ApiResponse<PrescriptionResponse[]>>(`${this.base}/patient/${patientId}`)
      .pipe(map(r => r.data));
  }

  getDoctorPrescriptions(): Observable<PrescriptionResponse[]> {
    return this.http.get<ApiResponse<PrescriptionResponse[]>>(`${this.base}/doctor`)
      .pipe(map(r => r.data));
  }
}
