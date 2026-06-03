export interface PatientProfile {
  id: string; fullName: string; email: string; phoneNumber: string;
  dateOfBirth?: string; bloodGroup: string; address: string; insuranceProvider?: string;
}
export interface UpdatePatientProfileRequest {
  phoneNumber: string; dateOfBirth?: string; bloodGroup: string; address: string; insuranceId?: string;
}
