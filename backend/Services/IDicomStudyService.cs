using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public interface IDicomStudyService
    {
        Task<IEnumerable<DicomStudy>> GetAllDicomStudiesAsync();
        Task<DicomStudy?> GetDicomStudyByIdAsync(int id);
        Task<DicomStudy?> GetDicomStudyByStudyInstanceUidAsync(string studyInstanceUid);
        Task<IEnumerable<DicomStudy>> GetDicomStudiesByPatientIdAsync(int patientId);
        Task<DicomStudy> CreateDicomStudyAsync(DicomStudy study);
        Task<DicomStudy> UpdateDicomStudyAsync(DicomStudy study);
        Task DeleteDicomStudyAsync(int id);
        Task DeleteDicomStudyAsync(string studyInstanceUid);
        Task<string> GetStudyMetadataAsync(int studyId);
        Task<string> GetOhifViewerUrlAsync(int studyId);
        Task<string> GetOhifViewerUrlAsync(string studyInstanceUid);
        Task<Dictionary<string, object>> GetStudyMetadataAsync(string studyInstanceUid);
    }
}
