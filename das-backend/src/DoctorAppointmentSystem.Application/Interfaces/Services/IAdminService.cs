using DoctorAppointmentSystem.Application.DTOs.Admin;
using DoctorAppointmentSystem.Application.DTOs.Appointment;
using DoctorAppointmentSystem.Application.DTOs.Doctor;

namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IAdminService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync();
    Task<IEnumerable<UserListDto>> GetAllUsersAsync();
    Task<IEnumerable<AppointmentSummaryDto>> GetAllAppointmentsAsync();
    Task<IEnumerable<DoctorSummaryDto>> GetPendingDoctorsAsync();
    Task ApproveDoctorAsync(Guid doctorId);
    Task ToggleUserStatusAsync(string appUserId);
}
