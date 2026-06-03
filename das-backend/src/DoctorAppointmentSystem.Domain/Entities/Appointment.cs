using DoctorAppointmentSystem.Domain.Common;
using DoctorAppointmentSystem.Domain.Enums;

namespace DoctorAppointmentSystem.Domain.Entities;

public class Appointment : BaseEntity
{
    public Guid DoctorId { get; set; }
    public Guid PatientId { get; set; }

    public DateTime ScheduledAt { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

    public string Reason { get; set; } = string.Empty;

    // Optional internal notes added by the doctor
    public string? Notes { get; set; }

    // Navigation Properties
    public Doctor Doctor { get; set; } = null!;
    public Patient Patient { get; set; } = null!;
    public Prescription? Prescription { get; set; }
}
