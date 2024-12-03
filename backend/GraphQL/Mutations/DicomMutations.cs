using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using NeuronaLabs.Models;
using NeuronaLabs.Models.Ohif;
using NeuronaLabs.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace NeuronaLabs.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class DicomMutations
    {
        private readonly IDicomService _dicomService;
        private readonly ILogger<DicomMutations> _logger;

        public DicomMutations(
            IDicomService dicomService,
            ILogger<DicomMutations> logger)
        {
            _dicomService = dicomService;
            _logger = logger;
        }

        [Authorize]
        [GraphQLName("uploadDicomStudy")]
        public async Task<UploadDicomResult> UploadDicomStudyAsync(IFile file)
        {
            try
            {
                using var stream = file.OpenReadStream();
                
                // Extrahujeme metadata z DICOM souboru
                var dicomMetadata = await _dicomService.ExtractDicomMetadataAsync(stream);
                var ohifMetadata = await _dicomService.ExtractOhifMetadataAsync(stream);

                // Vytvoříme konfiguraci pro OHIF viewer
                var study = new DicomStudy
                {
                    StudyInstanceUid = dicomMetadata.StudyInstanceUid,
                    PatientId = dicomMetadata.PatientId,
                    PatientName = dicomMetadata.PatientName,
                    StudyDate = dicomMetadata.StudyDate ?? DateTime.UtcNow,
                    StudyDescription = dicomMetadata.StudyDescription,
                    Modality = dicomMetadata.Modality,
                    AccessionNumber = dicomMetadata.AccessionNumber,
                    ReferringPhysicianName = dicomMetadata.ReferringPhysicianName,
                    InstitutionName = dicomMetadata.InstitutionName,
                    Status = StudyStatus.Processing
                };

                var ohifConfig = await _dicomService.GenerateOhifStudyConfiguration(study);

                return new UploadDicomResult
                {
                    Success = true,
                    StudyInstanceUid = study.StudyInstanceUid,
                    DicomMetadata = dicomMetadata,
                    OhifMetadata = ohifMetadata,
                    OhifConfiguration = ohifConfig
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading DICOM study");
                return new UploadDicomResult
                {
                    Success = false,
                    ErrorMessage = "Failed to upload DICOM study: " + ex.Message
                };
            }
        }

        [Authorize]
        [GraphQLName("updateDicomStudyStatus")]
        public async Task<UpdateDicomStudyResult> UpdateDicomStudyStatusAsync(
            string studyInstanceUid,
            StudyStatus status)
        {
            try
            {
                var study = await _dicomService.GetStudyByUidAsync(studyInstanceUid);
                if (study == null)
                {
                    return new UpdateDicomStudyResult
                    {
                        Success = false,
                        ErrorMessage = $"Study with UID {studyInstanceUid} not found"
                    };
                }

                study.Status = status;
                // await _dicomService.UpdateStudyAsync(study);

                return new UpdateDicomStudyResult
                {
                    Success = true,
                    Study = study
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating DICOM study status");
                return new UpdateDicomStudyResult
                {
                    Success = false,
                    ErrorMessage = "Failed to update study status: " + ex.Message
                };
            }
        }
    }

    public class UploadDicomResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public string? StudyInstanceUid { get; set; }
        public DicomStudyMetadata? DicomMetadata { get; set; }
        public OhifStudyMetadata? OhifMetadata { get; set; }
        public OhifStudyConfiguration? OhifConfiguration { get; set; }
    }

    public class UpdateDicomStudyResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public DicomStudy? Study { get; set; }
    }
}
