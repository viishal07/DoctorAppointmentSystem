using DoctorAppointmentSystem.Domain.Entities;

namespace DoctorAppointmentSystem.Application.Interfaces.Repositories;

public interface IPatientRepository
{
    Task<Patient?> GetByIdAsync(Guid id);
    Task<Patient?> GetByAppUserIdAsync(string appUserId);
    Task AddAsync(Patient patient);
    Task UpdateAsync(Patient patient);
}
