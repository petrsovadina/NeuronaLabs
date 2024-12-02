using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NeuronaLabs.Models
{
    public enum DiagnosisSeverity
    {
        Low,
        Medium, 
        High,
        Critical
    }

    public class Diagnosis
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        [ForeignKey(nameof(Patient))]
        public Guid PatientId { get; set; }

        [Required]
        [MaxLength(500)]
        public string DiagnosisText { get; set; } = string.Empty;

        [Required]
        public DateTime DiagnosisDate { get; set; }

        [MaxLength(100)]
        public string? DiagnosisType { get; set; }

        public DiagnosisSeverity? Severity { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigační vlastnosti
        [JsonIgnore]
        public virtual Patient? Patient { get; set; }

        // Pomocné metody
        public bool IsSerious() => Severity is DiagnosisSeverity.High or DiagnosisSeverity.Critical;
    }
}
