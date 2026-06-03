using AutoMapper;
using DoctorAppointmentSystem.Application.DTOs.Appointment;
using DoctorAppointmentSystem.Application.DTOs.Availability;
using DoctorAppointmentSystem.Application.DTOs.Department;
using DoctorAppointmentSystem.Application.DTOs.Doctor;
using DoctorAppointmentSystem.Application.DTOs.Patient;
using DoctorAppointmentSystem.Application.DTOs.Prescription;
using DoctorAppointmentSystem.Domain.Entities;

namespace DoctorAppointmentSystem.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ── Doctor ──────────────────────────────────────────────────────────
        CreateMap<Doctor, DoctorProfileDto>()
            .ForMember(d => d.FullName,         o => o.MapFrom(s => s.AppUser.FullName))
            .ForMember(d => d.Email,            o => o.MapFrom(s => s.AppUser.Email))
            .ForMember(d => d.PhoneNumber,      o => o.MapFrom(s => s.AppUser.PhoneNumber))
            .ForMember(d => d.DepartmentName,   o => o.MapFrom(s => s.Department.Name));

        CreateMap<Doctor, DoctorSummaryDto>()
            .ForMember(d => d.FullName,         o => o.MapFrom(s => s.AppUser.FullName))
            .ForMember(d => d.DepartmentName,   o => o.MapFrom(s => s.Department.Name))
            .ForMember(d => d.Qualifications,   o => o.MapFrom(s => s.Qualifications));

        // ── Patient ─────────────────────────────────────────────────────────
        CreateMap<Patient, PatientProfileDto>()
            .ForMember(d => d.FullName,           o => o.MapFrom(s => s.AppUser.FullName))
            .ForMember(d => d.Email,              o => o.MapFrom(s => s.AppUser.Email))
            .ForMember(d => d.PhoneNumber,        o => o.MapFrom(s => s.AppUser.PhoneNumber))
            .ForMember(d => d.InsuranceProvider,  o => o.MapFrom(s => s.Insurance != null
                                                                        ? s.Insurance.ProviderName
                                                                        : null));

        // ── Appointment ─────────────────────────────────────────────────────
        CreateMap<Appointment, AppointmentResponseDto>()
            .ForMember(d => d.DoctorName,      o => o.MapFrom(s => s.Doctor.AppUser.FullName))
            .ForMember(d => d.PatientName,     o => o.MapFrom(s => s.Patient.AppUser.FullName))
            .ForMember(d => d.DepartmentName,  o => o.MapFrom(s => s.Doctor.Department.Name))
            .ForMember(d => d.Status,          o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<Appointment, AppointmentSummaryDto>()
            .ForMember(d => d.DoctorName,   o => o.MapFrom(s => s.Doctor.AppUser.FullName))
            .ForMember(d => d.PatientName,  o => o.MapFrom(s => s.Patient.AppUser.FullName))
            .ForMember(d => d.Status,       o => o.MapFrom(s => s.Status.ToString()));

        // ── Prescription ────────────────────────────────────────────────────
        CreateMap<Prescription, PrescriptionResponseDto>()
            .ForMember(d => d.DoctorName,   o => o.MapFrom(s => s.Doctor.AppUser.FullName))
            .ForMember(d => d.PatientName,  o => o.MapFrom(s => s.Patient.AppUser.FullName));

        // ── Availability ────────────────────────────────────────────────────
        CreateMap<DoctorAvailability, AvailabilityResponseDto>()
            .ForMember(d => d.DayOfWeek,  o => o.MapFrom(s => s.DayOfWeek.ToString()));

        // ── Department ──────────────────────────────────────────────────────
        CreateMap<Department, DepartmentDto>();
    }
}
