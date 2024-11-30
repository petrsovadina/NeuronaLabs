using System;
using System.Text.Json.Serialization;
using Postgrest.Attributes;
using Postgrest.Models;

namespace NeuronaLabs.Models
{
    [Table("doctors")]
    public class Doctor : BaseModel
    {
        [PrimaryKey("id")]
        public string Id { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; }

        [Column("last_name")]
        public string LastName { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("phone")]
        public string Phone { get; set; }

        [Column("role")]
        public string Role { get; set; }

        [Column("specialization")]
        public string Specialization { get; set; }

        [Column("license_number")]
        public string LicenseNumber { get; set; }

        [Column("institution")]
        public string Institution { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }

    [Table("patients")]
    public class Patient : BaseModel
    {
        [PrimaryKey("id")]
        public string Id { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; }

        [Column("last_name")]
        public string LastName { get; set; }

        [Column("birth_date")]
        public DateTime BirthDate { get; set; }

        [Column("personal_id")]
        public string PersonalId { get; set; }

        [Column("gender")]
        public string Gender { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("phone")]
        public string Phone { get; set; }

        [Column("address")]
        public string Address { get; set; }

        [Column("insurance_number")]
        public string InsuranceNumber { get; set; }

        [Column("insurance_provider")]
        public string InsuranceProvider { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("created_by")]
        public string CreatedBy { get; set; }
    }

    [Table("dicom_studies")]
    public class DicomStudy : BaseModel
    {
        [PrimaryKey("id")]
        public string Id { get; set; }

        [Column("patient_id")]
        public string PatientId { get; set; }

        [Column("doctor_id")]
        public string DoctorId { get; set; }

        [Column("dicom_uid")]
        public string DicomUid { get; set; }

        [Column("modality")]
        public string Modality { get; set; }

        [Column("study_date")]
        public DateTime StudyDate { get; set; }

        [Column("accession_number")]
        public string AccessionNumber { get; set; }

        [Column("study_description")]
        public string StudyDescription { get; set; }

        [Column("status")]
        public string Status { get; set; }

        [Column("folder_path")]
        public string FolderPath { get; set; }

        [Column("number_of_images")]
        public int NumberOfImages { get; set; }

        [Column("study_size")]
        public long StudySize { get; set; }

        [Column("metadata", TypeFormat = "jsonb")]
        public Dictionary<string, object> Metadata { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }

    [Table("diagnoses")]
    public class Diagnosis : BaseModel
    {
        [PrimaryKey("id")]
        public string Id { get; set; }

        [Column("study_id")]
        public string StudyId { get; set; }

        [Column("doctor_id")]
        public string DoctorId { get; set; }

        [Column("diagnosis_text")]
        public string DiagnosisText { get; set; }

        [Column("findings")]
        public string Findings { get; set; }

        [Column("recommendations")]
        public string Recommendations { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}
