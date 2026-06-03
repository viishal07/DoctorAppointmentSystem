using DoctorAppointmentSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Data.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.AppUserId)
            .IsRequired();

        builder.Property(p => p.BloodGroup)
            .HasMaxLength(5);

        builder.Property(p => p.Address)
            .HasMaxLength(300);

        // Patient → AppUser (one-to-one)
        builder.HasOne(p => p.AppUser)
            .WithOne(u => u.Patient)
            .HasForeignKey<Patient>(p => p.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Patient → Insurance (many-to-one, optional)
        builder.HasOne(p => p.Insurance)
            .WithMany(i => i.Patients)
            .HasForeignKey(p => p.InsuranceId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(p => p.AppUserId).IsUnique();
    }
}
