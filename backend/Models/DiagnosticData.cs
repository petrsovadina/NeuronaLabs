using System;

namespace NeuronaLabs.Models
{
    public class DiagnosticData
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public required Patient Patient { get; set; }
        public required string DiagnosisType { get; set; }
        public required string Description { get; set; }
        public DateTime DiagnosisDate { get; set; }
        public string? Notes { get; set; }
    }
}
