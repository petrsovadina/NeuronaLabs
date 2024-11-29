using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public interface IDicomStudyService
    {
        Task<DicomStudy?> GetDicomStudyByIdAsync(int id);
        Task<DicomStudy?> GetDicomStudyByUidAsync(string studyInstanceUid);
        Task<IEnumerable<DicomStudy>> GetDicomStudiesByPatientIdAsync(int patientId);
        Task<DicomStudy> CreateDicomStudyAsync(DicomStudy dicomStudy);
        Task<DicomStudy> UpdateDicomStudyAsync(DicomStudy dicomStudy);
        Task DeleteDicomStudyAsync(int id);
    }
}
