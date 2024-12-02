using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NeuronaLabs.Models
{
    public enum DicomStudyStatus
    {
        Uploaded,
        Processing,
        Available,
        Error
    }

    public enum DicomModality
    {
        CT,
        MRI,
        XRay,
        Ultrasound,
        PET,
        Other
    }

    public class DicomStudy
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        [ForeignKey(nameof(Patient))]
        public Guid PatientId { get; set; }

        [Required]
        [MaxLength(255)]
        public string OrthancStudyId { get; set; } = string.Empty;

        [Required]
        public DateTime StudyDate { get; set; }

        [Required]
        public DicomModality Modality { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public int SeriesCount { get; set; }
        public int InstanceCount { get; set; }

        [MaxLength(500)]
        public string? ThumbnailUrl { get; set; }

        [MaxLength(1000)]
        public string? WadoUri { get; set; }

        public DicomStudyStatus Status { get; set; } = DicomStudyStatus.Uploaded;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigační vlastnosti
        [JsonIgnore]
        public virtual Patient? Patient { get; set; }

        // Pomocné metody
        public bool IsProcessingComplete() => Status == DicomStudyStatus.Available;
        public string GetModalityDisplay() => Modality.ToString();
    }
}
