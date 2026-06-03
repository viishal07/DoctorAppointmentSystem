using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Domain.Enums;

namespace DoctorAppointmentSystem.Application.Interfaces.Repositories;

public interface IAvailabilityRepository
{
    Task<IEnumerable<DoctorAvailability>> GetByDoctorIdAsync(Guid doctorId);
    Task<DoctorAvailability?> GetByDoctorIdAndDayAsync(Guid doctorId, AvailabilityDay day);
    Task AddAsync(DoctorAvailability availability);
    Task UpdateAsync(DoctorAvailability availability);
}
