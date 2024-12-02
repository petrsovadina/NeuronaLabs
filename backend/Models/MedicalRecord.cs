using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NeuronaLabs.Models;

public class MedicalRecord
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required]
    public Guid PatientId { get; set; }

    [Required]
    [MaxLength(100)]
    public string RecordType { get; set; } = string.Empty;

    [Required]
    public DateTime RecordDate { get; set; }

    public string? Content { get; set; }

    [MaxLength(255)]
    public string? Author { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public virtual Patient? Patient { get; set; }

    // Metoda pro serializaci a deserializaci JSON obsahu
    public T? GetContentAs<T>() where T : class
    {
        if (string.IsNullOrEmpty(Content)) return null;
        return JsonSerializer.Deserialize<T>(Content);
    }

    public void SetContent<T>(T content) where T : class
    {
        Content = JsonSerializer.Serialize(content);
    }
}
