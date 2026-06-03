export interface DashboardStats {
  totalDoctors: number; pendingDoctorApprovals: number; totalPatients: number;
  totalAppointments: number; todayAppointments: number; pendingAppointments: number;
}
export interface UserList {
  id: string; fullName: string; email: string; role: string; isActive: boolean; createdAt: string;
}
