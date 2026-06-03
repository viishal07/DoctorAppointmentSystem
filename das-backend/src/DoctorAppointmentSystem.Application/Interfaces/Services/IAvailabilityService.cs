using DoctorAppointmentSystem.Application.DTOs.Availability;

namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IAvailabilityService
{
    Task<IEnumerable<AvailabilityResponseDto>> GetByDoctorIdAsync(Guid doctorId);
    Task SetAvailabilityAsync(string doctorAppUserId, SetAvailabilityDto dto);
}
