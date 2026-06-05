using DoctorAppointmentSystem.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.API.Controllers;

/// Admin-only system management
[Authorize(Roles = "Admin")]
public class AdminController : BaseApiController
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    /// Get system dashboard statistics
    [HttpGet("dashboard")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Dashboard()
    {
        var stats = await _adminService.GetDashboardStatsAsync();
        return Success(stats);
    }

    /// Get all registered users.
    [HttpGet("users")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Success(users);
    }

    /// Toggle a user's active/inactive status.
    [HttpPut("users/{userId}/toggle-status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleUserStatus([FromRoute] string userId)
    {
        await _adminService.ToggleUserStatusAsync(userId);
        return Success(message: "User status updated.");
    }

    /// Get all appointments in the system.
    [HttpGet("appointments")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAppointments()
    {
        var appointments = await _adminService.GetAllAppointmentsAsync();
        return Success(appointments);
    }

    ///Get doctors pending approval
    [HttpGet("doctors/pending")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendingDoctors()
    {
        var doctors = await _adminService.GetPendingDoctorsAsync();
        return Success(doctors);
    }

    /// Approve a doctor's account
    [HttpPut("doctors/{doctorId:guid}/approve")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ApproveDoctor([FromRoute] Guid doctorId)
    {
        await _adminService.ApproveDoctorAsync(doctorId);
        return Success(message: "Doctor approved successfully.");
    }
}
