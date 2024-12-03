using NeuronaLabs.Models;
using Supabase;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace NeuronaLabs.Services.Interfaces
{
    public interface ISupabaseService
    {
        Task<Client> GetSupabaseClientAsync();
        Task<bool> TestConnectionAsync();

        Task<IEnumerable<Patient>> GetPatientsAsync();
        Task<Patient> GetPatientAsync(string id);
        Task<Patient> CreatePatientAsync(Patient patient);
        Task<Patient> UpdatePatientAsync(string id, Patient patient);

        Task<IEnumerable<DicomStudy>> GetStudiesAsync(string? patientId = null);
        Task<DicomStudy> GetStudyAsync(string id);
        Task<DicomStudy> CreateStudyAsync(DicomStudy study);
        Task<DicomStudy> UpdateStudyAsync(string id, DicomStudy study);
        Task<DicomStudy> UpdateStudyStatusAsync(string id, string status);

        Task<Doctor> GetCurrentDoctorAsync();
        Task<Doctor> GetDoctorAsync(string id);
        Task<IEnumerable<Doctor>> GetDoctorsAsync();

        Task<Diagnosis> CreateDiagnosisAsync(Diagnosis diagnosis);
        Task<Diagnosis> UpdateDiagnosisAsync(string id, Diagnosis diagnosis);
        Task<IEnumerable<Diagnosis>> GetDiagnosesForStudyAsync(string studyId);

        Task<string> UploadDicomFileAsync(Stream fileStream, string fileName, string patientId, string studyId);
        Task<byte[]> DownloadDicomFileAsync(string filePath);
        Task DeleteDicomFileAsync(string filePath);

        Task<IEnumerable<AuditLog>> GetAuditLogsAsync(
            string? doctorId = null,
            string? entityType = null,
            string? entityId = null,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            int? limit = null);
    }
}
