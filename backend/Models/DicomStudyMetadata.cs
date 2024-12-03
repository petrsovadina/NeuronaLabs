using System;
using System.Collections.Generic;

namespace NeuronaLabs.Models
{
    public class DicomStudyMetadata
    {
        // Povinné DICOM tagy
        public string StudyInstanceUid { get; set; } = string.Empty;
        public string Modality { get; set; } = string.Empty;
        public string StudyDescription { get; set; } = string.Empty;
        public DateTime StudyDate { get; set; }
        public string StudyTime { get; set; } = string.Empty;
        
        // Volitelné DICOM tagy
        public string? AccessionNumber { get; set; }
        public string? ReferringPhysicianName { get; set; }
        public string? InstitutionName { get; set; }
        
        // Pacientské informace
        public string? PatientId { get; set; }
        public string? PatientName { get; set; }
        public string? PatientBirthDate { get; set; }
        public string? PatientSex { get; set; }
        
        // Statistiky studie
        public int SeriesCount { get; set; }
        public int ImagesCount { get; set; }
        public int InstancesCount { get; set; }
        public long TotalSizeInBytes { get; set; }
        
        // Identifikátory studie
        public string? StudyId { get; set; }
        public string? OrthancStudyId { get; set; }
        
        // Procedurální informace
        public string? PerformedProcedureStepStartDate { get; set; }
        public string? PerformedProcedureStepStartTime { get; set; }
        public string? RequestedProcedureDescription { get; set; }
        public string? RequestedProcedureId { get; set; }
        public string? ScheduledProcedureStepId { get; set; }
        
        // Metadata a tagy
        public Dictionary<string, string>? CustomMetadata { get; set; }
        public Dictionary<string, string>? DicomTags { get; set; }
    }
}
