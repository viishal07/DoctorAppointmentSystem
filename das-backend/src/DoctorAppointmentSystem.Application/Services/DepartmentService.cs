using AutoMapper;
using DoctorAppointmentSystem.Application.DTOs.Department;
using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using DoctorAppointmentSystem.Domain.Entities;

namespace DoctorAppointmentSystem.Application.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IMapper _mapper;

    public DepartmentService(IDepartmentRepository departmentRepository, IMapper mapper)
    {
        _departmentRepository = departmentRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
    {
        var departments = await _departmentRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<DepartmentDto>>(departments);
    }

    public async Task<DepartmentDto> GetByIdAsync(Guid id)
    {
        var department = await _departmentRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Department not found.");

        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto)
    {
        var department = new Department
        {
            Name = dto.Name,
            Description = dto.Description
        };

        await _departmentRepository.AddAsync(department);
        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task UpdateAsync(Guid id, UpdateDepartmentDto dto)
    {
        var department = await _departmentRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Department not found.");

        department.Name = dto.Name;
        department.Description = dto.Description;
        department.UpdatedAt = DateTime.UtcNow;

        await _departmentRepository.UpdateAsync(department);
    }
}
