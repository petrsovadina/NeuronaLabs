using System;

namespace NeuronaLabs.Models
{
    public class DicomStudy
    {
        public int Id { get; set; }
        public required string StudyInstanceUid { get; set; }
        public required string Modality { get; set; }
        public string? Description { get; set; }
        public int NumberOfSeries { get; set; }
        public int NumberOfInstances { get; set; }
        public DateTime StudyDate { get; set; }
        public int PatientId { get; set; }
        public virtual Patient? Patient { get; set; }
    }
}
