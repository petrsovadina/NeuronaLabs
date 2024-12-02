using HotChocolate;
using HotChocolate.Types;
using HotChocolate.Data;
using NeuronaLabs.Models;
using NeuronaLabs.Services.Interfaces;
using System.Threading.Tasks;

namespace NeuronaLabs.GraphQL.Queries
{
    [ExtendObjectType(typeof(Query))]
    public class DicomStudyQueries
    {
        private readonly IDicomStudyService _dicomStudyService;

        public DicomStudyQueries(IDicomStudyService dicomStudyService)
        {
            _dicomStudyService = dicomStudyService;
        }

        [GraphQLName("dicomStudy")]
        [UseFirstOrDefault]
        public async Task<DicomStudy?> GetDicomStudyByIdAsync(int id)
        {
            return await _dicomStudyService.GetDicomStudyByIdAsync(id);
        }

        [GraphQLName("dicomStudyByUid")]
        [UseFirstOrDefault]
        public async Task<DicomStudy?> GetDicomStudyByUidAsync(string studyInstanceUid)
        {
            return await _dicomStudyService.GetDicomStudyByStudyInstanceUidAsync(studyInstanceUid);
        }

        [GraphQLName("dicomStudies")]
        [UseFiltering]
        [UseSorting]
        public async Task<IEnumerable<DicomStudy>> GetDicomStudiesAsync(int? patientId = null)
        {
            if (patientId.HasValue)
            {
                return await _dicomStudyService.GetDicomStudiesByPatientIdAsync(patientId.Value);
            }
            return await _dicomStudyService.GetAllDicomStudiesAsync();
        }

        [GraphQLName("ohifViewerUrl")]
        public async Task<string> GetOhifViewerUrlAsync(int studyId)
        {
            return await _dicomStudyService.GetOhifViewerUrlAsync(studyId);
        }
    }
}
