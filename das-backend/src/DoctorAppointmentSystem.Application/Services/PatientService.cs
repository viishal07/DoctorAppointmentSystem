using AutoMapper;
using DoctorAppointmentSystem.Application.DTOs.Patient;
using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Application.Interfaces.Services;

namespace DoctorAppointmentSystem.Application.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IMapper _mapper;

    public PatientService(IPatientRepository patientRepository, IMapper mapper)
    {
        _patientRepository = patientRepository;
        _mapper = mapper;
    }

    public async Task<PatientProfileDto> GetProfileAsync(string appUserId)
    {
        var patient = await _patientRepository.GetByAppUserIdAsync(appUserId)
            ?? throw new KeyNotFoundException("Patient profile not found.");

        return _mapper.Map<PatientProfileDto>(patient);
    }

    public async Task UpdateProfileAsync(string appUserId, UpdatePatientProfileDto dto)
    {
        var patient = await _patientRepository.GetByAppUserIdAsync(appUserId)
            ?? throw new KeyNotFoundException("Patient profile not found.");

        patient.DateOfBirth = dto.DateOfBirth;
        patient.BloodGroup = dto.BloodGroup;
        patient.Address = dto.Address;
        patient.InsuranceId = dto.InsuranceId;
        patient.AppUser.PhoneNumber = dto.PhoneNumber;
        patient.UpdatedAt = DateTime.UtcNow;

        await _patientRepository.UpdateAsync(patient);
    }
}
