using DoctorAppointmentSystem.Domain.Common;
using DoctorAppointmentSystem.Domain.Enums;

namespace DoctorAppointmentSystem.Domain.Entities;

public class OtpVerification : BaseEntity
{
    public string AppUserId { get; set; } = string.Empty;

    public string OtpCode { get; set; } = string.Empty;

    public OtpPurpose Purpose { get; set; }

    public DateTime ExpiresAt { get; set; }

    public bool IsUsed { get; set; } = false;

    // Navigation Properties
    public AppUser AppUser { get; set; } = null!;

    // Helper: check if this OTP is still valid
    public bool IsValid() => !IsUsed && DateTime.UtcNow < ExpiresAt;
}
