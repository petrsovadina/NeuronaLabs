using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;
using System.Linq.Dynamic.Core;

namespace NeuronaLabs.Services.Implementation;

public class PatientService : IPatientService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PatientService> _logger;

    public PatientService(
        ApplicationDbContext context, 
        ILogger<PatientService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Patient> CreatePatientAsync(Patient patient)
    {
        try
        {
            patient.Id = Guid.NewGuid();
            patient.CreatedAt = DateTime.UtcNow;
            patient.UpdatedAt = DateTime.UtcNow;

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Vytvořen nový pacient: {patient.Id}");
            return patient;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při vytváření pacienta: {ex.Message}");
            throw;
        }
    }

    public async Task<Patient> UpdatePatientAsync(Guid id, Patient patient)
    {
        try
        {
            var existingPatient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingPatient == null)
            {
                throw new KeyNotFoundException($"Pacient s ID {id} nebyl nalezen.");
            }

            // Aktualizace pouze poskytnutých polí
            existingPatient.FirstName = patient.FirstName ?? existingPatient.FirstName;
            existingPatient.LastName = patient.LastName ?? existingPatient.LastName;
            existingPatient.DateOfBirth = patient.DateOfBirth != default ? patient.DateOfBirth : existingPatient.DateOfBirth;
            existingPatient.Gender = patient.Gender ?? existingPatient.Gender;
            existingPatient.ContactEmail = patient.ContactEmail ?? existingPatient.ContactEmail;
            existingPatient.PhoneNumber = patient.PhoneNumber ?? existingPatient.PhoneNumber;
            existingPatient.Address = patient.Address ?? existingPatient.Address;
            existingPatient.BloodType = patient.BloodType ?? existingPatient.BloodType;

            existingPatient.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Aktualizován pacient: {id}");
            return existingPatient;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při aktualizaci pacienta {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeletePatientAsync(Guid id)
    {
        try
        {
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null)
            {
                throw new KeyNotFoundException($"Pacient s ID {id} nebyl nalezen.");
            }

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Smazán pacient: {id}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při mazání pacienta {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<Patient?> GetPatientByIdAsync(Guid id)
    {
        try
        {
            return await _context.Patients
                .Include(p => p.Diagnoses)
                .Include(p => p.DicomStudies)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při načítání pacienta {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<IEnumerable<Patient>> SearchPatientsAsync(string? searchTerm = null)
    {
        try
        {
            IQueryable<Patient> query = _context.Patients;

            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p => 
                    p.FirstName.ToLower().Contains(searchTerm) ||
                    p.LastName.ToLower().Contains(searchTerm) ||
                    p.ContactEmail.ToLower().Contains(searchTerm)
                );
            }

            return await query
                .OrderBy(p => p.LastName)
                .Take(100)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při vyhledávání pacientů: {ex.Message}");
            throw;
        }
    }

    public async Task<int> GetPatientsCountAsync()
    {
        try
        {
            return await _context.Patients.CountAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při počítání pacientů: {ex.Message}");
            throw;
        }
    }
}
