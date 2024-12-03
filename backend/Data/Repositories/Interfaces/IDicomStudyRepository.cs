using NeuronaLabs.Models;

namespace NeuronaLabs.Data.Repositories.Interfaces;

public interface IDicomStudyRepository
{
    Task<DicomStudy> GetByIdAsync(Guid id);
    Task<IEnumerable<DicomStudy>> GetAllAsync();
    Task<IEnumerable<DicomStudy>> GetByPatientIdAsync(Guid patientId);
    Task<DicomStudy> AddAsync(DicomStudy study);
    Task<DicomStudy> UpdateAsync(DicomStudy study);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
