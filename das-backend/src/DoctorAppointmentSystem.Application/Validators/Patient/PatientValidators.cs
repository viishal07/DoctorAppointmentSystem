using DoctorAppointmentSystem.Application.DTOs.Patient;
using FluentValidation;

namespace DoctorAppointmentSystem.Application.Validators.Patient;

public class UpdatePatientProfileValidator : AbstractValidator<UpdatePatientProfileDto>
{
    public UpdatePatientProfileValidator()
    {
        RuleFor(x => x.PhoneNumber).NotEmpty().Matches(@"^\+?[0-9]{7,15}$").WithMessage("Invalid phone number.");
        RuleFor(x => x.Address).NotEmpty().MaximumLength(300);
        RuleFor(x => x.BloodGroup)
            .Must(bg => new[] { "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" }.Contains(bg))
            .When(x => !string.IsNullOrEmpty(x.BloodGroup))
            .WithMessage("Invalid blood group.");
    }
}
