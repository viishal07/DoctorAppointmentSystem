using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Domain.Enums;

namespace DoctorAppointmentSystem.Application.Interfaces.Repositories;

public interface IOtpRepository
{
    Task<OtpVerification?> GetValidOtpAsync(string appUserId, string otpCode, OtpPurpose purpose);
    Task AddAsync(OtpVerification otp);
    Task MarkUsedAsync(OtpVerification otp);
    Task InvalidatePreviousAsync(string appUserId, OtpPurpose purpose);
}
