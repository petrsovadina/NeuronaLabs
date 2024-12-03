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
        [MaxLength(64)]
        public string StudyInstanceUid { get; set; } = string.Empty;

        [Required]
        public DateTime StudyDate { get; set; }

        [Required]
        public DicomModality Modality { get; set; }

        [MaxLength(500)]
        public string? StudyDescription { get; set; }

        [MaxLength(64)]
        public string? AccessionNumber { get; set; }

        [MaxLength(255)]
        public string? ReferringPhysicianName { get; set; }

        [MaxLength(255)]
        public string? InstitutionName { get; set; }

        public int SeriesCount { get; set; }
        public int InstancesCount { get; set; }
        public long TotalSizeInBytes { get; set; }

        [MaxLength(500)]
        public string? ThumbnailUrl { get; set; }

        [MaxLength(1000)]
        public string? DicomFilePath { get; set; }

        [MaxLength(1000)]
        public string? WadoUri { get; set; }

        [MaxLength(1000)]
        public string? QidoUri { get; set; }

        [MaxLength(1000)]
        public string? WadoRsUri { get; set; }

        [Column(TypeName = "jsonb")]
        public DicomStudyMetadata? Metadata { get; set; }

        public DicomStudyStatus StudyStatus { get; set; } = DicomStudyStatus.Uploaded;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigační vlastnosti
        [JsonIgnore]
        public virtual Patient? Patient { get; set; }

        // Pomocné metody
        public bool IsProcessingComplete() => StudyStatus == DicomStudyStatus.Available;
        public string GetModalityDisplay() => Modality.ToString();

        // OHIF Viewer URL
        [NotMapped]
        public string? OhifViewerUrl => !string.IsNullOrEmpty(StudyInstanceUid) 
            ? $"/ohif/viewer/{StudyInstanceUid}"
            : null;
    }
}
