using DoctorAppointmentSystem.Application.DTOs.Patient;

namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IPatientService
{
    Task<PatientProfileDto> GetProfileAsync(string appUserId);
    Task UpdateProfileAsync(string appUserId, UpdatePatientProfileDto dto);
}
