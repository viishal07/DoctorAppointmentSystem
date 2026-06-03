import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  LoginRequest, LoginResponse, RegisterPatientRequest,
  RegisterDoctorRequest, ForgotPasswordRequest,
  ResetPasswordRequest, VerifyOtpRequest
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/auth`;

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.base}/login`, body)
      .pipe(map(r => r.data));
  }

  registerPatient(body: RegisterPatientRequest): Observable<string> {
    return this.http.post<ApiResponse<null>>(`${this.base}/register/patient`, body)
      .pipe(map(r => r.message));
  }

  registerDoctor(body: RegisterDoctorRequest): Observable<string> {
    return this.http.post<ApiResponse<null>>(`${this.base}/register/doctor`, body)
      .pipe(map(r => r.message));
  }

  forgotPassword(body: ForgotPasswordRequest): Observable<string> {
    return this.http.post<ApiResponse<null>>(`${this.base}/forgot-password`, body)
      .pipe(map(r => r.message));
  }

  resetPassword(body: ResetPasswordRequest): Observable<string> {
    return this.http.post<ApiResponse<null>>(`${this.base}/reset-password`, body)
      .pipe(map(r => r.message));
  }

  verifyOtp(body: VerifyOtpRequest): Observable<string> {
    return this.http.post<ApiResponse<null>>(`${this.base}/verify-otp`, body)
      .pipe(map(r => r.message));
  }
}
