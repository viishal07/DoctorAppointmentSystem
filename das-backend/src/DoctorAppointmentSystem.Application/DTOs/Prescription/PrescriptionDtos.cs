namespace DoctorAppointmentSystem.Application.DTOs.Prescription;

public class CreatePrescriptionDto
{
    public Guid AppointmentId { get; set; }
    public string Diagnosis { get; set; } = string.Empty;
    public string Medications { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
}

public class PrescriptionResponseDto
{
    public Guid Id { get; set; }
    public Guid AppointmentId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Medications { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public DateTime IssuedAt { get; set; }
}
