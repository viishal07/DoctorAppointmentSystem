using AutoMapper;
using DoctorAppointmentSystem.Application.DTOs.Appointment;
using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Domain.Enums;

namespace DoctorAppointmentSystem.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IDoctorRepository _doctorRepository;
    private readonly IEmailService _emailService;
    private readonly IMapper _mapper;

    public AppointmentService(
        IAppointmentRepository appointmentRepository,
        IPatientRepository patientRepository,
        IDoctorRepository doctorRepository,
        IEmailService emailService,
        IMapper mapper)
    {
        _appointmentRepository = appointmentRepository;
        _patientRepository = patientRepository;
        _doctorRepository = doctorRepository;
        _emailService = emailService;
        _mapper = mapper;
    }

    public async Task<AppointmentResponseDto> BookAppointmentAsync(string patientAppUserId, BookAppointmentDto dto)
    {
        var patient = await _patientRepository.GetByAppUserIdAsync(patientAppUserId)
            ?? throw new KeyNotFoundException("Patient profile not found.");

        var doctor = await _doctorRepository.GetByIdAsync(dto.DoctorId)
            ?? throw new KeyNotFoundException("Doctor not found.");

        if (!doctor.IsApproved)
            throw new InvalidOperationException("Cannot book an appointment with an unapproved doctor.");

        var appointment = new Appointment
        {
            DoctorId = doctor.Id,
            PatientId = patient.Id,
            ScheduledAt = dto.ScheduledAt,
            Reason = dto.Reason,
            Status = AppointmentStatus.Pending
        };

        await _appointmentRepository.AddAsync(appointment);

        await _emailService.SendAppointmentConfirmationAsync(
            patient.AppUser.Email!,
            patient.AppUser.FullName,
            doctor.AppUser.FullName,
            dto.ScheduledAt);

        // Re-fetch with navigation properties for mapping
        var created = await _appointmentRepository.GetByIdAsync(appointment.Id)
            ?? throw new InvalidOperationException("Appointment could not be retrieved after creation.");

        return _mapper.Map<AppointmentResponseDto>(created);
    }

    public async Task<AppointmentResponseDto> GetByIdAsync(Guid appointmentId)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(appointmentId)
            ?? throw new KeyNotFoundException("Appointment not found.");

        return _mapper.Map<AppointmentResponseDto>(appointment);
    }

    public async Task<IEnumerable<AppointmentSummaryDto>> GetDoctorAppointmentsAsync(string doctorAppUserId)
    {
        var doctor = await _doctorRepository.GetByAppUserIdAsync(doctorAppUserId)
            ?? throw new KeyNotFoundException("Doctor profile not found.");

        var appointments = await _appointmentRepository.GetByDoctorIdAsync(doctor.Id);
        return _mapper.Map<IEnumerable<AppointmentSummaryDto>>(appointments);
    }

    public async Task<IEnumerable<AppointmentSummaryDto>> GetPatientAppointmentsAsync(string patientAppUserId)
    {
        var patient = await _patientRepository.GetByAppUserIdAsync(patientAppUserId)
            ?? throw new KeyNotFoundException("Patient profile not found.");

        var appointments = await _appointmentRepository.GetByPatientIdAsync(patient.Id);
        return _mapper.Map<IEnumerable<AppointmentSummaryDto>>(appointments);
    }

    public async Task ApproveAppointmentAsync(Guid appointmentId, UpdateAppointmentStatusDto dto)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(appointmentId)
            ?? throw new KeyNotFoundException("Appointment not found.");

        if (appointment.Status != AppointmentStatus.Pending)
            throw new InvalidOperationException("Only pending appointments can be approved.");

        appointment.Status = AppointmentStatus.Approved;
        appointment.Notes = dto.Notes;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _appointmentRepository.UpdateAsync(appointment);

        await _emailService.SendAppointmentStatusUpdateAsync(
            appointment.Patient.AppUser.Email!,
            appointment.Patient.AppUser.FullName,
            "Approved",
            appointment.ScheduledAt);
    }

    public async Task RejectAppointmentAsync(Guid appointmentId, UpdateAppointmentStatusDto dto)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(appointmentId)
            ?? throw new KeyNotFoundException("Appointment not found.");

        if (appointment.Status != AppointmentStatus.Pending)
            throw new InvalidOperationException("Only pending appointments can be rejected.");

        appointment.Status = AppointmentStatus.Rejected;
        appointment.Notes = dto.Notes;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _appointmentRepository.UpdateAsync(appointment);

        await _emailService.SendAppointmentStatusUpdateAsync(
            appointment.Patient.AppUser.Email!,
            appointment.Patient.AppUser.FullName,
            "Rejected",
            appointment.ScheduledAt);
    }

    public async Task CancelAppointmentAsync(Guid appointmentId, string requestingAppUserId)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(appointmentId)
            ?? throw new KeyNotFoundException("Appointment not found.");

        if (appointment.Status == AppointmentStatus.Completed || appointment.Status == AppointmentStatus.Cancelled)
            throw new InvalidOperationException("This appointment cannot be cancelled.");

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _appointmentRepository.UpdateAsync(appointment);
    }
}
