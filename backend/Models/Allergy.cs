using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NeuronaLabs.Models;

public class Allergy
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required]
    public Guid PatientId { get; set; }

    [Required]
    [MaxLength(255)]
    public string Allergen { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Severity { get; set; }

    public string? Reaction { get; set; }

    public DateTime? FirstObservedDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public virtual Patient? Patient { get; set; }
}
