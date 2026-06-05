using DoctorAppointmentSystem.API.Extensions;
using DoctorAppointmentSystem.API.Middleware;
using DoctorAppointmentSystem.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

//  Services 

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Infrastructure: DbContext, Identity, Repositories, Auth/Email/Jwt services
builder.Services.AddInfrastructure(builder.Configuration);

// Application: Services, AutoMapper, FluentValidation
builder.Services.AddApplicationServices();

// JWT Bearer authentication
builder.Services.AddJwtAuthentication(builder.Configuration);

// CORS
builder.Services.AddCorsPolicy();

// Swagger with JWT support
builder.Services.AddSwaggerWithJwt();

//  Build 

var app = builder.Build();

//  Database migrations + seeding 
await app.Services.ApplyMigrationsAndSeedAsync();

//  Middleware pipeline 

// 1. Global exception handler — must be first to catch all downstream errors
app.UseMiddleware<ExceptionHandlingMiddleware>();

// 2. Swagger — development only
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Doctor Appointment System v1");
        options.RoutePrefix = string.Empty; // Serve at root: https://localhost:PORT/
    });
}

// 3. HTTPS redirection
app.UseHttpsRedirection();

// 4. CORS — must be before Auth
app.UseCors("AllowFrontend");

// 5. Authentication → Authorization (order matters)
app.UseAuthentication();
app.UseAuthorization();

// 6. Controllers
app.MapControllers();

app.Run();
