using DoctorAppointmentSystem.Domain.Entities;
using DoctorAppointmentSystem.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DoctorAppointmentSystem.Infrastructure.Identity;

public static class RoleSeeder
{
    public static async Task SeedAsync(
        RoleManager<IdentityRole> roleManager,
        UserManager<AppUser> userManager,
        IConfiguration configuration,
        ILogger logger)
    {
        //  Seed roles 
        string[] roles = [nameof(UserRole.Admin), nameof(UserRole.Doctor), nameof(UserRole.Patient)];

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
                logger.LogInformation("Seeded role: {Role}", role);
            }
        }

        //  Seed default admin user 
        var adminSection = configuration.GetSection("DefaultAdmin");
        var adminEmail   = adminSection["Email"] ?? "admin@das.com";
        var adminPassword = adminSection["Password"] ?? "Admin@123";

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin is null)
        {
            var admin = new AppUser
            {
                UserName    = adminEmail,
                Email       = adminEmail,
                FirstName   = "System",
                LastName    = "Admin",
                Role        = UserRole.Admin,
                IsActive    = true,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(admin, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, nameof(UserRole.Admin));
                logger.LogInformation("Default admin user seeded: {Email}", adminEmail);
            }
            else
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                logger.LogError("Failed to seed admin user: {Errors}", errors);
            }
        }
    }
}
