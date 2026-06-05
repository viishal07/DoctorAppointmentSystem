using DoctorAppointmentSystem.Application.Interfaces.Repositories;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Infrastructure.Data;
using DoctorAppointmentSystem.Infrastructure.Identity;
using DoctorAppointmentSystem.Infrastructure.Repositories;
using DoctorAppointmentSystem.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DoctorAppointmentSystem.Infrastructure.Extensions;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        //  Database 
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql => npgsql.MigrationsAssembly(
                    typeof(AppDbContext).Assembly.FullName)));

        //  ASP.NET Identity 
        services.AddIdentity<AppUser, IdentityRole>(options =>
        {
            // Password policy
            options.Password.RequiredLength         = 8;
            options.Password.RequireUppercase        = true;
            options.Password.RequireDigit            = true;
            options.Password.RequireNonAlphanumeric  = false;

            // Lockout
            options.Lockout.DefaultLockoutTimeSpan   = TimeSpan.FromMinutes(15);
            options.Lockout.MaxFailedAccessAttempts  = 5;
            options.Lockout.AllowedForNewUsers        = true;

            // Email must be unique
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();

        //  Repositories 
        services.AddScoped<IDoctorRepository,       DoctorRepository>();
        services.AddScoped<IPatientRepository,      PatientRepository>();
        services.AddScoped<IAppointmentRepository,  AppointmentRepository>();
        services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();
        services.AddScoped<IAvailabilityRepository, AvailabilityRepository>();
        services.AddScoped<IDepartmentRepository,   DepartmentRepository>();
        services.AddScoped<IOtpRepository,          OtpRepository>();

        //  Services 
        services.AddScoped<IAuthService,  AuthService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddSingleton<IJwtService, JwtService>();

        return services;
    }

    /// <summary>
    /// Applies pending EF migrations and seeds roles + default admin.
    /// Call from Program.cs after building the app.
    /// </summary>
    public static async Task ApplyMigrationsAndSeedAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var services = scope.ServiceProvider;

        var db          = services.GetRequiredService<AppDbContext>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var config      = services.GetRequiredService<IConfiguration>();
        var logger      = services.GetRequiredService<
                              Microsoft.Extensions.Logging.ILogger<AppDbContext>>();

        await db.Database.MigrateAsync();
        await RoleSeeder.SeedAsync(roleManager, userManager, config, logger);
    }
}
