using DoctorAppointmentSystem.Domain.Common;
using DoctorAppointmentSystem.Domain.Enums;

namespace DoctorAppointmentSystem.Domain.Entities;

public class DoctorAvailability : BaseEntity
{
    public Guid DoctorId { get; set; }

    public AvailabilityDay DayOfWeek { get; set; }

    // Stored as TimeOnly — no date part needed
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }

    public bool IsAvailable { get; set; } = true;

    // Navigation Properties
    public Doctor Doctor { get; set; } = null!;
}
