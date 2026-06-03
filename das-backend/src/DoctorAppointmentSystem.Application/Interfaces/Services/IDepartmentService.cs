using DoctorAppointmentSystem.Application.DTOs.Department;

namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IDepartmentService
{
    Task<IEnumerable<DepartmentDto>> GetAllAsync();
    Task<DepartmentDto> GetByIdAsync(Guid id);
    Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto);
    Task UpdateAsync(Guid id, UpdateDepartmentDto dto);
}
