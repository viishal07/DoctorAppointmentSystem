using DoctorAppointmentSystem.Application.DTOs.Prescription;
using FluentValidation;

namespace DoctorAppointmentSystem.Application.Validators.Prescription;

public class CreatePrescriptionValidator : AbstractValidator<CreatePrescriptionDto>
{
    public CreatePrescriptionValidator()
    {
        RuleFor(x => x.AppointmentId).NotEmpty().WithMessage("Appointment is required.");
        RuleFor(x => x.Diagnosis).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.Medications).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Instructions).MaximumLength(2000);
    }
}
