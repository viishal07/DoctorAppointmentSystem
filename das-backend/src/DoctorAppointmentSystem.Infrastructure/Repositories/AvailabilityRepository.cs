using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Domain.Enums;
using DoctorAppointmentSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class AvailabilityRepository : IAvailabilityRepository
{
    private readonly AppDbContext _context;

    public AvailabilityRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DoctorAvailability>> GetByDoctorIdAsync(Guid doctorId)
        => await _context.DoctorAvailabilities
            .Where(a => a.DoctorId == doctorId)
            .OrderBy(a => a.DayOfWeek)
            .ToListAsync();

    public async Task<DoctorAvailability?> GetByDoctorIdAndDayAsync(Guid doctorId, AvailabilityDay day)
        => await _context.DoctorAvailabilities
            .FirstOrDefaultAsync(a => a.DoctorId == doctorId && a.DayOfWeek == day);

    public async Task AddAsync(DoctorAvailability availability)
    {
        await _context.DoctorAvailabilities.AddAsync(availability);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(DoctorAvailability availability)
    {
        _context.DoctorAvailabilities.Update(availability);
        await _context.SaveChangesAsync();
    }
}
