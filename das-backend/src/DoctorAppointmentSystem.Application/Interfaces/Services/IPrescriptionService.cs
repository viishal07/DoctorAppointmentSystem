using DoctorAppointmentSystem.Application.DTOs.Prescription;

namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IPrescriptionService
{
    Task<PrescriptionResponseDto> CreatePrescriptionAsync(string doctorAppUserId, CreatePrescriptionDto dto);
    Task<PrescriptionResponseDto> GetByIdAsync(Guid prescriptionId, string currentUserId, bool isAdmin);
    Task<IEnumerable<PrescriptionResponseDto>> GetByPatientIdAsync(Guid patientId, string currentUserId, bool isAdmin);
    Task<IEnumerable<PrescriptionResponseDto>> GetDoctorPrescriptionsAsync(string doctorAppUserId);
}
