import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { PatientProfile, UpdatePatientProfileRequest } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/patients`;

  getProfile(): Observable<PatientProfile> {
    return this.http.get<ApiResponse<PatientProfile>>(`${this.base}/profile`)
      .pipe(map(r => r.data));
  }

  updateProfile(body: UpdatePatientProfileRequest): Observable<string> {
    return this.http.put<ApiResponse<null>>(`${this.base}/profile`, body)
      .pipe(map(r => r.message));
  }
}
