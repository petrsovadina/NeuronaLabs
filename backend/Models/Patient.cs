using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NeuronaLabs.Models
{
    public enum Gender 
    {
        Male,
        Female,
        Other
    }

    public class Patient
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public Gender Gender { get; set; }

        [EmailAddress]
        [MaxLength(255)]
        public string? ContactEmail { get; set; }

        [Phone]
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        [MaxLength(5)]
        public string? BloodType { get; set; }

        [MaxLength(100)]
        public string? InsuranceCompany { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DeletedAt { get; set; }

        // Navigační vlastnosti
        [JsonIgnore]
        public virtual ICollection<Diagnosis> Diagnoses { get; set; } = new List<Diagnosis>();

        [JsonIgnore]
        public virtual ICollection<DicomStudy> DicomStudies { get; set; } = new List<DicomStudy>();

        [JsonIgnore]
        public virtual ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();

        [JsonIgnore]
        public virtual ICollection<Allergy> Allergies { get; set; } = new List<Allergy>();

        [JsonIgnore]
        public virtual ICollection<Medication> Medications { get; set; } = new List<Medication>();

        // Pomocné metody
        public string GetFullName() => $"{FirstName} {LastName}";
        public int GetAge() => DateTime.Now.Year - DateOfBirth.Year;
    }
}
