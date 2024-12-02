using FluentValidation;
using NeuronaLabs.Models;
using System.IO;

namespace NeuronaLabs.Validators;

public class DicomStudyValidator : AbstractValidator<DicomStudy>
{
    public DicomStudyValidator()
    {
        RuleFor(x => x.PatientId)
            .NotEmpty().WithMessage("ID pacienta je povinné");

        RuleFor(x => x.StudyInstanceUid)
            .NotEmpty().WithMessage("Study Instance UID je povinné")
            .MaximumLength(64).WithMessage("Study Instance UID nesmí přesáhnout 64 znaků");

        RuleFor(x => x.StudyDescription)
            .MaximumLength(200).WithMessage("Popis studie nesmí přesáhnout 200 znaků");

        RuleFor(x => x.Modality)
            .NotEmpty().WithMessage("Modalita je povinná")
            .Must(BeAValidModality).WithMessage("Neplatná modalita");

        RuleFor(x => x.StudyDate)
            .NotEmpty().WithMessage("Datum studie je povinné")
            .Must(BeAValidDate).WithMessage("Neplatné datum studie");

        RuleFor(x => x.DicomFilePath)
            .NotEmpty().WithMessage("Cesta k DICOM souboru je povinná")
            .Must(FileExists).WithMessage("DICOM soubor neexistuje");
    }

    private bool BeAValidDate(DateTime date)
    {
        return date <= DateTime.Now && date >= DateTime.Now.AddYears(-120);
    }

    private bool BeAValidModality(string modality)
    {
        // Seznam validních modalit dle DICOM standardu
        string[] validModalities = {
            "CR", "CT", "MR", "NM", "US", "XA", "RF", "MG", "PX", "PT", "SC", "XC"
        };
        return validModalities.Contains(modality);
    }

    private bool FileExists(string filePath)
    {
        return !string.IsNullOrEmpty(filePath) && File.Exists(filePath);
    }
}
