using System.Threading.Tasks;
using HotChocolate;
using NeuronaLabs.Models;
using NeuronaLabs.Services;

namespace NeuronaLabs.GraphQL
{
    public class Mutation
    {
        public async Task<Patient> CreatePatient(
            Patient patient, 
            [Service] PatientService patientService)
        {
            return await patientService.CreatePatientAsync(patient);
        }

        public async Task<Patient> UpdatePatient(
            Patient patient, 
            [Service] PatientService patientService)
        {
            return await patientService.UpdatePatientAsync(patient);
        }

        public async Task<bool> DeletePatient(
            int id, 
            [Service] PatientService patientService)
        {
            return await patientService.DeletePatientAsync(id);
        }

        public async Task<DiagnosticData> CreateDiagnosticData(
            DiagnosticData diagnosticData,
            [Service] DiagnosticDataService diagnosticDataService)
        {
            return await diagnosticDataService.CreateDiagnosticDataAsync(diagnosticData);
        }

        public async Task<DiagnosticData> UpdateDiagnosticData(
            DiagnosticData diagnosticData,
            [Service] DiagnosticDataService diagnosticDataService)
        {
            return await diagnosticDataService.UpdateDiagnosticDataAsync(diagnosticData);
        }

        public async Task<bool> DeleteDiagnosticData(
            int id,
            [Service] DiagnosticDataService diagnosticDataService)
        {
            return await diagnosticDataService.DeleteDiagnosticDataAsync(id);
        }

        public async Task<DicomStudy> CreateDicomStudy(
            DicomStudy dicomStudy,
            [Service] DicomStudyService dicomStudyService)
        {
            return await dicomStudyService.CreateDicomStudyAsync(dicomStudy);
        }

        public async Task<DicomStudy> UpdateDicomStudy(
            DicomStudy dicomStudy,
            [Service] DicomStudyService dicomStudyService)
        {
            return await dicomStudyService.UpdateDicomStudyAsync(dicomStudy);
        }

        public async Task<bool> DeleteDicomStudy(
            string studyInstanceUid,
            [Service] DicomStudyService dicomStudyService)
        {
            return await dicomStudyService.DeleteDicomStudyAsync(studyInstanceUid);
        }
    }
}
