using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Domain.Enums;
using DoctorAppointmentSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _context;

    public AppointmentRepository(AppDbContext context)
    {
        _context = context;
    }

    private IQueryable<Appointment> WithFullIncludes()
        => _context.Appointments
            .Include(a => a.Doctor)
                .ThenInclude(d => d.AppUser)
            .Include(a => a.Doctor)
                .ThenInclude(d => d.Department)
            .Include(a => a.Patient)
                .ThenInclude(p => p.AppUser);

    public async Task<Appointment?> GetByIdAsync(Guid id)
        => await WithFullIncludes()
            .FirstOrDefaultAsync(a => a.Id == id);

    public async Task<IEnumerable<Appointment>> GetByDoctorIdAsync(Guid doctorId)
        => await WithFullIncludes()
            .Where(a => a.DoctorId == doctorId)
            .OrderByDescending(a => a.ScheduledAt)
            .ToListAsync();

    public async Task<IEnumerable<Appointment>> GetByPatientIdAsync(Guid patientId)
        => await WithFullIncludes()
            .Where(a => a.PatientId == patientId)
            .OrderByDescending(a => a.ScheduledAt)
            .ToListAsync();

    public async Task<IEnumerable<Appointment>> GetAllAsync()
        => await WithFullIncludes()
            .OrderByDescending(a => a.ScheduledAt)
            .ToListAsync();

    public async Task<int> CountTodayAsync()
    {
        var today = DateTime.UtcNow.Date;
        return await _context.Appointments
            .CountAsync(a => a.ScheduledAt.Date == today);
    }

    public async Task<int> CountByStatusAsync(AppointmentStatus status)
        => await _context.Appointments.CountAsync(a => a.Status == status);

    public async Task AddAsync(Appointment appointment)
    {
        await _context.Appointments.AddAsync(appointment);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Appointment appointment)
    {
        _context.Appointments.Update(appointment);
        await _context.SaveChangesAsync();
    }
}
