using NeuronaLabs.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuronaLabs.Repositories.Interfaces
{
    public interface IDicomStudyRepository
    {
        Task<IEnumerable<DicomStudy>> GetAllAsync();
        Task<DicomStudy> GetByIdAsync(Guid id);
        Task<DicomStudy> CreateAsync(DicomStudy study);
        Task<DicomStudy> UpdateAsync(DicomStudy study);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<DicomStudy>> GetByPatientIdAsync(Guid patientId);
    }
}
