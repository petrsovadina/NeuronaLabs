using NeuronaLabs.Models;

namespace NeuronaLabs.Services;

public interface IDiagnosisService
{
    /// <summary>
    /// Vytvoří novou diagnózu
    /// </summary>
    /// <param name="diagnosis">Data diagnózy</param>
    /// <returns>Vytvořená diagnóza</returns>
    Task<Diagnosis> CreateDiagnosisAsync(Diagnosis diagnosis);

    /// <summary>
    /// Aktualizuje existující diagnózu
    /// </summary>
    /// <param name="id">Identifikátor diagnózy</param>
    /// <param name="diagnosis">Nová data diagnózy</param>
    /// <returns>Aktualizovaná diagnóza</returns>
    Task<Diagnosis> UpdateDiagnosisAsync(Guid id, Diagnosis diagnosis);

    /// <summary>
    /// Smaže diagnózu podle ID
    /// </summary>
    /// <param name="id">Identifikátor diagnózy</param>
    /// <returns>True, pokud byla diagnóza úspěšně smazána, jinak false</returns>
    Task<bool> DeleteDiagnosisAsync(Guid id);

    /// <summary>
    /// Načte diagnózu podle ID
    /// </summary>
    /// <param name="id">Identifikátor diagnózy</param>
    /// <returns>Diagnóza nebo null, pokud nebyla nalezena</returns>
    Task<Diagnosis?> GetDiagnosisByIdAsync(Guid id);

    /// <summary>
    /// Načte diagnózy pacienta podle jeho ID
    /// </summary>
    /// <param name="patientId">Identifikátor pacienta</param>
    /// <returns>Kolekce diagnóz pacienta</returns>
    Task<IEnumerable<Diagnosis>> GetDiagnosesByPatientIdAsync(Guid patientId);
}
