using DoctorAppointmentSystem.Domain.Enums;

namespace DoctorAppointmentSystem.Application.DTOs.Availability;

public class SetAvailabilityDto
{
    public AvailabilityDay DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;
}

public class AvailabilityResponseDto
{
    public Guid Id { get; set; }
    public Guid DoctorId { get; set; }
    public string DayOfWeek { get; set; } = string.Empty;
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsAvailable { get; set; }
}
