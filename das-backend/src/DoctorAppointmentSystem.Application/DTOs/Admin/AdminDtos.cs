namespace DoctorAppointmentSystem.Application.DTOs.Admin;

public class DashboardStatsDto
{
    public int TotalDoctors { get; set; }
    public int PendingDoctorApprovals { get; set; }
    public int TotalPatients { get; set; }
    public int TotalAppointments { get; set; }
    public int TodayAppointments { get; set; }
    public int PendingAppointments { get; set; }
}

public class UserListDto
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
