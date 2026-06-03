using DoctorAppointmentSystem.Domain.Common;

namespace DoctorAppointmentSystem.Domain.Entities;

public class Insurance : BaseEntity
{
    public string ProviderName { get; set; } = string.Empty;
    public string PolicyNumber { get; set; } = string.Empty;
    public string CoverageDetails { get; set; } = string.Empty;

    // Navigation Properties
    public ICollection<Patient> Patients { get; set; } = new List<Patient>();
}
