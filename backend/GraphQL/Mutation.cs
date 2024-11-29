using System;
using System.Threading.Tasks;
using HotChocolate;
using NeuronaLabs.Models;
using NeuronaLabs.Services;

namespace NeuronaLabs.GraphQL
{
    public class Mutation
    {
        private readonly IPatientService _patientService;
        private readonly IDiagnosticDataService _diagnosticDataService;
        private readonly IDicomStudyService _dicomStudyService;

        public Mutation(
            IPatientService patientService,
            IDiagnosticDataService diagnosticDataService,
            IDicomStudyService dicomStudyService)
        {
            _patientService = patientService;
            _diagnosticDataService = diagnosticDataService;
            _dicomStudyService = dicomStudyService;
        }

        public async Task<Patient> AddPatient(Patient patient)
        {
            ValidatePatient(patient);
            return await _patientService.CreatePatientAsync(patient);
        }

        public async Task<Patient> UpdatePatient(Patient patient)
        {
            ValidatePatient(patient);
            var existingPatient = await _patientService.GetPatientByIdAsync(patient.Id);
            if (existingPatient == null)
                throw new ArgumentException($"Patient with ID {patient.Id} not found");
                
            return await _patientService.UpdatePatientAsync(patient);
        }

        public async Task<bool> DeletePatient(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
                throw new ArgumentException($"Patient with ID {id} not found");

            await _patientService.DeletePatientAsync(id);
            return true;
        }

        public async Task<DiagnosticData> AddDiagnosticData(DiagnosticData diagnosticData)
        {
            ValidateDiagnosticData(diagnosticData);
            var patient = await _patientService.GetPatientByIdAsync(diagnosticData.PatientId);
            if (patient == null)
                throw new ArgumentException($"Patient with ID {diagnosticData.PatientId} not found");

            return await _diagnosticDataService.CreateDiagnosticDataAsync(diagnosticData);
        }

        public async Task<DiagnosticData> UpdateDiagnosticData(DiagnosticData diagnosticData)
        {
            ValidateDiagnosticData(diagnosticData);
            var existingData = await _diagnosticDataService.GetDiagnosticDataByIdAsync(diagnosticData.Id);
            if (existingData == null)
                throw new ArgumentException($"DiagnosticData with ID {diagnosticData.Id} not found");

            return await _diagnosticDataService.UpdateDiagnosticDataAsync(diagnosticData);
        }

        public async Task<bool> DeleteDiagnosticData(int id)
        {
            var diagnosticData = await _diagnosticDataService.GetDiagnosticDataByIdAsync(id);
            if (diagnosticData == null)
                throw new ArgumentException($"DiagnosticData with ID {id} not found");

            await _diagnosticDataService.DeleteDiagnosticDataAsync(id);
            return true;
        }

        public async Task<DicomStudy> AddDicomStudy(DicomStudy study)
        {
            ValidateDicomStudy(study);
            var patient = await _patientService.GetPatientByIdAsync(study.PatientId);
            if (patient == null)
                throw new ArgumentException($"Patient with ID {study.PatientId} not found");

            return await _dicomStudyService.CreateDicomStudyAsync(study);
        }

        public async Task<DicomStudy> UpdateDicomStudy(DicomStudy study)
        {
            ValidateDicomStudy(study);
            var existingStudy = await _dicomStudyService.GetDicomStudyByIdAsync(study.Id);
            if (existingStudy == null)
                throw new ArgumentException($"DicomStudy with ID {study.Id} not found");

            return await _dicomStudyService.UpdateDicomStudyAsync(study);
        }

        public async Task<bool> DeleteDicomStudy(string studyInstanceUid)
        {
            var study = await _dicomStudyService.GetDicomStudyByStudyInstanceUidAsync(studyInstanceUid);
            if (study == null)
                throw new ArgumentException($"DicomStudy with StudyInstanceUid {studyInstanceUid} not found");

            await _dicomStudyService.DeleteDicomStudyAsync(studyInstanceUid);
            return true;
        }

        private void ValidatePatient(Patient patient)
        {
            if (string.IsNullOrWhiteSpace(patient.Name))
                throw new ArgumentException("Patient name is required");
            if (string.IsNullOrWhiteSpace(patient.Gender))
                throw new ArgumentException("Patient gender is required");
        }

        private void ValidateDiagnosticData(DiagnosticData diagnosticData)
        {
            if (diagnosticData.PatientId <= 0)
                throw new ArgumentException("Valid PatientId is required");
            if (string.IsNullOrWhiteSpace(diagnosticData.DiagnosisType))
                throw new ArgumentException("DiagnosisType is required");
        }

        private void ValidateDicomStudy(DicomStudy study)
        {
            if (study.PatientId <= 0)
                throw new ArgumentException("Valid PatientId is required");
            if (string.IsNullOrWhiteSpace(study.StudyInstanceUid))
                throw new ArgumentException("StudyInstanceUid is required");
            if (string.IsNullOrWhiteSpace(study.Modality))
                throw new ArgumentException("Modality is required");
        }
    }
}
