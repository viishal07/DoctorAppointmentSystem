using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class DoctorRepository : IDoctorRepository
{
    private readonly AppDbContext _context;

    public DoctorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Doctor?> GetByIdAsync(Guid id)
        => await _context.Doctors
            .Include(d => d.AppUser)
            .Include(d => d.Department)
            .FirstOrDefaultAsync(d => d.Id == id);

    public async Task<Doctor?> GetByAppUserIdAsync(string appUserId)
        => await _context.Doctors
            .Include(d => d.AppUser)
            .Include(d => d.Department)
            .FirstOrDefaultAsync(d => d.AppUserId == appUserId);

    public async Task<IEnumerable<Doctor>> GetAllApprovedAsync()
        => await _context.Doctors
            .Include(d => d.AppUser)
            .Include(d => d.Department)
            .Where(d => d.IsApproved)
            .OrderBy(d => d.AppUser.FirstName)
            .ToListAsync();

    public async Task<IEnumerable<Doctor>> GetPendingApprovalsAsync()
        => await _context.Doctors
            .Include(d => d.AppUser)
            .Include(d => d.Department)
            .Where(d => !d.IsApproved)
            .OrderBy(d => d.CreatedAt)
            .ToListAsync();

    public async Task<IEnumerable<Doctor>> SearchAsync(string? name, Guid? departmentId)
    {
        var query = _context.Doctors
            .Include(d => d.AppUser)
            .Include(d => d.Department)
            .Where(d => d.IsApproved)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
        {
            var lower = name.ToLower();
            query = query.Where(d =>
                d.AppUser.FirstName.ToLower().Contains(lower) ||
                d.AppUser.LastName.ToLower().Contains(lower));
        }

        if (departmentId.HasValue)
            query = query.Where(d => d.DepartmentId == departmentId.Value);

        return await query.OrderBy(d => d.AppUser.FirstName).ToListAsync();
    }

    public async Task AddAsync(Doctor doctor)
    {
        await _context.Doctors.AddAsync(doctor);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Doctor doctor)
    {
        _context.Doctors.Update(doctor);
        await _context.SaveChangesAsync();
    }
}
