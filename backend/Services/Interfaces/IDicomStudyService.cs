using NeuronaLabs.Models;
using System.Threading.Tasks;

namespace NeuronaLabs.Services.Interfaces
{
    public interface IDicomStudyService
    {
        Task<DicomStudy?> GetDicomStudyByIdAsync(int id);
        Task<DicomStudy?> GetDicomStudyByStudyInstanceUidAsync(string studyInstanceUid);
        Task<IEnumerable<DicomStudy>> GetAllDicomStudiesAsync();
        Task<IEnumerable<DicomStudy>> GetDicomStudiesByPatientIdAsync(int patientId);
        Task<DicomStudy> CreateDicomStudyAsync(DicomStudy dicomStudy);
        Task<DicomStudy> UpdateDicomStudyAsync(int id, DicomStudy dicomStudy);
        Task<bool> DeleteDicomStudyAsync(int id);
        Task<bool> DeleteDicomStudyAsync(string studyInstanceUid);
        Task<string> GetOhifViewerUrlAsync(int studyId);
        Task<string> GetOhifViewerUrlAsync(string studyInstanceUid);
        Task<object> GetStudyMetadataAsync(int studyId);
        Task<object> GetStudyMetadataAsync(string studyInstanceUid);
    }
}
