using HotChocolate;
using HotChocolate.Types;
using HotChocolate.Data;
using HotChocolate.AspNetCore.Authorization;
using NeuronaLabs.Models;
using NeuronaLabs.Models.Ohif;
using NeuronaLabs.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuronaLabs.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public class DicomQueries
    {
        private readonly IDicomService _dicomService;

        public DicomQueries(IDicomService dicomService)
        {
            _dicomService = dicomService;
        }

        [Authorize]
        [GraphQLName("dicomStudies")]
        [HotChocolate.Data.UseFiltering]
        [HotChocolate.Data.UseSorting]
        public async Task<IEnumerable<DicomStudy>> GetDicomStudies(
            string? patientId = null,
            string? modality = null,
            string? studyDate = null,
            StudyStatus? status = null)
        {
            return await _dicomService.GetStudiesAsync(patientId, modality, studyDate, status);
        }

        [Authorize]
        [GraphQLName("dicomStudy")]
        public async Task<DicomStudy?> GetDicomStudy(string studyInstanceUid)
        {
            return await _dicomService.GetStudyByUidAsync(studyInstanceUid);
        }

        [Authorize]
        [GraphQLName("dicomStudyMetadata")]
        public async Task<DicomStudyMetadata?> GetDicomStudyMetadata(string studyInstanceUid)
        {
            return await _dicomService.GetStudyMetadataAsync(studyInstanceUid);
        }

        [Authorize]
        [GraphQLName("ohifStudyConfiguration")]
        public async Task<OhifStudyConfiguration?> GetOhifStudyConfiguration(string studyInstanceUid)
        {
            return await _dicomService.GetOhifStudyConfigurationAsync(studyInstanceUid);
        }

        [Authorize]
        [GraphQLName("patientDicomStudies")]
        [HotChocolate.Data.UseFiltering]
        [HotChocolate.Data.UseSorting]
        public async Task<IEnumerable<DicomStudy>> GetPatientDicomStudies(
            string patientId,
            string? modality = null,
            StudyStatus? status = null)
        {
            return await _dicomService.GetStudiesByPatientIdAsync(patientId, modality, status);
        }
    }
}
