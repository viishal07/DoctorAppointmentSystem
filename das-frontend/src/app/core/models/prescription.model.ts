export interface CreatePrescriptionRequest {
  appointmentId: string; diagnosis: string; medications: string; instructions: string;
}
export interface PrescriptionResponse {
  id: string; appointmentId: string; doctorName: string; patientName: string;
  diagnosis: string; medications: string; instructions: string; issuedAt: string;
}
