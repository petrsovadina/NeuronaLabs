using System;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using NeuronaLabs.Models;
using NeuronaLabs.Models.Ohif;

namespace NeuronaLabs.Services.Interfaces
{
    public interface IDicomService
    {
        // Základní operace pro získání studií
        Task<DicomStudy?> GetStudyByUidAsync(string studyInstanceUid);
        Task<IEnumerable<DicomStudy>> GetStudiesAsync(
            string? patientId = null,
            string? modality = null,
            string? studyDate = null,
            StudyStatus? status = null);
        Task<IEnumerable<DicomStudy>> GetStudiesByPatientIdAsync(
            string patientId,
            string? modality = null,
            StudyStatus? status = null);

        // Metadata operace
        Task<DicomStudyMetadata> ExtractDicomMetadataAsync(Stream dicomStream);
        Task<OhifStudyMetadata> ExtractOhifMetadataAsync(Stream dicomStream);
        
        // OHIF Viewer konfigurace
        Task<OhifStudyConfiguration> GetOhifStudyConfigurationAsync(string studyInstanceUid);
        Task<OhifStudyConfiguration> GenerateOhifStudyConfiguration(DicomStudy study);
    }
}
