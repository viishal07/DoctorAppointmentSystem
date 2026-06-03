import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from '../models/department.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/departments`;

  getAll(): Observable<Department[]> {
    return this.http.get<ApiResponse<Department[]>>(this.base).pipe(map(r => r.data));
  }

  getById(id: string): Observable<Department> {
    return this.http.get<ApiResponse<Department>>(`${this.base}/${id}`).pipe(map(r => r.data));
  }

  create(body: CreateDepartmentRequest): Observable<Department> {
    return this.http.post<ApiResponse<Department>>(this.base, body).pipe(map(r => r.data));
  }

  update(id: string, body: UpdateDepartmentRequest): Observable<string> {
    return this.http.put<ApiResponse<null>>(`${this.base}/${id}`, body).pipe(map(r => r.message));
  }
}
