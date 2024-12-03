using System.ComponentModel.DataAnnotations;

namespace NeuronaLabs.GraphQL.Types.Inputs;

public record CreateStudyInput
{
    [Required]
    public Guid PatientId { get; init; }
    
    [Required]
    public string StudyInstanceUid { get; init; }
    
    [Required]
    public DateTime StudyDate { get; init; }
    
    [Required]
    public Modality Modality { get; init; }
    
    public string? Description { get; init; }
    public string? OrthancStudyId { get; init; }
}
