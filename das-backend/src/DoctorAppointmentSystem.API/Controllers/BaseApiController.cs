using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DoctorAppointmentSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public abstract class BaseApiController : ControllerBase
{
    /// <summary>Returns the authenticated user's Identity ID from the JWT claim.</summary>
    protected string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User identity claim is missing.");

    protected IActionResult Success(object? data = null, string message = "Success")
        => Ok(new { success = true, message, data });

    protected IActionResult Created(object data, string message = "Created successfully")
        => StatusCode(201, new { success = true, message, data });
}
