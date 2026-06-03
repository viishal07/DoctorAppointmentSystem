using DoctorAppointmentSystem.Domain.Enums;

namespace DoctorAppointmentSystem.Application.DTOs.Appointment;

public class BookAppointmentDto
{
    public Guid DoctorId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class AppointmentResponseDto
{
    public Guid Id { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public DateTime ScheduledAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AppointmentSummaryDto
{
    public Guid Id { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public DateTime ScheduledAt { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class UpdateAppointmentStatusDto
{
    // Optional doctor notes when approving or rejecting
    public string? Notes { get; set; }
}
