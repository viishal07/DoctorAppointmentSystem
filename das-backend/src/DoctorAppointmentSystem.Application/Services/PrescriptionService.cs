using AutoMapper;
using DoctorAppointmentSystem.Application.DTOs.Prescription;
using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Domain.Enums;

namespace DoctorAppointmentSystem.Application.Services;

public class PrescriptionService : IPrescriptionService
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IDoctorRepository _doctorRepository;
    private readonly IMapper _mapper;

    public PrescriptionService(
        IPrescriptionRepository prescriptionRepository,
        IAppointmentRepository appointmentRepository,
        IDoctorRepository doctorRepository,
        IMapper mapper)
    {
        _prescriptionRepository = prescriptionRepository;
        _appointmentRepository = appointmentRepository;
        _doctorRepository = doctorRepository;
        _mapper = mapper;
    }

    public async Task<PrescriptionResponseDto> CreatePrescriptionAsync(string doctorAppUserId, CreatePrescriptionDto dto)
    {
        var doctor = await _doctorRepository.GetByAppUserIdAsync(doctorAppUserId)
            ?? throw new KeyNotFoundException("Doctor profile not found.");

        var appointment = await _appointmentRepository.GetByIdAsync(dto.AppointmentId)
            ?? throw new KeyNotFoundException("Appointment not found.");

        if (appointment.DoctorId != doctor.Id)
            throw new UnauthorizedAccessException("You can only issue prescriptions for your own appointments.");

        if (appointment.Status != AppointmentStatus.Approved)
            throw new InvalidOperationException("Prescriptions can only be issued for approved appointments.");

        var existing = await _prescriptionRepository.GetByAppointmentIdAsync(dto.AppointmentId);
        if (existing is not null)
            throw new InvalidOperationException("A prescription already exists for this appointment.");

        var prescription = new Prescription
        {
            AppointmentId = dto.AppointmentId,
            DoctorId = doctor.Id,
            PatientId = appointment.PatientId,
            Diagnosis = dto.Diagnosis,
            Medications = dto.Medications,
            Instructions = dto.Instructions,
            IssuedAt = DateTime.UtcNow
        };

        await _prescriptionRepository.AddAsync(prescription);

        // Mark appointment as completed after prescription is issued
        appointment.Status = AppointmentStatus.Completed;
        appointment.UpdatedAt = DateTime.UtcNow;
        await _appointmentRepository.UpdateAsync(appointment);

        var created = await _prescriptionRepository.GetByIdAsync(prescription.Id)
            ?? throw new InvalidOperationException("Prescription could not be retrieved after creation.");

        return _mapper.Map<PrescriptionResponseDto>(created);
    }

    public async Task<PrescriptionResponseDto> GetByIdAsync(Guid prescriptionId, string currentUserId, bool isAdmin)
    {
        var prescription = await _prescriptionRepository.GetByIdAsync(prescriptionId)
            ?? throw new KeyNotFoundException("Prescription not found.");

        if (!isAdmin && prescription.Doctor.AppUserId != currentUserId && prescription.Patient.AppUserId != currentUserId)
            throw new UnauthorizedAccessException("You can only view your own prescriptions.");

        return _mapper.Map<PrescriptionResponseDto>(prescription);
    }

    public async Task<IEnumerable<PrescriptionResponseDto>> GetByPatientIdAsync(Guid patientId, string currentUserId, bool isAdmin)
    {
        var prescriptions = await _prescriptionRepository.GetByPatientIdAsync(patientId);

        if (!isAdmin)
            prescriptions = prescriptions.Where(p => p.Patient.AppUserId == currentUserId || p.Doctor.AppUserId == currentUserId);

        return _mapper.Map<IEnumerable<PrescriptionResponseDto>>(prescriptions);
    }

    public async Task<IEnumerable<PrescriptionResponseDto>> GetDoctorPrescriptionsAsync(string doctorAppUserId)
    {
        var doctor = await _doctorRepository.GetByAppUserIdAsync(doctorAppUserId)
            ?? throw new KeyNotFoundException("Doctor profile not found.");

        var prescriptions = await _prescriptionRepository.GetByDoctorIdAsync(doctor.Id);
        return _mapper.Map<IEnumerable<PrescriptionResponseDto>>(prescriptions);
    }
}
