export type UserRole = 'Admin' | 'Doctor' | 'Patient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  fullName: string;
  role: UserRole;
  expiresAt: string;
}

export interface RegisterPatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  bloodGroup: string;
  address: string;
}

export interface RegisterDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  departmentId: string;
  qualifications: string;
  bio: string;
  licenseNumber: string;
  consultationFee: number;
}

export interface ForgotPasswordRequest { email: string; }
export interface ResetPasswordRequest { email: string; otpCode: string; newPassword: string; confirmPassword: string; }
export interface VerifyOtpRequest { email: string; otpCode: string; }
