using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public interface IPatientService
    {
        Task<Patient?> GetPatientByIdAsync(int id);
        Task<IEnumerable<Patient>> GetAllPatientsAsync();
        Task<Patient> CreatePatientAsync(Patient patient);
        Task<Patient> UpdatePatientAsync(Patient patient);
        Task DeletePatientAsync(int id);
    }
}
