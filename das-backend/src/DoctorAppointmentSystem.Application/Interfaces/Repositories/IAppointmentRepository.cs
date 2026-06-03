using DoctorAppointmentSystem.Domain.Entities;

namespace DoctorAppointmentSystem.Application.Interfaces.Repositories;

public interface IAppointmentRepository
{
    Task<Appointment?> GetByIdAsync(Guid id);
    Task<IEnumerable<Appointment>> GetByDoctorIdAsync(Guid doctorId);
    Task<IEnumerable<Appointment>> GetByPatientIdAsync(Guid patientId);
    Task<IEnumerable<Appointment>> GetAllAsync();
    Task<int> CountTodayAsync();
    Task<int> CountByStatusAsync(Domain.Enums.AppointmentStatus status);
    Task AddAsync(Appointment appointment);
    Task UpdateAsync(Appointment appointment);
}
