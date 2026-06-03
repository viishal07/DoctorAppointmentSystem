namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendOtpEmailAsync(string toEmail, string fullName, string otpCode, string purpose);
    Task SendAppointmentConfirmationAsync(string toEmail, string patientName, string doctorName, DateTime scheduledAt);
    Task SendAppointmentStatusUpdateAsync(string toEmail, string patientName, string status, DateTime scheduledAt);
    Task SendDoctorApprovalEmailAsync(string toEmail, string doctorName);
}
