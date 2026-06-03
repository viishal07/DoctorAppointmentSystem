using DoctorAppointmentSystem.Application.DTOs.Doctor;
using FluentValidation;

namespace DoctorAppointmentSystem.Application.Validators.Doctor;

public class UpdateDoctorProfileValidator : AbstractValidator<UpdateDoctorProfileDto>
{
    public UpdateDoctorProfileValidator()
    {
        RuleFor(x => x.PhoneNumber).NotEmpty().Matches(@"^\+?[0-9]{7,15}$").WithMessage("Invalid phone number.");
        RuleFor(x => x.DepartmentId).NotEmpty().WithMessage("Department is required.");
        RuleFor(x => x.Qualifications).NotEmpty().MaximumLength(500);
        RuleFor(x => x.ConsultationFee).GreaterThan(0).WithMessage("Consultation fee must be greater than zero.");
    }
}
