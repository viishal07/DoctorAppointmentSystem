export type AppointmentStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
export interface BookAppointmentRequest { doctorId: string; scheduledAt: string; reason: string; }
export interface AppointmentResponse {
  id: string; doctorName: string; patientName: string; departmentName: string;
  scheduledAt: string; status: AppointmentStatus; reason: string; notes?: string; createdAt: string;
}
export interface AppointmentSummary {
  id: string; doctorName: string; patientName: string; scheduledAt: string; status: AppointmentStatus;
}
export interface UpdateAppointmentStatusRequest { notes?: string; }
