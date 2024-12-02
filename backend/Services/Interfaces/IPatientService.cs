using NeuronaLabs.Models;
using System.Threading.Tasks;

namespace NeuronaLabs.Services.Interfaces
{
    public interface IPatientService
    {
        /// <summary>
        /// Načte pacienta podle jeho ID
        /// </summary>
        /// <param name="id">Identifikátor pacienta</param>
        /// <returns>Pacient nebo null, pokud nebyl nalezen</returns>
        Task<Patient?> GetPatientByIdAsync(int? id);

        /// <summary>
        /// Vrátí seznam všech pacientů
        /// </summary>
        /// <returns>Kolekce pacientů</returns>
        Task<IEnumerable<Patient>> GetAllPatientsAsync();

        /// <summary>
        /// Vyhledá pacienty podle zadaného hledaného termínu
        /// </summary>
        /// <param name="searchTerm">Hledaný výraz</param>
        /// <returns>Kolekce nalezených pacientů</returns>
        Task<IEnumerable<Patient>> SearchPatientsAsync(string? searchTerm = null);

        /// <summary>
        /// Vytvoří nového pacienta
        /// </summary>
        /// <param name="patient">Data pacienta</param>
        /// <returns>Vytvořený pacient nebo null při chybě</returns>
        Task<Patient?> CreatePatientAsync(Patient? patient);

        /// <summary>
        /// Aktualizuje údaje pacienta
        /// </summary>
        /// <param name="id">ID pacienta k aktualizaci</param>
        /// <param name="patient">Nové údaje pacienta</param>
        /// <returns>Aktualizovaný pacient nebo null při chybě</returns>
        Task<Patient?> UpdatePatientAsync(int? id, Patient? patient);

        /// <summary>
        /// Smaže pacienta podle ID
        /// </summary>
        /// <param name="id">ID pacienta ke smazání</param>
        /// <returns>True, pokud byl pacient úspěšně smazán, jinak false</returns>
        Task<bool> DeletePatientAsync(int? id);
    }
}
