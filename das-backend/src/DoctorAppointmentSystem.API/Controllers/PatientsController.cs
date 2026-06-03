using DoctorAppointmentSystem.Application.DTOs.Patient;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.API.Controllers;

/// <summary>Patient profile management.</summary>
[Authorize(Roles = "Patient")]
public class PatientsController : BaseApiController
{
    private readonly IPatientService _patientService;

    public PatientsController(IPatientService patientService)
    {
        _patientService = patientService;
    }

    /// <summary>Get the authenticated patient's own profile.</summary>
    [HttpGet("profile")]
    [ProducesResponseType(typeof(PatientProfileDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProfile()
    {
        var profile = await _patientService.GetProfileAsync(CurrentUserId);
        return Success(profile);
    }

    /// <summary>Update the authenticated patient's own profile.</summary>
    [HttpPut("profile")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdatePatientProfileDto dto)
    {
        await _patientService.UpdateProfileAsync(CurrentUserId, dto);
        return Success(message: "Profile updated successfully.");
    }
}
