using DoctorAppointmentSystem.Application.DTOs.Doctor;

namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IDoctorService
{
    Task<DoctorProfileDto> GetProfileAsync(string appUserId);
    Task UpdateProfileAsync(string appUserId, UpdateDoctorProfileDto dto);
    Task<IEnumerable<DoctorSummaryDto>> SearchDoctorsAsync(DoctorSearchDto dto);
    Task<DoctorProfileDto> GetByIdAsync(Guid doctorId);
}
