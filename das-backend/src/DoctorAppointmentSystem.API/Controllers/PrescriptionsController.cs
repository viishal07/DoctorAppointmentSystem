using DoctorAppointmentSystem.Application.DTOs.Prescription;
using DoctorAppointmentSystem.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoctorAppointmentSystem.API.Controllers;

/// <summary>Prescription management.</summary>
[Authorize]
public class PrescriptionsController : BaseApiController
{
    private readonly IPrescriptionService _prescriptionService;

    public PrescriptionsController(IPrescriptionService prescriptionService)
    {
        _prescriptionService = prescriptionService;
    }

    /// <summary>Issue a prescription for an approved appointment (Doctor only).</summary>
    [HttpPost]
    [Authorize(Roles = "Doctor")]
    [ProducesResponseType(typeof(PrescriptionResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreatePrescriptionDto dto)
    {
        var result = await _prescriptionService.CreatePrescriptionAsync(CurrentUserId, dto);
        return Created(result, "Prescription issued successfully.");
    }

    /// <summary>Get a prescription by ID (Doctor or Patient).</summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Doctor,Patient,Admin")]
    [ProducesResponseType(typeof(PrescriptionResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var result = await _prescriptionService.GetByIdAsync(id);
        return Success(result);
    }

    /// <summary>Get all prescriptions for a specific patient (Doctor or Admin).</summary>
    [HttpGet("patient/{patientId:guid}")]
    [Authorize(Roles = "Doctor,Patient,Admin")]
    [ProducesResponseType(typeof(IEnumerable<PrescriptionResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByPatient([FromRoute] Guid patientId)
    {
        var result = await _prescriptionService.GetByPatientIdAsync(patientId);
        return Success(result);
    }
}
