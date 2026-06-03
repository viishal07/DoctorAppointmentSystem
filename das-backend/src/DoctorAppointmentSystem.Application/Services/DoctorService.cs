using AutoMapper;
using DoctorAppointmentSystem.Application.DTOs.Doctor;
using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Application.Interfaces.Services;

namespace DoctorAppointmentSystem.Application.Services;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _doctorRepository;
    private readonly IMapper _mapper;

    public DoctorService(IDoctorRepository doctorRepository, IMapper mapper)
    {
        _doctorRepository = doctorRepository;
        _mapper = mapper;
    }

    public async Task<DoctorProfileDto> GetProfileAsync(string appUserId)
    {
        var doctor = await _doctorRepository.GetByAppUserIdAsync(appUserId)
            ?? throw new KeyNotFoundException("Doctor profile not found.");

        return _mapper.Map<DoctorProfileDto>(doctor);
    }

    public async Task<DoctorProfileDto> GetByIdAsync(Guid doctorId)
    {
        var doctor = await _doctorRepository.GetByIdAsync(doctorId)
            ?? throw new KeyNotFoundException("Doctor not found.");

        return _mapper.Map<DoctorProfileDto>(doctor);
    }

    public async Task UpdateProfileAsync(string appUserId, UpdateDoctorProfileDto dto)
    {
        var doctor = await _doctorRepository.GetByAppUserIdAsync(appUserId)
            ?? throw new KeyNotFoundException("Doctor profile not found.");

        doctor.DepartmentId = dto.DepartmentId;
        doctor.Qualifications = dto.Qualifications;
        doctor.Bio = dto.Bio;
        doctor.ConsultationFee = dto.ConsultationFee;
        doctor.AppUser.PhoneNumber = dto.PhoneNumber;
        doctor.UpdatedAt = DateTime.UtcNow;

        await _doctorRepository.UpdateAsync(doctor);
    }

    public async Task<IEnumerable<DoctorSummaryDto>> SearchDoctorsAsync(DoctorSearchDto dto)
    {
        var doctors = await _doctorRepository.SearchAsync(dto.Name, dto.DepartmentId);
        return _mapper.Map<IEnumerable<DoctorSummaryDto>>(doctors);
    }
}
