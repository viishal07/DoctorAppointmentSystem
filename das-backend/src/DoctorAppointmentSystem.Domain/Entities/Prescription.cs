using DoctorAppointmentSystem.Domain.Common;

namespace DoctorAppointmentSystem.Domain.Entities;

public class Prescription : BaseEntity
{
    public Guid AppointmentId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid PatientId { get; set; }

    public string Diagnosis { get; set; } = string.Empty;

    // Free-text medications list — e.g. "Paracetamol 500mg twice daily for 5 days"
    public string Medications { get; set; } = string.Empty;

    public string Instructions { get; set; } = string.Empty;

    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public Appointment Appointment { get; set; } = null!;
    public Doctor Doctor { get; set; } = null!;
    public Patient Patient { get; set; } = null!;
}
