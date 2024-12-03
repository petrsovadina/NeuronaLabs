using System;
using System.Collections.Generic;

namespace NeuronaLabs.Models.Ohif
{
    public class OhifStudyConfiguration
    {
        public string StudyInstanceUid { get; set; } = string.Empty;
        public string StudyDescription { get; set; } = string.Empty;
        public DateTime StudyDate { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string PatientId { get; set; } = string.Empty;
        public string Modality { get; set; } = string.Empty;
        public string AccessionNumber { get; set; } = string.Empty;
        public string WadoRsRoot { get; set; } = string.Empty;
        public string QidoRsRoot { get; set; } = string.Empty;
        public string WadoRoot { get; set; } = string.Empty;
        public List<OhifSeries> Series { get; set; } = new();
    }

    public class OhifSeries
    {
        public string SeriesInstanceUid { get; set; } = string.Empty;
        public string SeriesDescription { get; set; } = string.Empty;
        public string Modality { get; set; } = string.Empty;
        public string SeriesNumber { get; set; } = string.Empty;
        public string WadoUri { get; set; } = string.Empty;
        public List<OhifInstance> Instances { get; set; } = new();
    }

    public class OhifInstance
    {
        public string SopInstanceUid { get; set; } = string.Empty;
        public string InstanceNumber { get; set; } = string.Empty;
        public string Rows { get; set; } = string.Empty;
        public string Columns { get; set; } = string.Empty;
        public string WadoUri { get; set; } = string.Empty;
        public string FrameIndex { get; set; } = string.Empty;
        public Dictionary<string, object> InstanceMetadata { get; set; } = new();
    }
}
