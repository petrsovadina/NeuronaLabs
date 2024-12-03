using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NeuronaLabs.Models;
using NeuronaLabs.Models.Ohif;
using NeuronaLabs.Services.Interfaces;
using FellowOakDicom;

namespace NeuronaLabs.Services.Implementation
{
    public class DicomService : IDicomService
    {
        private readonly IOrthancService _orthancService;
        private readonly IDicomStudyRepository _dicomStudyRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<DicomService> _logger;

        public DicomService(
            IOrthancService orthancService,
            IDicomStudyRepository dicomStudyRepository,
            IConfiguration configuration,
            ILogger<DicomService> logger)
        {
            _orthancService = orthancService;
            _dicomStudyRepository = dicomStudyRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<DicomStudy?> GetStudyByUidAsync(string studyInstanceUid)
        {
            try
            {
                return await _dicomStudyRepository.GetByStudyInstanceUidAsync(studyInstanceUid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting study by UID {StudyInstanceUid}", studyInstanceUid);
                throw;
            }
        }

        public async Task<IEnumerable<DicomStudy>> GetStudiesAsync(
            string? patientId = null,
            string? modality = null,
            string? studyDate = null,
            StudyStatus? status = null)
        {
            try
            {
                var studies = await _dicomStudyRepository.GetAllAsync();

                if (!string.IsNullOrEmpty(patientId))
                    studies = studies.Where(s => s.PatientId.ToString() == patientId);

                if (!string.IsNullOrEmpty(modality) && Enum.TryParse<DicomModality>(modality, true, out var modalityEnum))
                    studies = studies.Where(s => s.Modality == modalityEnum);

                if (!string.IsNullOrEmpty(studyDate) && DateTime.TryParse(studyDate, out var date))
                    studies = studies.Where(s => s.StudyDate.Date == date.Date);

                if (status.HasValue)
                    studies = studies.Where(s => s.Status == (DicomStudyStatus)status.Value);

                return studies.OrderByDescending(s => s.StudyDate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting studies with filters");
                throw;
            }
        }

        public async Task<IEnumerable<DicomStudy>> GetStudiesByPatientIdAsync(
            string patientId,
            string? modality = null,
            StudyStatus? status = null)
        {
            try
            {
                var studies = await _dicomStudyRepository.GetByPatientIdAsync(Guid.Parse(patientId));

                if (!string.IsNullOrEmpty(modality) && Enum.TryParse<DicomModality>(modality, true, out var modalityEnum))
                    studies = studies.Where(s => s.Modality == modalityEnum);

                if (status.HasValue)
                    studies = studies.Where(s => s.Status == (DicomStudyStatus)status.Value);

                return studies.OrderByDescending(s => s.StudyDate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting studies for patient {PatientId}", patientId);
                throw;
            }
        }

        async Task<DicomStudyMetadata> IDicomService.ExtractDicomMetadataAsync(Stream dicomStream)
        {
            try
            {
                var dataset = await DicomFile.OpenAsync(dicomStream);
                var metadata = new DicomStudyMetadata
                {
                    StudyInstanceUid = dataset.Dataset.GetString(DicomTag.StudyInstanceUID),
                    PatientId = dataset.Dataset.GetString(DicomTag.PatientID),
                    PatientName = dataset.Dataset.GetString(DicomTag.PatientName),
                    PatientBirthDate = dataset.Dataset.GetString(DicomTag.PatientBirthDate),
                    PatientSex = dataset.Dataset.GetString(DicomTag.PatientSex),
                    StudyDate = dataset.Dataset.GetDateTime(DicomTag.StudyDate) ?? DateTime.UtcNow,
                    StudyTime = dataset.Dataset.GetString(DicomTag.StudyTime),
                    StudyDescription = dataset.Dataset.GetString(DicomTag.StudyDescription),
                    Modality = dataset.Dataset.GetString(DicomTag.Modality),
                    AccessionNumber = dataset.Dataset.GetString(DicomTag.AccessionNumber),
                    ReferringPhysicianName = dataset.Dataset.GetString(DicomTag.ReferringPhysicianName),
                    InstitutionName = dataset.Dataset.GetString(DicomTag.InstitutionName),
                    StudyId = dataset.Dataset.GetString(DicomTag.StudyID),
                    PerformedProcedureStepStartDate = dataset.Dataset.GetString(DicomTag.PerformedProcedureStepStartDate),
                    PerformedProcedureStepStartTime = dataset.Dataset.GetString(DicomTag.PerformedProcedureStepStartTime),
                    RequestedProcedureDescription = dataset.Dataset.GetString(DicomTag.RequestedProcedureDescription),
                    RequestedProcedureId = dataset.Dataset.GetString(DicomTag.RequestedProcedureID),
                    ScheduledProcedureStepId = dataset.Dataset.GetString(DicomTag.ScheduledProcedureStepID),
                    DicomTags = dataset.Dataset.ToDictionary(tag => tag.Tag.ToString(), tag => tag.ToString())
                };
                return metadata;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting DICOM metadata from stream");
                throw;
            }
        }

        async Task<OhifStudyMetadata> IDicomService.ExtractOhifMetadataAsync(Stream dicomStream)
        {
            try
            {
                var dataset = await DicomFile.OpenAsync(dicomStream);
                var metadata = new OhifStudyMetadata
                {
                    StudyInstanceUid = dataset.Dataset.GetString(DicomTag.StudyInstanceUID),
                    StudyDescription = dataset.Dataset.GetString(DicomTag.StudyDescription),
                    StudyDate = dataset.Dataset.GetDateTime(DicomTag.StudyDate) ?? DateTime.UtcNow,
                    PatientId = dataset.Dataset.GetString(DicomTag.PatientID),
                    PatientName = dataset.Dataset.GetString(DicomTag.PatientName),
                    Series = new List<OhifSeriesMetadata>
                    {
                        new OhifSeriesMetadata
                        {
                            SeriesInstanceUid = dataset.Dataset.GetString(DicomTag.SeriesInstanceUID),
                            SeriesDescription = dataset.Dataset.GetString(DicomTag.SeriesDescription),
                            Modality = dataset.Dataset.GetString(DicomTag.Modality),
                            Instances = new List<OhifInstanceMetadata>
                            {
                                new OhifInstanceMetadata
                                {
                                    SopInstanceUid = dataset.Dataset.GetString(DicomTag.SOPInstanceUID),
                                    InstanceNumber = dataset.Dataset.GetString(DicomTag.InstanceNumber),
                                    Rows = dataset.Dataset.GetSingleValue<int>(DicomTag.Rows),
                                    Columns = dataset.Dataset.GetSingleValue<int>(DicomTag.Columns),
                                    PhotometricInterpretation = dataset.Dataset.GetString(DicomTag.PhotometricInterpretation)
                                }
                            }
                        }
                    }
                };
                return metadata;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting OHIF metadata from stream");
                throw;
            }
        }

        async Task<OhifStudyConfiguration> IDicomService.GetOhifStudyConfigurationAsync(string studyInstanceUid)
        {
            try
            {
                var study = await GetStudyByUidAsync(studyInstanceUid);
                if (study == null)
                    throw new KeyNotFoundException($"Study with UID {studyInstanceUid} not found");

                return await ((IDicomService)this).GenerateOhifStudyConfiguration(study);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting OHIF configuration for study {StudyInstanceUid}", studyInstanceUid);
                throw;
            }
        }

        async Task<OhifStudyConfiguration> IDicomService.GenerateOhifStudyConfiguration(DicomStudy study)
        {
            try
            {
                var wadoBaseUrl = _configuration["Orthanc:WadoBaseUrl"];
                var qidoBaseUrl = _configuration["Orthanc:QidoBaseUrl"];
                var wadoRsBaseUrl = _configuration["Orthanc:WadoRsBaseUrl"];

                if (string.IsNullOrEmpty(wadoBaseUrl))
                    throw new InvalidOperationException("WADO base URL not configured");

                var config = new OhifStudyConfiguration
                {
                    StudyInstanceUid = study.StudyInstanceUid,
                    StudyDescription = study.StudyDescription ?? string.Empty,
                    StudyDate = study.StudyDate,
                    PatientName = study.Patient?.Name ?? string.Empty,
                    PatientId = study.PatientId.ToString(),
                    Modality = study.Modality.ToString(),
                    AccessionNumber = study.AccessionNumber ?? string.Empty,
                    WadoRsRoot = wadoRsBaseUrl ?? string.Empty,
                    QidoRsRoot = qidoBaseUrl ?? string.Empty,
                    WadoRoot = wadoBaseUrl ?? string.Empty,
                    Series = study.Metadata?.Series?.Select(s => new OhifSeries
                    {
                        SeriesInstanceUid = s.SeriesInstanceUid,
                        SeriesDescription = s.SeriesDescription ?? string.Empty,
                        Modality = s.Modality,
                        SeriesNumber = s.SeriesNumber ?? string.Empty,
                        WadoUri = $"{wadoBaseUrl}/studies/{study.StudyInstanceUid}/series/{s.SeriesInstanceUid}",
                        Instances = s.Instances?.Select(i => new OhifInstance
                        {
                            SopInstanceUid = i.SopInstanceUid,
                            InstanceNumber = i.InstanceNumber ?? string.Empty,
                            Rows = i.Rows.ToString(),
                            Columns = i.Columns.ToString(),
                            WadoUri = $"{wadoBaseUrl}/studies/{study.StudyInstanceUid}/series/{s.SeriesInstanceUid}/instances/{i.SopInstanceUid}",
                            FrameIndex = i.FrameIndex?.ToString() ?? string.Empty,
                            InstanceMetadata = new Dictionary<string, object>
                            {
                                { "photometricInterpretation", i.PhotometricInterpretation ?? string.Empty }
                            }
                        }).ToList() ?? new List<OhifInstance>()
                    }).ToList() ?? new List<OhifSeries>()
                };
                return config;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating OHIF configuration for study {StudyInstanceUid}", study.StudyInstanceUid);
                throw;
            }
        }
    }
}
