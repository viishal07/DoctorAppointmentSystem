using DoctorAppointmentSystem.Application.DTOs.Appointment;
using FluentValidation;

namespace DoctorAppointmentSystem.Application.Validators.Appointment;

public class BookAppointmentValidator : AbstractValidator<BookAppointmentDto>
{
    public BookAppointmentValidator()
    {
        RuleFor(x => x.DoctorId).NotEmpty().WithMessage("Doctor is required.");
        RuleFor(x => x.ScheduledAt)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow).WithMessage("Appointment must be scheduled in the future.");
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(500);
    }
}
