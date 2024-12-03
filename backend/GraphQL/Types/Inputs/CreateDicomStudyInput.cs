using System;
using System.ComponentModel.DataAnnotations;

namespace NeuronaLabs.GraphQL.Types.Inputs
{
    public class CreateDicomStudyInput
    {
        [Required]
        public string StudyInstanceUid { get; set; }
        
        [Required]
        public string StudyDescription { get; set; }
        
        [Required]
        public DateTime StudyDate { get; set; }
        
        [Required]
        public Guid PatientId { get; set; }
        
        [Required]
        public string Modality { get; set; }
        
        public string AccessionNumber { get; set; }
    }
}
