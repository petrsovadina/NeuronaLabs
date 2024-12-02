using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NeuronaLabs.Models;

public class Medication
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required]
    public Guid PatientId { get; set; }

    [Required]
    [MaxLength(255)]
    public string MedicationName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Dosage { get; set; }

    [MaxLength(100)]
    public string? Frequency { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string? PrescriptionDetails { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public virtual Patient? Patient { get; set; }

    // Metoda pro serializaci a deserializaci JSON detailů receptu
    public T? GetPrescriptionDetailsAs<T>() where T : class
    {
        if (string.IsNullOrEmpty(PrescriptionDetails)) return null;
        return JsonSerializer.Deserialize<T>(PrescriptionDetails);
    }

    public void SetPrescriptionDetails<T>(T details) where T : class
    {
        PrescriptionDetails = JsonSerializer.Serialize(details);
    }
}
