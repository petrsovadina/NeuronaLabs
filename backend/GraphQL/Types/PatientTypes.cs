using HotChocolate;
using System.ComponentModel.DataAnnotations;

namespace NeuronaLabs.GraphQL.Types
{
    public record PatientType
    {
        public Guid Id { get; init; }
        
        [Required]
        public string FirstName { get; init; }
        
        [Required]
        public string LastName { get; init; }
        
        [Required]
        public DateTime BirthDate { get; init; }
        
        [Required]
        public string Gender { get; init; }
        
        public string? Email { get; init; }
        public string? PhoneNumber { get; init; }
        public string? MedicalInsuranceNumber { get; init; }
    }

    public record CreatePatientInput
    {
        [Required]
        public string FirstName { get; init; }
        
        [Required]
        public string LastName { get; init; }
        
        [Required]
        public DateTime BirthDate { get; init; }
        
        [Required]
        public string Gender { get; init; }
        
        public string? Email { get; init; }
        public string? PhoneNumber { get; init; }
        public string? MedicalInsuranceNumber { get; init; }
    }

    public record DicomStudyType
    {
        public Guid Id { get; init; }
        public Guid PatientId { get; init; }
        public string StudyInstanceUid { get; init; }
        public DateTime StudyDate { get; init; }
        public string Modality { get; init; }
        public string? Description { get; init; }
        public string? OrthancStudyId { get; init; }
        public int SeriesCount { get; init; }
        public int ImagesCount { get; init; }
        public string StudyStatus { get; init; }
    }

    public record CreateDicomStudyInput
    {
        [Required]
        public Guid PatientId { get; init; }
        
        [Required]
        public string StudyInstanceUid { get; init; }
        
        [Required]
        public DateTime StudyDate { get; init; }
        
        [Required]
        public string Modality { get; init; }
        
        public string? Description { get; init; }
        public string? OrthancStudyId { get; init; }
    }
}
