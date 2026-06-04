using DoctorAppointmentSystem.Application.DTOs.Auth;
using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace DoctorAppointmentSystem.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;
    private readonly IOtpRepository _otpRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IDoctorRepository _doctorRepository;

    public AuthService(
        UserManager<AppUser> userManager,
        IJwtService jwtService,
        IEmailService emailService,
        IOtpRepository otpRepository,
        IPatientRepository patientRepository,
        IDoctorRepository doctorRepository)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _emailService = emailService;
        _otpRepository = otpRepository;
        _patientRepository = patientRepository;
        _doctorRepository = doctorRepository;
    }

    // ── Register Patient ────────────────────────────────────────────────────

    public async Task<string> RegisterPatientAsync(RegisterPatientDto dto)
    {
        await AssertEmailNotTakenAsync(dto.Email);

        var user = new AppUser
        {
            UserName  = dto.Email,
            Email     = dto.Email,
            FirstName = dto.FirstName,
            LastName  = dto.LastName,
            PhoneNumber = dto.PhoneNumber,
            Role      = UserRole.Patient,
            IsActive  = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        ThrowIfFailed(result);

        await _userManager.AddToRoleAsync(user, nameof(UserRole.Patient));

        var patient = new Patient
        {
            AppUserId = user.Id,
            DateOfBirth = dto.DateOfBirth.HasValue
    ? DateOnly.FromDateTime(dto.DateOfBirth.Value)
    : null,
            BloodGroup = dto.BloodGroup,
            Address = dto.Address
        };

        await _patientRepository.AddAsync(patient);

        // Send email verification OTP
        await SendOtpAsync(user, OtpPurpose.EmailVerification);

        return "Registration successful. Please verify your email using the OTP sent to you.";
    }

    // ── Register Doctor ─────────────────────────────────────────────────────

    public async Task<string> RegisterDoctorAsync(RegisterDoctorDto dto)
    {
        await AssertEmailNotTakenAsync(dto.Email);

        var user = new AppUser
        {
            UserName    = dto.Email,
            Email       = dto.Email,
            FirstName   = dto.FirstName,
            LastName    = dto.LastName,
            PhoneNumber = dto.PhoneNumber,
            Role        = UserRole.Doctor,
            IsActive    = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        ThrowIfFailed(result);

        await _userManager.AddToRoleAsync(user, nameof(UserRole.Doctor));

        var doctor = new Doctor
        {
            AppUserId      = user.Id,
            DepartmentId   = dto.DepartmentId,
            Qualifications = dto.Qualifications,
            Bio            = dto.Bio,
            LicenseNumber  = dto.LicenseNumber,
            ConsultationFee = dto.ConsultationFee,
            IsApproved     = false
        };

        await _doctorRepository.AddAsync(doctor);

        // Send email verification OTP
        await SendOtpAsync(user, OtpPurpose.EmailVerification);

        return "Registration successful. Your account is pending admin approval. Please verify your email.";
    }

    // ── Login ───────────────────────────────────────────────────────────────

    public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Your account has been deactivated. Please contact support.");

        var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!validPassword)
            throw new UnauthorizedAccessException("Invalid email or password.");

        var roles = await _userManager.GetRolesAsync(user);
        var role  = roles.FirstOrDefault() ?? user.Role.ToString();

        var token    = _jwtService.GenerateToken(user, role);
        var expiresAt = _jwtService.GetExpiryFromToken(token);

        return new LoginResponseDto
        {
            Token     = token,
            Email     = user.Email!,
            FullName  = user.FullName,
            Role      = role,
            ExpiresAt = expiresAt
        };
    }

    // ── Forgot Password ─────────────────────────────────────────────────────

    public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        // Always return silently — never reveal if an email exists
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user is null) return;

        await SendOtpAsync(user, OtpPurpose.PasswordReset);
    }

    // ── Reset Password ──────────────────────────────────────────────────────

    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email)
            ?? throw new KeyNotFoundException("User not found.");

        var otp = await _otpRepository.GetValidOtpAsync(user.Id, dto.OtpCode, OtpPurpose.PasswordReset)
            ?? throw new InvalidOperationException("Invalid or expired OTP.");

        // Remove old password and set new one
        var removeResult = await _userManager.RemovePasswordAsync(user);
        ThrowIfFailed(removeResult);

        var addResult = await _userManager.AddPasswordAsync(user, dto.NewPassword);
        ThrowIfFailed(addResult);

        await _otpRepository.MarkUsedAsync(otp);
    }

    // ── Verify OTP (email verification) ────────────────────────────────────

    public async Task VerifyOtpAsync(VerifyOtpDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email)
            ?? throw new KeyNotFoundException("User not found.");

        var otp = await _otpRepository.GetValidOtpAsync(user.Id, dto.OtpCode, OtpPurpose.EmailVerification)
            ?? throw new InvalidOperationException("Invalid or expired OTP.");

        user.EmailConfirmed = true;
        await _userManager.UpdateAsync(user);
        await _otpRepository.MarkUsedAsync(otp);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private async Task AssertEmailNotTakenAsync(string email)
    {
        var existing = await _userManager.FindByEmailAsync(email);
        if (existing is not null)
            throw new InvalidOperationException("An account with this email already exists.");
    }

    private async Task SendOtpAsync(AppUser user, OtpPurpose purpose)
    {
        // Invalidate any previous unused OTPs for this purpose
        await _otpRepository.InvalidatePreviousAsync(user.Id, purpose);

        var code = GenerateOtpCode();

        var otp = new OtpVerification
        {
            AppUserId = user.Id,
            OtpCode   = code,
            Purpose   = purpose,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            IsUsed    = false
        };

        await _otpRepository.AddAsync(otp);

        //await _emailService.SendOtpEmailAsync(
        //    user.Email!,
        //    user.FullName,
        //    code,
        //    purpose.ToString());

        Console.WriteLine("====================================");
        Console.WriteLine($"OTP FOR {user.Email}");
        Console.WriteLine($"PURPOSE : {purpose}");
        Console.WriteLine($"OTP CODE: {code}");
        Console.WriteLine("====================================");


    }

    private static string GenerateOtpCode()
        => Random.Shared.Next(100000, 999999).ToString();

    private static void ThrowIfFailed(IdentityResult result)
    {
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException(errors);
        }
    }
}
