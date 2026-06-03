using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Domain.Enums;
using DoctorAppointmentSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public class OtpRepository : IOtpRepository
{
    private readonly AppDbContext _context;

    public OtpRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<OtpVerification?> GetValidOtpAsync(string appUserId, string otpCode, OtpPurpose purpose)
        => await _context.OtpVerifications
            .FirstOrDefaultAsync(o =>
                o.AppUserId == appUserId &&
                o.OtpCode == otpCode &&
                o.Purpose == purpose &&
                !o.IsUsed &&
                o.ExpiresAt > DateTime.UtcNow);

    public async Task AddAsync(OtpVerification otp)
    {
        await _context.OtpVerifications.AddAsync(otp);
        await _context.SaveChangesAsync();
    }

    public async Task MarkUsedAsync(OtpVerification otp)
    {
        otp.IsUsed = true;
        _context.OtpVerifications.Update(otp);
        await _context.SaveChangesAsync();
    }

    public async Task InvalidatePreviousAsync(string appUserId, OtpPurpose purpose)
    {
        var previous = await _context.OtpVerifications
            .Where(o => o.AppUserId == appUserId && o.Purpose == purpose && !o.IsUsed)
            .ToListAsync();

        foreach (var otp in previous)
            otp.IsUsed = true;

        await _context.SaveChangesAsync();
    }
}
