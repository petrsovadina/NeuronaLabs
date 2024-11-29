using System.Collections.Generic;
using System.Threading.Tasks;
using HotChocolate;
using NeuronaLabs.Models;
using NeuronaLabs.Services;

namespace NeuronaLabs.GraphQL
{
    public class Query
    {
        public async Task<IEnumerable<Patient>> GetPatients([Service] PatientService patientService)
        {
            return await patientService.GetPatientsAsync();
        }

        public async Task<Patient> GetPatient(int id, [Service] PatientService patientService)
        {
            return await patientService.GetPatientAsync(id);
        }

        public async Task<IEnumerable<DiagnosticData>> GetDiagnosticDataForPatient(
            int patientId, 
            [Service] DiagnosticDataService diagnosticDataService)
        {
            return await diagnosticDataService.GetDiagnosticDataForPatientAsync(patientId);
        }

        public async Task<DiagnosticData> GetDiagnosticData(
            int id, 
            [Service] DiagnosticDataService diagnosticDataService)
        {
            return await diagnosticDataService.GetDiagnosticDataAsync(id);
        }

        public async Task<IEnumerable<DicomStudy>> GetDicomStudiesForPatient(
            int patientId, 
            [Service] DicomStudyService dicomStudyService)
        {
            return await dicomStudyService.GetDicomStudiesForPatientAsync(patientId);
        }

        public async Task<DicomStudy> GetDicomStudy(
            string studyInstanceUid, 
            [Service] DicomStudyService dicomStudyService)
        {
            return await dicomStudyService.GetDicomStudyAsync(studyInstanceUid);
        }

        public async Task<Dictionary<string, object>> GetDicomStudyMetadata(
            string studyInstanceUid,
            [Service] DicomStudyService dicomStudyService)
        {
            return await dicomStudyService.GetStudyMetadataAsync(studyInstanceUid);
        }

        public async Task<string> GetOhifViewerUrl(
            string studyInstanceUid,
            [Service] DicomStudyService dicomStudyService)
        {
            return await dicomStudyService.GetOhifViewerUrlAsync(studyInstanceUid);
        }

        // Další metody pro DiagnosticData a DicomStudy byly implementovány podobně
    }
}
