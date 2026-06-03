export interface DoctorProfile {
  id: string; fullName: string; email: string; phoneNumber: string;
  departmentName: string; departmentId: string; qualifications: string;
  bio: string; licenseNumber: string; consultationFee: number; isApproved: boolean;
}
export interface DoctorSummary {
  id: string; fullName: string; departmentName: string; qualifications: string; consultationFee: number;
}
export interface UpdateDoctorProfileRequest {
  phoneNumber: string; departmentId: string; qualifications: string; bio: string; consultationFee: number;
}
export interface DoctorSearchParams { name?: string; departmentId?: string; }
