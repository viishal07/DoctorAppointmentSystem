import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { SetAvailabilityRequest, AvailabilityResponse } from '../models/availability.model';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/availability`;

  getByDoctor(doctorId: string): Observable<AvailabilityResponse[]> {
    return this.http.get<ApiResponse<AvailabilityResponse[]>>(`${this.base}/${doctorId}`)
      .pipe(map(r => r.data));
  }

  set(body: SetAvailabilityRequest): Observable<string> {
    return this.http.post<ApiResponse<null>>(this.base, body)
      .pipe(map(r => r.message));
  }
}
