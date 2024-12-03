using System;
using System.Collections.Generic;

namespace NeuronaLabs.Models.Ohif
{
    public class OhifStudyMetadata
    {
        public string StudyInstanceUid { get; set; } = string.Empty;
        public string StudyDescription { get; set; } = string.Empty;
        public DateTime StudyDate { get; set; }
        public string PatientId { get; set; } = string.Empty;
        public string PatientName { get; set; } = string.Empty;
        public List<OhifSeriesMetadata> Series { get; set; } = new();
    }

    public class OhifSeriesMetadata
    {
        public string SeriesInstanceUid { get; set; } = string.Empty;
        public string SeriesDescription { get; set; } = string.Empty;
        public string Modality { get; set; } = string.Empty;
        public List<OhifInstanceMetadata> Instances { get; set; } = new();
    }

    public class OhifInstanceMetadata
    {
        public string SopInstanceUid { get; set; } = string.Empty;
        public string InstanceNumber { get; set; } = string.Empty;
        public int Rows { get; set; }
        public int Columns { get; set; }
        public string PhotometricInterpretation { get; set; } = string.Empty;
        public int? FrameIndex { get; set; }
    }
}
