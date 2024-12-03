using NeuronaLabs.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuronaLabs.Services.Interfaces
{
    public interface IStudyService
    {
        Task<IEnumerable<Study>> GetAllStudiesAsync();
        Task<Study> GetStudyByIdAsync(Guid id);
        Task<IEnumerable<Study>> GetStudiesByPatientIdAsync(Guid patientId);
        Task<Study> CreateStudyAsync(Study study);
        Task<Study> UpdateStudyAsync(Study study);
        Task DeleteStudyAsync(Guid id);
        Task<IEnumerable<Study>> SearchStudiesAsync(string searchTerm);
    }
}
