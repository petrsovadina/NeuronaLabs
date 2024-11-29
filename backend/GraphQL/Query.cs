using System.Collections.Generic;
using System.Threading.Tasks;
using HotChocolate;
using NeuronaLabs.Models;
using NeuronaLabs.Services;

namespace NeuronaLabs.GraphQL
{
    public class Query
    {
        private readonly IPatientService _patientService;
        private readonly IDiagnosticDataService _diagnosticDataService;
        private readonly IDicomStudyService _dicomStudyService;

        public Query(
            IPatientService patientService,
            IDiagnosticDataService diagnosticDataService,
            IDicomStudyService dicomStudyService)
        {
            _patientService = patientService;
            _diagnosticDataService = diagnosticDataService;
            _dicomStudyService = dicomStudyService;
        }

        public async Task<IEnumerable<Patient>> GetPatients()
        {
            return await _patientService.GetAllPatientsAsync();
        }

        public async Task<Patient?> GetPatient(int id)
        {
            return await _patientService.GetPatientByIdAsync(id);
        }

        public async Task<IEnumerable<DiagnosticData>> GetDiagnosticDataForPatient(int patientId)
        {
            return await _diagnosticDataService.GetDiagnosticDataByPatientIdAsync(patientId);
        }

        public async Task<DiagnosticData?> GetDiagnosticData(int id)
        {
            return await _diagnosticDataService.GetDiagnosticDataByIdAsync(id);
        }

        public async Task<IEnumerable<DicomStudy>> GetDicomStudiesForPatient(int patientId)
        {
            return await _dicomStudyService.GetDicomStudiesByPatientIdAsync(patientId);
        }

        public async Task<DicomStudy?> GetDicomStudy(int id)
        {
            return await _dicomStudyService.GetDicomStudyByIdAsync(id);
        }

        public async Task<string> GetDicomStudyMetadata(int studyId)
        {
            return await _dicomStudyService.GetStudyMetadataAsync(studyId);
        }

        public async Task<string> GetOhifViewerUrl(int studyId)
        {
            return await _dicomStudyService.GetOhifViewerUrlAsync(studyId);
        }

        public async Task<IEnumerable<DicomStudy>> SearchDicomStudies(string? patientName = null, string? modality = null, string? studyDate = null)
        {
            var studies = await _dicomStudyService.GetAllDicomStudiesAsync();
            
            if (!string.IsNullOrEmpty(patientName))
            {
                studies = studies.Where(s => s.Patient?.Name?.Contains(patientName, System.StringComparison.OrdinalIgnoreCase) == true);
            }
            
            if (!string.IsNullOrEmpty(modality))
            {
                studies = studies.Where(s => s.Modality?.Equals(modality, System.StringComparison.OrdinalIgnoreCase) == true);
            }
            
            if (!string.IsNullOrEmpty(studyDate))
            {
                if (System.DateTime.TryParse(studyDate, out var date))
                {
                    studies = studies.Where(s => s.StudyDate.Date == date.Date);
                }
            }
            
            return studies;
        }

        public async Task<IEnumerable<Patient>> SearchPatients(string? name = null, string? diagnosis = null)
        {
            var patients = await _patientService.GetAllPatientsAsync();
            
            if (!string.IsNullOrEmpty(name))
            {
                patients = patients.Where(p => p.Name.Contains(name, System.StringComparison.OrdinalIgnoreCase));
            }
            
            if (!string.IsNullOrEmpty(diagnosis))
            {
                patients = patients.Where(p => p.LastDiagnosis?.Contains(diagnosis, System.StringComparison.OrdinalIgnoreCase) == true);
            }
            
            return patients;
        }

        // Další metody pro DiagnosticData a DicomStudy byly implementovány podobně
    }
}
