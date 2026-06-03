using DoctorAppointmentSystem.Application.DTOs.Availability;
using FluentValidation;

namespace DoctorAppointmentSystem.Application.Validators.Availability;

public class SetAvailabilityValidator : AbstractValidator<SetAvailabilityDto>
{
    public SetAvailabilityValidator()
    {
        RuleFor(x => x.DayOfWeek).IsInEnum().WithMessage("Invalid day of week.");
        RuleFor(x => x.StartTime).NotEmpty();
        RuleFor(x => x.EndTime).NotEmpty();
        RuleFor(x => x).Must(x => x.StartTime < x.EndTime)
            .WithMessage("Start time must be before end time.");
    }
}
