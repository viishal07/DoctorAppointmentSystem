using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class PrescriptionRepository : IPrescriptionRepository
{
    private readonly AppDbContext _context;

    public PrescriptionRepository(AppDbContext context)
    {
        _context = context;
    }

    private IQueryable<Prescription> WithFullIncludes()
        => _context.Prescriptions
            .Include(p => p.Doctor)
                .ThenInclude(d => d.AppUser)
            .Include(p => p.Patient)
                .ThenInclude(pat => pat.AppUser)
            .Include(p => p.Appointment);

    public async Task<Prescription?> GetByIdAsync(Guid id)
        => await WithFullIncludes()
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<Prescription?> GetByAppointmentIdAsync(Guid appointmentId)
        => await WithFullIncludes()
            .FirstOrDefaultAsync(p => p.AppointmentId == appointmentId);

    public async Task<IEnumerable<Prescription>> GetByPatientIdAsync(Guid patientId)
        => await WithFullIncludes()
            .Where(p => p.PatientId == patientId)
            .OrderByDescending(p => p.IssuedAt)
            .ToListAsync();

    public async Task AddAsync(Prescription prescription)
    {
        await _context.Prescriptions.AddAsync(prescription);
        await _context.SaveChangesAsync();
    }
}
