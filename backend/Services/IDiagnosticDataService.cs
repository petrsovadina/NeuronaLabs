using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public interface IDiagnosticDataService
    {
        Task<DiagnosticData?> GetDiagnosticDataByIdAsync(int id);
        Task<IEnumerable<DiagnosticData>> GetDiagnosticDataByPatientIdAsync(int patientId);
        Task<DiagnosticData> CreateDiagnosticDataAsync(DiagnosticData diagnosticData);
        Task<DiagnosticData> UpdateDiagnosticDataAsync(DiagnosticData diagnosticData);
        Task DeleteDiagnosticDataAsync(int id);
    }
}
