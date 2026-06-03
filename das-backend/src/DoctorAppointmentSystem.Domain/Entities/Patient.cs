using DoctorAppointmentSystem.Domain.Common;

namespace DoctorAppointmentSystem.Domain.Entities;

public class Patient : BaseEntity
{
    public string AppUserId { get; set; } = string.Empty;

    // InsuranceId is optional — a patient may or may not have insurance
    public Guid? InsuranceId { get; set; }

    public DateTime? DateOfBirth { get; set; }
    public string BloodGroup { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    // Navigation Properties
    public AppUser AppUser { get; set; } = null!;
    public Insurance? Insurance { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}
