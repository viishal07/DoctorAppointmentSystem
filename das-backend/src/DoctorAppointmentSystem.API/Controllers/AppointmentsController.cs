using DoctorAppointmentSystem.Application.DTOs.Appointment;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.API.Controllers;

/// <summary>Appointment booking and management.</summary>
[Authorize]
public class AppointmentsController : BaseApiController
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentsController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    /// <summary>Book a new appointment (Patient only).</summary>
    [HttpPost]
    [Authorize(Roles = "Patient")]
    [ProducesResponseType(typeof(AppointmentResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Book([FromBody] BookAppointmentDto dto)
    {
        var result = await _appointmentService.BookAppointmentAsync(CurrentUserId, dto);
        return Created(result, "Appointment booked successfully.");
    }

    /// <summary>Get a specific appointment by ID.</summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Doctor,Patient,Admin")]
    [ProducesResponseType(typeof(AppointmentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var result = await _appointmentService.GetByIdAsync(id, CurrentUserId, User.IsInRole("Admin"));
        return Success(result);
    }

    /// <summary>Get all appointments for the authenticated doctor.</summary>
    [HttpGet("doctor")]
    [Authorize(Roles = "Doctor")]
    [ProducesResponseType(typeof(IEnumerable<AppointmentSummaryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDoctorAppointments()
    {
        var result = await _appointmentService.GetDoctorAppointmentsAsync(CurrentUserId);
        return Success(result);
    }

    /// <summary>Get all appointments for the authenticated patient.</summary>
    [HttpGet("patient")]
    [Authorize(Roles = "Patient")]
    [ProducesResponseType(typeof(IEnumerable<AppointmentSummaryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPatientAppointments()
    {
        var result = await _appointmentService.GetPatientAppointmentsAsync(CurrentUserId);
        return Success(result);
    }

    /// <summary>Approve a pending appointment (Doctor only).</summary>
    [HttpPut("{id:guid}/approve")]
    [Authorize(Roles = "Doctor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Approve([FromRoute] Guid id, [FromBody] UpdateAppointmentStatusDto dto)
    {
        await _appointmentService.ApproveAppointmentAsync(id, CurrentUserId, dto);
        return Success(message: "Appointment approved successfully.");
    }

    /// <summary>Reject a pending appointment (Doctor only).</summary>
    [HttpPut("{id:guid}/reject")]
    [Authorize(Roles = "Doctor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Reject([FromRoute] Guid id, [FromBody] UpdateAppointmentStatusDto dto)
    {
        await _appointmentService.RejectAppointmentAsync(id, CurrentUserId, dto);
        return Success(message: "Appointment rejected.");
    }

    /// <summary>Cancel an appointment (Patient or Doctor).</summary>
    [HttpPut("{id:guid}/cancel")]
    [Authorize(Roles = "Patient,Doctor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Cancel([FromRoute] Guid id)
    {
        await _appointmentService.CancelAppointmentAsync(id, CurrentUserId);
        return Success(message: "Appointment cancelled.");
    }
}
