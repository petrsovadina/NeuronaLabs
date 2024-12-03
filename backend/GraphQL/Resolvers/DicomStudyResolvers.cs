using HotChocolate;
using HotChocolate.Types;
using NeuronaLabs.Models;
using NeuronaLabs.Models.Ohif;
using NeuronaLabs.Services.Interfaces;
using System.Threading.Tasks;

namespace NeuronaLabs.GraphQL.Resolvers
{
    [ExtendObjectType("Query")]
    public class DicomStudyResolvers
    {
        private readonly IDicomService _dicomService;

        public DicomStudyResolvers(IDicomService dicomService)
        {
            _dicomService = dicomService;
        }

        public async Task<DicomStudy> GetDicomStudyById(string id)
        {
            return await _dicomService.GetStudyByIdAsync(id);
        }

        public async Task<IEnumerable<DicomStudy>> GetDicomStudiesByPatientId(string patientId)
        {
            return await _dicomService.GetStudiesByPatientIdAsync(patientId);
        }

        public async Task<OhifStudyConfiguration> GetOhifStudyConfiguration(string studyInstanceUid)
        {
            return await _dicomService.GetOhifStudyConfigurationAsync(studyInstanceUid);
        }
    }
}
