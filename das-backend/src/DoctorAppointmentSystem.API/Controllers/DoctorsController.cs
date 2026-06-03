using DoctorAppointmentSystem.Application.DTOs.Doctor;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.API.Controllers;

/// <summary>Doctor profile management and public search.</summary>
public class DoctorsController : BaseApiController
{
    private readonly IDoctorService _doctorService;

    public DoctorsController(IDoctorService doctorService)
    {
        _doctorService = doctorService;
    }

    /// <summary>Search approved doctors by name or department.</summary>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<DoctorSummaryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search([FromQuery] DoctorSearchDto dto)
    {
        var doctors = await _doctorService.SearchDoctorsAsync(dto);
        return Success(doctors);
    }

    /// <summary>Get a specific doctor's full profile by their entity ID.</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(DoctorProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var doctor = await _doctorService.GetByIdAsync(id);
        return Success(doctor);
    }

    /// <summary>Get the authenticated doctor's own profile.</summary>
    [HttpGet("profile")]
    [Authorize(Roles = "Doctor")]
    [ProducesResponseType(typeof(DoctorProfileDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProfile()
    {
        var profile = await _doctorService.GetProfileAsync(CurrentUserId);
        return Success(profile);
    }

    /// <summary>Update the authenticated doctor's own profile.</summary>
    [HttpPut("profile")]
    [Authorize(Roles = "Doctor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateDoctorProfileDto dto)
    {
        await _doctorService.UpdateProfileAsync(CurrentUserId, dto);
        return Success(message: "Profile updated successfully.");
    }
}
