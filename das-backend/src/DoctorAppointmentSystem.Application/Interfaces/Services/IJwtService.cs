using DoctorAppointmentSystem.Domain.Entities;

namespace DoctorAppointmentSystem.Application.Interfaces.Services;

public interface IJwtService
{
    string GenerateToken(AppUser user, string role);
    DateTime GetExpiryFromToken(string token);
}
