namespace DoctorAppointmentSystem.Application.DTOs.Auth;

public class RegisterPatientDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string BloodGroup { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}
