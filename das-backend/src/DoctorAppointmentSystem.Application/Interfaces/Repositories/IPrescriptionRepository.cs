using DoctorAppointmentSystem.Domain.Entities;

namespace DoctorAppointmentSystem.Application.Interfaces.Repositories;

public interface IPrescriptionRepository
{
    Task<Prescription?> GetByIdAsync(Guid id);
    Task<Prescription?> GetByAppointmentIdAsync(Guid appointmentId);
    Task<IEnumerable<Prescription>> GetByPatientIdAsync(Guid patientId);
    Task AddAsync(Prescription prescription);
}
