using DoctorAppointmentSystem.Domain.Entities;

namespace DoctorAppointmentSystem.Application.Interfaces.Repositories;

public interface IDoctorRepository
{
    Task<Doctor?> GetByIdAsync(Guid id);
    Task<Doctor?> GetByAppUserIdAsync(string appUserId);
    Task<IEnumerable<Doctor>> GetAllApprovedAsync();
    Task<IEnumerable<Doctor>> SearchAsync(string? name, Guid? departmentId);
    Task<IEnumerable<Doctor>> GetPendingApprovalsAsync();
    Task AddAsync(Doctor doctor);
    Task UpdateAsync(Doctor doctor);
}
