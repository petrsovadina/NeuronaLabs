using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public interface IPatientService
    {
        /// <summary>
        /// Vytvoří nového pacienta
        /// </summary>
        /// <param name="patient">Data pacienta</param>
        /// <returns>Vytvořený pacient</returns>
        Task<Patient> CreatePatientAsync(Patient patient);

        /// <summary>
        /// Aktualizuje existujícího pacienta
        /// </summary>
        /// <param name="id">ID pacienta</param>
        /// <param name="patient">Nová data pacienta</param>
        /// <returns>Aktualizovaný pacient</returns>
        Task<Patient> UpdatePatientAsync(Guid id, Patient patient);

        /// <summary>
        /// Smaže pacienta podle ID
        /// </summary>
        /// <param name="id">ID pacienta</param>
        /// <returns>True pokud byl pacient smazán, jinak false</returns>
        Task<bool> DeletePatientAsync(Guid id);

        /// <summary>
        /// Načte pacienta podle ID
        /// </summary>
        /// <param name="id">ID pacienta</param>
        /// <returns>Pacient nebo null, pokud nebyl nalezen</returns>
        Task<Patient?> GetPatientByIdAsync(Guid id);

        /// <summary>
        /// Vyhledá pacienty podle zadaného výrazu
        /// </summary>
        /// <param name="searchTerm">Vyhledávaný výraz</param>
        /// <returns>Kolekce nalezených pacientů</returns>
        Task<IEnumerable<Patient>> SearchPatientsAsync(string? searchTerm = null);

        /// <summary>
        /// Vrátí celkový počet pacientů
        /// </summary>
        /// <returns>Počet pacientů</returns>
        Task<int> GetPatientsCountAsync();
    }
}
