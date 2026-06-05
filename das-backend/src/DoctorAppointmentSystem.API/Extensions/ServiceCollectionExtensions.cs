using System.Text;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using DoctorAppointmentSystem.Application.Mappings;
using DoctorAppointmentSystem.Application.Services;
using DoctorAppointmentSystem.Application.Validators.Auth;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace DoctorAppointmentSystem.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        //  AutoMapper
        services.AddAutoMapper(typeof(MappingProfile).Assembly);

        //  FluentValidation 
        // Register all validators from the Application assembly
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<RegisterPatientValidator>();

        //  Application Services 
        services.AddScoped<IDoctorService,       DoctorService>();
        services.AddScoped<IPatientService,      PatientService>();
        services.AddScoped<IAppointmentService,  AppointmentService>();
        services.AddScoped<IPrescriptionService, PrescriptionService>();
        services.AddScoped<IAvailabilityService, AvailabilityService>();
        services.AddScoped<IAdminService,        AdminService>();
        services.AddScoped<IDepartmentService,   DepartmentService>();

        return services;
    }

    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey   = jwtSettings["SecretKey"]
            ?? throw new InvalidOperationException("JWT SecretKey is not configured.");

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false; // Set true in production
            options.SaveToken            = true;

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey         = new SymmetricSecurityKey(
                                               Encoding.UTF8.GetBytes(secretKey)),
                ValidateIssuer           = true,
                ValidIssuer              = jwtSettings["Issuer"],
                ValidateAudience         = true,
                ValidAudience            = jwtSettings["Audience"],
                ValidateLifetime         = true,
                ClockSkew                = TimeSpan.Zero
            };

            // Return 401 JSON (not redirect) for unauthorized API calls
            options.Events = new JwtBearerEvents
            {
                OnChallenge = async context =>
                {
                    context.HandleResponse();
                    context.Response.StatusCode  = 401;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(
                        """{"success":false,"statusCode":401,"message":"Unauthorized. Please provide a valid token."}""");
                },
                OnForbidden = async context =>
                {
                    context.Response.StatusCode  = 403;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(
                        """{"success":false,"statusCode":403,"message":"Forbidden. You do not have permission to access this resource."}""");
                }
            };
        });

        services.AddAuthorization();

        return services;
    }

    public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
                policy
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
        });

        return services;
    }
}
