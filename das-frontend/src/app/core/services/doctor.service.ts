import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { DoctorProfile, DoctorSummary, UpdateDoctorProfileRequest, DoctorSearchParams } from '../models/doctor.model';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/doctors`;

  search(params?: DoctorSearchParams): Observable<DoctorSummary[]> {
    let httpParams = new HttpParams();
    if (params?.name) httpParams = httpParams.set('name', params.name);
    if (params?.departmentId) httpParams = httpParams.set('departmentId', params.departmentId);
    return this.http.get<ApiResponse<DoctorSummary[]>>(this.base, { params: httpParams })
      .pipe(map(r => r.data));
  }

  getById(id: string): Observable<DoctorProfile> {
    return this.http.get<ApiResponse<DoctorProfile>>(`${this.base}/${id}`)
      .pipe(map(r => r.data));
  }

  getProfile(): Observable<DoctorProfile> {
    return this.http.get<ApiResponse<DoctorProfile>>(`${this.base}/profile`)
      .pipe(map(r => r.data));
  }

  updateProfile(body: UpdateDoctorProfileRequest): Observable<string> {
    return this.http.put<ApiResponse<null>>(`${this.base}/profile`, body)
      .pipe(map(r => r.message));
  }
}
