using System;
using System.Collections.Generic;

namespace NeuronaLabs.Models
{
    public class Study
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }
        public virtual ICollection<DicomStudy> DicomStudies { get; set; }
    }
}
