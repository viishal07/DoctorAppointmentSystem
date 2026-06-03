using DoctorAppointmentSystem.Domain.Common;

namespace DoctorAppointmentSystem.Domain.Entities;

public class Doctor : BaseEntity
{
    public string AppUserId { get; set; } = string.Empty;
    public Guid DepartmentId { get; set; }

    public string Qualifications { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;

    public decimal ConsultationFee { get; set; }

    public bool IsApproved { get; set; } = false;

    // Navigation Properties
    public AppUser AppUser { get; set; } = null!;
    public Department Department { get; set; } = null!;

    public ICollection<DoctorAvailability> Availabilities { get; set; } = new List<DoctorAvailability>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}
