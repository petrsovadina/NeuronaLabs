using System;

namespace NeuronaLabs.Models
{
    public class DicomStudy
    {
        public int Id { get; set; }
        public required string StudyInstanceUid { get; set; }
        public int PatientId { get; set; }
        public required Patient Patient { get; set; }
        public required string Modality { get; set; }
        public DateTime StudyDate { get; set; }
    }
}
