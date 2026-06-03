using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class PatientRepository : IPatientRepository
{
    private readonly AppDbContext _context;

    public PatientRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Patient?> GetByIdAsync(Guid id)
        => await _context.Patients
            .Include(p => p.AppUser)
            .Include(p => p.Insurance)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<Patient?> GetByAppUserIdAsync(string appUserId)
        => await _context.Patients
            .Include(p => p.AppUser)
            .Include(p => p.Insurance)
            .FirstOrDefaultAsync(p => p.AppUserId == appUserId);

    public async Task AddAsync(Patient patient)
    {
        await _context.Patients.AddAsync(patient);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Patient patient)
    {
        _context.Patients.Update(patient);
        await _context.SaveChangesAsync();
    }
}
