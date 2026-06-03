using AutoMapper;
using DoctorAppointmentSystem.Application.DTOs.Availability;
using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using DoctorAppointmentSystem.Domain.Entities;

namespace DoctorAppointmentSystem.Application.Services;

public class AvailabilityService : IAvailabilityService
{
    private readonly IAvailabilityRepository _availabilityRepository;
    private readonly IDoctorRepository _doctorRepository;
    private readonly IMapper _mapper;

    public AvailabilityService(
        IAvailabilityRepository availabilityRepository,
        IDoctorRepository doctorRepository,
        IMapper mapper)
    {
        _availabilityRepository = availabilityRepository;
        _doctorRepository = doctorRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AvailabilityResponseDto>> GetByDoctorIdAsync(Guid doctorId)
    {
        var availabilities = await _availabilityRepository.GetByDoctorIdAsync(doctorId);
        return _mapper.Map<IEnumerable<AvailabilityResponseDto>>(availabilities);
    }

    public async Task SetAvailabilityAsync(string doctorAppUserId, SetAvailabilityDto dto)
    {
        var doctor = await _doctorRepository.GetByAppUserIdAsync(doctorAppUserId)
            ?? throw new KeyNotFoundException("Doctor profile not found.");

        if (dto.StartTime >= dto.EndTime)
            throw new InvalidOperationException("Start time must be before end time.");

        // Upsert: update existing slot for that day, or create a new one
        var existing = await _availabilityRepository.GetByDoctorIdAndDayAsync(doctor.Id, dto.DayOfWeek);

        if (existing is not null)
        {
            existing.StartTime = dto.StartTime;
            existing.EndTime = dto.EndTime;
            existing.IsAvailable = dto.IsAvailable;
            existing.UpdatedAt = DateTime.UtcNow;
            await _availabilityRepository.UpdateAsync(existing);
        }
        else
        {
            var availability = new DoctorAvailability
            {
                DoctorId = doctor.Id,
                DayOfWeek = dto.DayOfWeek,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                IsAvailable = dto.IsAvailable
            };
            await _availabilityRepository.AddAsync(availability);
        }
    }
}
