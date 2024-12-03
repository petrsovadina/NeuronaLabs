using HotChocolate;
using System.ComponentModel.DataAnnotations;

namespace NeuronaLabs.GraphQL.Types
{
    public record ExtendedPatientType
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
}
