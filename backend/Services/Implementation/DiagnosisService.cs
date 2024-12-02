using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;

namespace NeuronaLabs.Services.Implementation;

public class DiagnosisService : IDiagnosisService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DiagnosisService> _logger;

    public DiagnosisService(
        ApplicationDbContext context, 
        ILogger<DiagnosisService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Diagnosis> CreateDiagnosisAsync(Diagnosis diagnosis)
    {
        try
        {
            // Ověření, zda pacient existuje
            var patient = await _context.Patients.FindAsync(diagnosis.PatientId);
            if (patient == null)
            {
                throw new KeyNotFoundException($"Pacient s ID {diagnosis.PatientId} nebyl nalezen.");
            }

            diagnosis.Id = Guid.NewGuid();
            diagnosis.CreatedAt = DateTime.UtcNow;
            diagnosis.UpdatedAt = DateTime.UtcNow;

            _context.Diagnoses.Add(diagnosis);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Vytvořena nová diagnóza: {diagnosis.Id}");
            return diagnosis;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při vytváření diagnózy: {ex.Message}");
            throw;
        }
    }

    public async Task<Diagnosis> UpdateDiagnosisAsync(Guid id, Diagnosis diagnosis)
    {
        try
        {
            var existingDiagnosis = await _context.Diagnoses
                .FirstOrDefaultAsync(d => d.Id == id);

            if (existingDiagnosis == null)
            {
                throw new KeyNotFoundException($"Diagnóza s ID {id} nebyla nalezena.");
            }

            // Aktualizace pouze poskytnutých polí
            existingDiagnosis.DiagnosisCode = diagnosis.DiagnosisCode ?? existingDiagnosis.DiagnosisCode;
            existingDiagnosis.Description = diagnosis.Description ?? existingDiagnosis.Description;
            existingDiagnosis.DiagnosisDate = diagnosis.DiagnosisDate != default ? diagnosis.DiagnosisDate : existingDiagnosis.DiagnosisDate;
            existingDiagnosis.DiagnosedBy = diagnosis.DiagnosedBy ?? existingDiagnosis.DiagnosedBy;

            existingDiagnosis.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Aktualizována diagnóza: {id}");
            return existingDiagnosis;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při aktualizaci diagnózy {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeleteDiagnosisAsync(Guid id)
    {
        try
        {
            var diagnosis = await _context.Diagnoses
                .FirstOrDefaultAsync(d => d.Id == id);

            if (diagnosis == null)
            {
                throw new KeyNotFoundException($"Diagnóza s ID {id} nebyla nalezena.");
            }

            _context.Diagnoses.Remove(diagnosis);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Smazána diagnóza: {id}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při mazání diagnózy {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<Diagnosis?> GetDiagnosisByIdAsync(Guid id)
    {
        try
        {
            return await _context.Diagnoses
                .Include(d => d.Patient)
                .FirstOrDefaultAsync(d => d.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při načítání diagnózy {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<IEnumerable<Diagnosis>> GetDiagnosesByPatientIdAsync(Guid patientId)
    {
        try
        {
            // Ověření, zda pacient existuje
            var patient = await _context.Patients.FindAsync(patientId);
            if (patient == null)
            {
                throw new KeyNotFoundException($"Pacient s ID {patientId} nebyl nalezen.");
            }

            return await _context.Diagnoses
                .Where(d => d.PatientId == patientId)
                .OrderByDescending(d => d.DiagnosisDate)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při načítání diagnóz pro pacienta {patientId}: {ex.Message}");
            throw;
        }
    }
}
