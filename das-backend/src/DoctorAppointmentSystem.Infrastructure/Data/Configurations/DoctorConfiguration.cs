using DoctorAppointmentSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Data.Configurations;

public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
{
    public void Configure(EntityTypeBuilder<Doctor> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.AppUserId)
            .IsRequired();

        builder.Property(d => d.Qualifications)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(d => d.Bio)
            .HasMaxLength(1000);

        builder.Property(d => d.LicenseNumber)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.ConsultationFee)
            .IsRequired()
            .HasColumnType("numeric(10,2)");

        builder.Property(d => d.IsApproved)
            .HasDefaultValue(false);

        // Doctor → AppUser (one-to-one)
        builder.HasOne(d => d.AppUser)
            .WithOne(u => u.Doctor)
            .HasForeignKey<Doctor>(d => d.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Doctor → Department (many-to-one)
        builder.HasOne(d => d.Department)
            .WithMany(dep => dep.Doctors)
            .HasForeignKey(d => d.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(d => d.AppUserId).IsUnique();
        builder.HasIndex(d => d.LicenseNumber).IsUnique();
    }
}
