using FluentValidation;
using NeuronaLabs.Models;
using System.Text.RegularExpressions;

namespace NeuronaLabs.Validators;

public class PatientValidator : AbstractValidator<Patient>
{
    public PatientValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Jméno je povinné")
            .MinimumLength(2).WithMessage("Jméno musí mít minimálně 2 znaky")
            .MaximumLength(50).WithMessage("Jméno nesmí přesáhnout 50 znaků");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Příjmení je povinné")
            .MinimumLength(2).WithMessage("Příjmení musí mít minimálně 2 znaky")
            .MaximumLength(50).WithMessage("Příjmení nesmí přesáhnout 50 znaků");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Datum narození je povinné")
            .Must(BeAValidDate).WithMessage("Neplatné datum narození");

        RuleFor(x => x.Gender)
            .Must(BeAValidGender).WithMessage("Neplatné pohlaví");

        RuleFor(x => x.ContactEmail)
            .EmailAddress().When(x => !string.IsNullOrEmpty(x.ContactEmail))
            .WithMessage("Neplatný formát emailu");

        RuleFor(x => x.PhoneNumber)
            .Matches(@"^\+?(\d{9,15})$").When(x => !string.IsNullOrEmpty(x.PhoneNumber))
            .WithMessage("Neplatný formát telefonního čísla");

        RuleFor(x => x.BloodType)
            .Must(BeAValidBloodType).When(x => !string.IsNullOrEmpty(x.BloodType))
            .WithMessage("Neplatná krevní skupina");
    }

    private bool BeAValidDate(DateTime date)
    {
        return date <= DateTime.Now && date >= DateTime.Now.AddYears(-120);
    }

    private bool BeAValidGender(string? gender)
    {
        if (string.IsNullOrEmpty(gender)) return true;
        return new[] { "Muž", "Žena", "Jiné" }.Contains(gender);
    }

    private bool BeAValidBloodType(string? bloodType)
    {
        if (string.IsNullOrEmpty(bloodType)) return true;
        return new[] { "A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-" }.Contains(bloodType);
    }
}
