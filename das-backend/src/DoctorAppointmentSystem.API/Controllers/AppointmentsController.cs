using DoctorAppointmentSystem.Application.DTOs.Appointment;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.API.Controllers;

/// Appointment booking and management.
[Authorize]
public class AppointmentsController : BaseApiController
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentsController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    /// Book a new appointment (Patient only)
    [HttpPost]
    [Authorize(Roles = "Patient")]
    [ProducesResponseType(typeof(AppointmentResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Book([FromBody] BookAppointmentDto dto)
    {
        var result = await _appointmentService.BookAppointmentAsync(CurrentUserId, dto);
        return Created(result, "Appointment booked successfully.");
    }

    /// Get a specific appointment by ID.
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Doctor,Patient,Admin")]
    [ProducesResponseType(typeof(AppointmentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var result = await _appointmentService.GetByIdAsync(id, CurrentUserId, User.IsInRole("Admin"));
        return Success(result);
    }

    /// Get all appointments for the authenticated doctor
    [HttpGet("doctor")]
    [Authorize(Roles = "Doctor")]
    [ProducesResponseType(typeof(IEnumerable<AppointmentSummaryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDoctorAppointments()
    {
        var result = await _appointmentService.GetDoctorAppointmentsAsync(CurrentUserId);
        return Success(result);
    }

    /// Get all appointments for the authenticated patient.
    [HttpGet("patient")]
    [Authorize(Roles = "Patient")]
    [ProducesResponseType(typeof(IEnumerable<AppointmentSummaryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPatientAppointments()
    {
        var result = await _appointmentService.GetPatientAppointmentsAsync(CurrentUserId);
        return Success(result);
    }

    ///Approve a pending appointment (Doctor only).
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

    /// Reject a pending appointment (Doctor only)
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

    /// Cancel an appointment (Patient or Doctor).
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
