using DoctorAppointmentSystem.Application.DTOs.Appointment;

namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IAppointmentService
{
    Task<AppointmentResponseDto> BookAppointmentAsync(string patientAppUserId, BookAppointmentDto dto);
    Task<AppointmentResponseDto> GetByIdAsync(Guid appointmentId, string currentUserId, bool isAdmin);
    Task<IEnumerable<AppointmentSummaryDto>> GetDoctorAppointmentsAsync(string doctorAppUserId);
    Task<IEnumerable<AppointmentSummaryDto>> GetPatientAppointmentsAsync(string patientAppUserId);
    Task ApproveAppointmentAsync(Guid appointmentId, string doctorAppUserId, UpdateAppointmentStatusDto dto);
    Task RejectAppointmentAsync(Guid appointmentId, string doctorAppUserId, UpdateAppointmentStatusDto dto);
    Task CancelAppointmentAsync(Guid appointmentId, string requestingAppUserId);
}
