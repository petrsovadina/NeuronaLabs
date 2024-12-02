using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NeuronaLabs.Data;
using NeuronaLabs.Models;
using NeuronaLabs.Services.Interfaces;

namespace NeuronaLabs.Services.Implementations;

public class DiagnosisService : IDiagnosisService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DiagnosisService> _logger;

    public DiagnosisService(
        ApplicationDbContext context, 
        ILogger<DiagnosisService> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Diagnosis?> CreateDiagnosisAsync(Diagnosis? diagnosis)
    {
        if (diagnosis == null)
        {
            _logger.LogWarning("Attempted to create null diagnosis");
            return null;
        }

        try 
        {
            diagnosis.CreatedAt = DateTime.UtcNow;
            diagnosis.UpdatedAt = DateTime.UtcNow;

            _context.Diagnoses.Add(diagnosis);
            await _context.SaveChangesAsync();
            return diagnosis;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating diagnosis");
            throw;
        }
    }

    public async Task<Diagnosis?> UpdateDiagnosisAsync(Guid? id, Diagnosis? diagnosis)
    {
        if (!id.HasValue || diagnosis == null)
        {
            _logger.LogWarning("Attempted to update diagnosis with null ID or diagnosis");
            return null;
        }

        try 
        {
            var existingDiagnosis = await GetDiagnosisByIdAsync(id);
            if (existingDiagnosis == null)
            {
                _logger.LogWarning($"Diagnosis with ID {id} not found");
                return null;
            }

            // Bezpečná aktualizace s nullability
            existingDiagnosis.DiagnosisText = diagnosis.DiagnosisText ?? existingDiagnosis.DiagnosisText;
            existingDiagnosis.DiagnosisType = diagnosis.DiagnosisType ?? existingDiagnosis.DiagnosisType;
            existingDiagnosis.DiagnosisDate = diagnosis.DiagnosisDate ?? existingDiagnosis.DiagnosisDate;
            existingDiagnosis.Severity = diagnosis.Severity ?? existingDiagnosis.Severity;
            existingDiagnosis.Notes = diagnosis.Notes ?? existingDiagnosis.Notes;
            existingDiagnosis.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingDiagnosis;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating diagnosis with ID {id}");
            throw;
        }
    }

    public async Task<bool> DeleteDiagnosisAsync(Guid? id)
    {
        if (!id.HasValue)
        {
            _logger.LogWarning("Attempted to delete diagnosis with null ID");
            return false;
        }

        try 
        {
            var diagnosis = await GetDiagnosisByIdAsync(id);
            if (diagnosis == null)
            {
                _logger.LogWarning($"Diagnosis with ID {id} not found for deletion");
                return false;
            }

            _context.Diagnoses.Remove(diagnosis);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting diagnosis with ID {id}");
            throw;
        }
    }

    public async Task<Diagnosis?> GetDiagnosisByIdAsync(Guid? id)
    {
        if (!id.HasValue)
        {
            _logger.LogWarning("Attempted to retrieve diagnosis with null ID");
            return null;
        }

        try 
        {
            return await _context.Diagnoses
                .Include(d => d.Patient)
                .FirstOrDefaultAsync(d => d.Id == id.Value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving diagnosis with ID {id}");
            throw;
        }
    }

    public async Task<IEnumerable<Diagnosis>?> GetDiagnosesByPatientIdAsync(Guid? patientId)
    {
        if (!patientId.HasValue)
        {
            _logger.LogWarning("Attempted to retrieve diagnoses with null patient ID");
            return null;
        }

        try 
        {
            return await _context.Diagnoses
                .Include(d => d.Patient)
                .Where(d => d.PatientId == patientId.Value)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving diagnoses for patient with ID {patientId}");
            throw;
        }
    }
}
