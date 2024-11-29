using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NeuronaLabs.Models
{
    public class Patient
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string LastDiagnosis { get; set; }
        [Required]
        public ICollection<DiagnosticData> DiagnosticData { get; set; } = new List<DiagnosticData>();
        [Required]
        public ICollection<DicomStudy> DicomStudies { get; set; } = new List<DicomStudy>();
    }
}
