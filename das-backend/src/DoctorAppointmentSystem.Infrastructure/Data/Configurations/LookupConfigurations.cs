using DoctorAppointmentSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorAppointmentSystem.Infrastructure.Data.Configurations;

public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.Description)
            .HasMaxLength(500);

        builder.HasIndex(d => d.Name).IsUnique();
    }
}

public class InsuranceConfiguration : IEntityTypeConfiguration<Insurance>
{
    public void Configure(EntityTypeBuilder<Insurance> builder)
    {
        builder.HasKey(i => i.Id);

        builder.Property(i => i.ProviderName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(i => i.PolicyNumber)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(i => i.CoverageDetails)
            .HasMaxLength(500);

        builder.HasIndex(i => i.PolicyNumber).IsUnique();
    }
}
