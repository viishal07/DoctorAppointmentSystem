using DoctorAppointmentSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Data.Configurations;

public class OtpVerificationConfiguration : IEntityTypeConfiguration<OtpVerification>
{
    public void Configure(EntityTypeBuilder<OtpVerification> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.OtpCode)
            .IsRequired()
            .HasMaxLength(6);

        builder.Property(o => o.Purpose)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(o => o.ExpiresAt)
            .IsRequired();

        builder.Property(o => o.IsUsed)
            .HasDefaultValue(false);

        // OtpVerification → AppUser (many-to-one)
        builder.HasOne(o => o.AppUser)
            .WithMany(u => u.OtpVerifications)
            .HasForeignKey(o => o.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(o => new { o.AppUserId, o.Purpose });
    }
}
