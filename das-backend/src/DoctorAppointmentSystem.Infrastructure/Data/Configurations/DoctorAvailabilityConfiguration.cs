using DoctorAppointmentSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Data.Configurations;

public class DoctorAvailabilityConfiguration : IEntityTypeConfiguration<DoctorAvailability>
{
    public void Configure(EntityTypeBuilder<DoctorAvailability> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.DayOfWeek)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(a => a.StartTime)
            .IsRequired()
            .HasColumnType("time");

        builder.Property(a => a.EndTime)
            .IsRequired()
            .HasColumnType("time");

        builder.Property(a => a.IsAvailable)
            .HasDefaultValue(true);

        // Availability → Doctor (many-to-one)
        builder.HasOne(a => a.Doctor)
            .WithMany(d => d.Availabilities)
            .HasForeignKey(a => a.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        // One slot per day per doctor
        builder.HasIndex(a => new { a.DoctorId, a.DayOfWeek }).IsUnique();
    }
}
