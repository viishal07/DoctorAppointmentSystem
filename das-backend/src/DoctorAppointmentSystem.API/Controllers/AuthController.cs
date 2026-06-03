using DoctorAppointmentSystem.Application.DTOs.Auth;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.API.Controllers;

/// <summary>Authentication — register, login, OTP, password reset.</summary>
public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>Register a new patient account.</summary>
    [HttpPost("register/patient")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterPatient([FromBody] RegisterPatientDto dto)
    {
        var message = await _authService.RegisterPatientAsync(dto);
        return Created(null!, message);
    }

    /// <summary>Register a new doctor account (pending admin approval).</summary>
    [HttpPost("register/doctor")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterDoctor([FromBody] RegisterDoctorDto dto)
    {
        var message = await _authService.RegisterDoctorAsync(dto);
        return Created(null!, message);
    }

    /// <summary>Login and receive a JWT token.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        return Success(result, "Login successful.");
    }

    /// <summary>Send a password-reset OTP to the provided email.</summary>
    [HttpPost("forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        await _authService.ForgotPasswordAsync(dto);
        return Success(message: "If an account with that email exists, an OTP has been sent.");
    }

    /// <summary>Reset password using a valid OTP.</summary>
    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        await _authService.ResetPasswordAsync(dto);
        return Success(message: "Password reset successfully. Please log in.");
    }

    /// <summary>Verify email address using OTP.</summary>
    [HttpPost("verify-otp")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
    {
        await _authService.VerifyOtpAsync(dto);
        return Success(message: "Email verified successfully.");
    }
}
