using AutoMapper;
using DoctorAppointmentSystem.Application.DTOs.Admin;
using DoctorAppointmentSystem.Application.DTOs.Appointment;
using DoctorAppointmentSystem.Application.DTOs.Doctor;
using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using DoctorAppointmentSystem.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using DoctorAppointmentSystem.Domain.Entities;

namespace DoctorAppointmentSystem.Application.Services;

public class AdminService : IAdminService
{
    private readonly IDoctorRepository _doctorRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IEmailService _emailService;
    private readonly UserManager<AppUser> _userManager;
    private readonly IMapper _mapper;

    public AdminService(
        IDoctorRepository doctorRepository,
        IAppointmentRepository appointmentRepository,
        IEmailService emailService,
        UserManager<AppUser> userManager,
        IMapper mapper)
    {
        _doctorRepository = doctorRepository;
        _appointmentRepository = appointmentRepository;
        _emailService = emailService;
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var pendingDoctors = await _doctorRepository.GetPendingApprovalsAsync();
        var allUsers = _userManager.Users.ToList();
        var doctors = allUsers.Where(u => u.Role == UserRole.Doctor).ToList();
        var patients = allUsers.Where(u => u.Role == UserRole.Patient).ToList();

        return new DashboardStatsDto
        {
            TotalDoctors = doctors.Count,
            PendingDoctorApprovals = pendingDoctors.Count(),
            TotalPatients = patients.Count,
            TotalAppointments = (await _appointmentRepository.GetAllAsync()).Count(),
            TodayAppointments = await _appointmentRepository.CountTodayAsync(),
            PendingAppointments = await _appointmentRepository.CountByStatusAsync(AppointmentStatus.Pending)
        };
    }

    public async Task<IEnumerable<UserListDto>> GetAllUsersAsync()
    {
        var users = _userManager.Users.ToList();
        return users.Select(u => new UserListDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email ?? string.Empty,
            Role = u.Role.ToString(),
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt
        });
    }

    public async Task<IEnumerable<AppointmentSummaryDto>> GetAllAppointmentsAsync()
    {
        var appointments = await _appointmentRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<AppointmentSummaryDto>>(appointments);
    }

    public async Task<IEnumerable<DoctorSummaryDto>> GetPendingDoctorsAsync()
    {
        var doctors = await _doctorRepository.GetPendingApprovalsAsync();
        return _mapper.Map<IEnumerable<DoctorSummaryDto>>(doctors);
    }

    public async Task ApproveDoctorAsync(Guid doctorId)
    {
        var doctor = await _doctorRepository.GetByIdAsync(doctorId)
            ?? throw new KeyNotFoundException("Doctor not found.");

        if (doctor.IsApproved)
            throw new InvalidOperationException("Doctor is already approved.");

        doctor.IsApproved = true;
        doctor.UpdatedAt = DateTime.UtcNow;

        await _doctorRepository.UpdateAsync(doctor);

        await _emailService.SendDoctorApprovalEmailAsync(
            doctor.AppUser.Email!,
            doctor.AppUser.FullName);
    }

    public async Task ToggleUserStatusAsync(string appUserId)
    {
        var user = await _userManager.FindByIdAsync(appUserId)
            ?? throw new KeyNotFoundException("User not found.");

        user.IsActive = !user.IsActive;
        await _userManager.UpdateAsync(user);
    }
}
