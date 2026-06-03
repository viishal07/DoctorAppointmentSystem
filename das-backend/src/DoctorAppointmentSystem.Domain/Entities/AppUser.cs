using DoctorAppointmentSystem.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace DoctorAppointmentSystem.Domain.Entities;

public class AppUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public Doctor? Doctor { get; set; }
    public Patient? Patient { get; set; }
    public ICollection<OtpVerification> OtpVerifications { get; set; } = new List<OtpVerification>();

    // Computed helper
    public string FullName => $"{FirstName} {LastName}";
}
