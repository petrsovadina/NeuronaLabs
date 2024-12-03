using System.ComponentModel.DataAnnotations;

namespace NeuronaLabs.GraphQL.Types.Inputs;

public record CreateDiagnosisInput
{
    [Required]
    public Guid PatientId { get; init; }
    
    [Required]
    public string DiagnosisText { get; init; }
    
    [Required]
    public DiagnosisStatus Status { get; init; }
    
    public string? Notes { get; init; }
}
