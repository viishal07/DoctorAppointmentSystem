using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly AppDbContext _context;

    public DepartmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Department>> GetAllAsync()
        => await _context.Departments
            .OrderBy(d => d.Name)
            .ToListAsync();

    public async Task<Department?> GetByIdAsync(Guid id)
        => await _context.Departments
            .FirstOrDefaultAsync(d => d.Id == id);

    public async Task AddAsync(Department department)
    {
        await _context.Departments.AddAsync(department);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Department department)
    {
        _context.Departments.Update(department);
        await _context.SaveChangesAsync();
    }
}
