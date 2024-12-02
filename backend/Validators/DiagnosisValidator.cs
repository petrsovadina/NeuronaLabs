using FluentValidation;
using NeuronaLabs.Models;

namespace NeuronaLabs.Validators;

public class DiagnosisValidator : AbstractValidator<Diagnosis>
{
    public DiagnosisValidator()
    {
        RuleFor(x => x.PatientId)
            .NotEmpty().WithMessage("ID pacienta je povinné");

        RuleFor(x => x.DiagnosisCode)
            .NotEmpty().WithMessage("Diagnostický kód je povinný")
            .MaximumLength(10).WithMessage("Diagnostický kód nesmí přesáhnout 10 znaků");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Popis diagnózy je povinný")
            .MinimumLength(5).WithMessage("Popis diagnózy musí mít minimálně 5 znaků")
            .MaximumLength(500).WithMessage("Popis diagnózy nesmí přesáhnout 500 znaků");

        RuleFor(x => x.DiagnosisDate)
            .NotEmpty().WithMessage("Datum diagnózy je povinné")
            .Must(BeAValidDate).WithMessage("Neplatné datum diagnózy");

        RuleFor(x => x.DiagnosedBy)
            .NotEmpty().WithMessage("Jméno lékaře je povinné")
            .MinimumLength(2).WithMessage("Jméno lékaře musí mít minimálně 2 znaky")
            .MaximumLength(100).WithMessage("Jméno lékaře nesmí přesáhnout 100 znaků");
    }

    private bool BeAValidDate(DateTime date)
    {
        return date <= DateTime.Now && date >= DateTime.Now.AddYears(-120);
    }
}
