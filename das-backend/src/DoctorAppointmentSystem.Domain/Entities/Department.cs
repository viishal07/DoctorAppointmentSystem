using DoctorAppointmentSystem.Domain.Common;

namespace DoctorAppointmentSystem.Domain.Entities;

public class Department : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Navigation Properties
    public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}
