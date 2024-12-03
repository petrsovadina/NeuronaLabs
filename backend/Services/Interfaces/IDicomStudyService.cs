using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public interface IDicomStudyService
    {
        Task<DicomStudy> UploadDicomStudyAsync(DicomStudy dicomStudy);
        Task<DicomStudy> UpdateDicomStudyAsync(Guid id, DicomStudy dicomStudy);
        Task<bool> DeleteDicomStudyAsync(Guid id);
        Task<DicomStudy?> GetDicomStudyByIdAsync(Guid id);
        Task<DicomStudy?> GetStudyByIdAsync(Guid studyId);
        Task<DicomStudy?> GetDicomStudyByStudyInstanceUidAsync(string studyInstanceUid);
        Task<IEnumerable<DicomStudy>> GetDicomStudiesByPatientIdAsync(Guid patientId);
        Task<IEnumerable<DicomStudy>> GetAllDicomStudiesAsync();
        Task<DicomStudyMetadata?> GetStudyMetadataAsync(Guid studyId);
        Task<string?> GetOhifViewerUrlAsync(Guid studyId);
        Task<string> ProcessDicomFileAsync(string filePath);
    }
}
