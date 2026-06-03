using DoctorAppointmentSystem.Application.DTOs.Auth;

namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IAuthService
{
    Task<string> RegisterPatientAsync(RegisterPatientDto dto);
    Task<string> RegisterDoctorAsync(RegisterDoctorDto dto);
    Task<LoginResponseDto> LoginAsync(LoginDto dto);
    Task ForgotPasswordAsync(ForgotPasswordDto dto);
    Task ResetPasswordAsync(ResetPasswordDto dto);
    Task VerifyOtpAsync(VerifyOtpDto dto);
}
