using DoctorAppointmentSystem.Application.DTOs.Prescription;

namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IPrescriptionService
{
    Task<PrescriptionResponseDto> CreatePrescriptionAsync(string doctorAppUserId, CreatePrescriptionDto dto);
    Task<PrescriptionResponseDto> GetByIdAsync(Guid prescriptionId);
    Task<IEnumerable<PrescriptionResponseDto>> GetByPatientIdAsync(Guid patientId);
}
