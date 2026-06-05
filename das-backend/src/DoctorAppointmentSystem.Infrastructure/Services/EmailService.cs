using DoctorAppointmentSystem.Application.Interfaces.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace DoctorAppointmentSystem.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // ── Core private send ───────────────────────────────────────────────────

    private async Task SendAsync(string toEmail, string toName, string subject, string htmlBody)
    {
        var settings = _configuration.GetSection("EmailSettings");
        var host = settings["Host"] ?? throw new InvalidOperationException("SMTP Host not configured.");
        var portValue = settings["Port"] ?? "587";
        var username = settings["Username"] ?? throw new InvalidOperationException("SMTP Username not configured.");
        var password = settings["Password"] ?? throw new InvalidOperationException("SMTP Password not configured.");

        if (!int.TryParse(portValue, out var port))
            throw new InvalidOperationException("SMTP Port is invalid.");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(
            settings["SenderName"] ?? "Doctor Appointment System",
            settings["SenderEmail"] ?? throw new InvalidOperationException("SenderEmail not configured.")));
        message.To.Add(new MailboxAddress(toName, toEmail));
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();

        await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);

        await client.AuthenticateAsync(username, password);

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    // ── Public email methods ────────────────────────────────────────────────

    public async Task SendOtpEmailAsync(string toEmail, string fullName, string otpCode, string purpose)
    {
        var subject = purpose == "PasswordReset"
            ? "Your Password Reset OTP"
            : "Verify Your Email Address";

        var html = $"""
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e5e5;border-radius:8px;">
              <h2 style="color:#1a73e8;">Doctor Appointment System</h2>
              <p>Hi <strong>{fullName}</strong>,</p>
              <p>Your one-time verification code is:</p>
              <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1a73e8;padding:16px 0;">{otpCode}</div>
              <p style="color:#666;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
              <hr style="border:none;border-top:1px solid #e5e5e5;"/>
              <p style="color:#999;font-size:12px;">If you did not request this, please ignore this email.</p>
            </div>
            """;

        await SendAsync(toEmail, fullName, subject, html);
    }

    public async Task SendAppointmentConfirmationAsync(
        string toEmail, string patientName, string doctorName, DateTime scheduledAt)
    {
        var html = $"""
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e5e5;border-radius:8px;">
              <h2 style="color:#1a73e8;">Appointment Booked</h2>
              <p>Hi <strong>{patientName}</strong>,</p>
              <p>Your appointment has been successfully booked and is <strong>pending doctor approval</strong>.</p>
              <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                <tr><td style="padding:8px;color:#555;">Doctor</td><td style="padding:8px;font-weight:bold;">{doctorName}</td></tr>
                <tr style="background:#f9f9f9;"><td style="padding:8px;color:#555;">Date & Time</td><td style="padding:8px;font-weight:bold;">{scheduledAt:dddd, MMMM dd yyyy} at {scheduledAt:hh:mm tt} UTC</td></tr>
              </table>
              <p style="color:#666;">You will receive a follow-up email once the doctor reviews your request.</p>
            </div>
            """;

        await SendAsync(toEmail, patientName, "Appointment Booking Confirmation", html);
    }

    public async Task SendAppointmentStatusUpdateAsync(
        string toEmail, string patientName, string status, DateTime scheduledAt)
    {
        var color = status == "Approved" ? "#2e7d32" : "#c62828";
        var icon = status == "Approved" ? "✅" : "❌";

        var html = $"""
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e5e5;border-radius:8px;">
              <h2 style="color:{color};">{icon} Appointment {status}</h2>
              <p>Hi <strong>{patientName}</strong>,</p>
              <p>Your appointment scheduled for <strong>{scheduledAt:dddd, MMMM dd yyyy} at {scheduledAt:hh:mm tt} UTC</strong> has been <strong style="color:{color};">{status.ToLower()}</strong>.</p>
              <p style="color:#666;">Please log in to your account to view the full details.</p>
            </div>
            """;

        await SendAsync(toEmail, patientName, $"Appointment {status}", html);
    }

    public async Task SendDoctorApprovalEmailAsync(string toEmail, string doctorName)
    {
        var html = $"""
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e5e5;border-radius:8px;">
              <h2 style="color:#2e7d32;">✅ Account Approved</h2>
              <p>Hi <strong>Dr. {doctorName}</strong>,</p>
              <p>Congratulations! Your doctor account has been <strong>approved</strong> by the administrator.</p>
              <p>You can now log in and start accepting patient appointments.</p>
              <p style="color:#666;">Welcome to the Doctor Appointment System team.</p>
            </div>
            """;

        await SendAsync(toEmail, doctorName, "Your Doctor Account Has Been Approved", html);
    }
}
