using DoctorAppointmentSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Data.Configurations;

public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
{
    public void Configure(EntityTypeBuilder<Prescription> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Diagnosis)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(p => p.Medications)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(p => p.Instructions)
            .HasMaxLength(2000);

        builder.Property(p => p.IssuedAt)
            .IsRequired();

        // Prescription → Appointment (one-to-one)
        builder.HasOne(p => p.Appointment)
            .WithOne(a => a.Prescription)
            .HasForeignKey<Prescription>(p => p.AppointmentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Prescription → Doctor (many-to-one)
        builder.HasOne(p => p.Doctor)
            .WithMany(d => d.Prescriptions)
            .HasForeignKey(p => p.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        // Prescription → Patient (many-to-one)
        builder.HasOne(p => p.Patient)
            .WithMany(pat => pat.Prescriptions)
            .HasForeignKey(p => p.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.AppointmentId).IsUnique();
        builder.HasIndex(p => p.PatientId);
    }
}
