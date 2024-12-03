using NeuronaLabs.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuronaLabs.Services.Interfaces
{
    public interface IDicomStudyRepository
    {
        Task<DicomStudy> GetByIdAsync(string id);
        Task<IEnumerable<DicomStudy>> GetAllAsync();
        Task<IEnumerable<DicomStudy>> GetByPatientIdAsync(string patientId);
        Task<DicomStudy> CreateAsync(DicomStudy study);
        Task<DicomStudy> UpdateAsync(DicomStudy study);
        Task DeleteAsync(string id);
        Task<bool> ExistsAsync(string id);
    }
}
