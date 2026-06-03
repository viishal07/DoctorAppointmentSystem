using DoctorAppointmentSystem.Application.DTOs.Availability;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.API.Controllers;

/// <summary>Doctor weekly availability management.</summary>
public class AvailabilityController : BaseApiController
{
    private readonly IAvailabilityService _availabilityService;

    public AvailabilityController(IAvailabilityService availabilityService)
    {
        _availabilityService = availabilityService;
    }

    /// <summary>Get availability slots for a specific doctor (public).</summary>
    [HttpGet("{doctorId:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<AvailabilityResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByDoctor([FromRoute] Guid doctorId)
    {
        var result = await _availabilityService.GetByDoctorIdAsync(doctorId);
        return Success(result);
    }

    /// <summary>Set or update availability for a specific day (Doctor only). Acts as upsert.</summary>
    [HttpPost]
    [Authorize(Roles = "Doctor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Set([FromBody] SetAvailabilityDto dto)
    {
        await _availabilityService.SetAvailabilityAsync(CurrentUserId, dto);
        return Success(message: "Availability updated successfully.");
    }
}
