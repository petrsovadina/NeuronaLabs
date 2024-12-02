using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;
using NeuronaLabs.Services.Interfaces;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace NeuronaLabs.Services.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PatientService> _logger;

        public PatientService(
            ApplicationDbContext context, 
            ILogger<PatientService> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Patient?> GetPatientByIdAsync(int? id)
        {
            if (!id.HasValue)
            {
                _logger.LogWarning("Attempted to retrieve patient with null ID");
                return null;
            }

            try 
            {
                return await _context.Patients
                    .Include(p => p.DicomStudies)
                    .FirstOrDefaultAsync(p => p.Id == id.Value);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving patient with ID {id}");
                throw;
            }
        }

        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            try 
            {
                return await _context.Patients
                    .Include(p => p.DicomStudies)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all patients");
                throw;
            }
        }

        public async Task<IEnumerable<Patient>> SearchPatientsAsync(string? searchTerm = null)
        {
            try 
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return await GetAllPatientsAsync();
                }

                searchTerm = searchTerm.ToLower().Trim();

                return await _context.Patients
                    .Include(p => p.DicomStudies)
                    .Where(p => 
                        p.FirstName.ToLower().Contains(searchTerm) ||
                        p.LastName.ToLower().Contains(searchTerm) ||
                        (p.Email != null && p.Email.ToLower().Contains(searchTerm)) ||
                        (p.PersonalId != null && p.PersonalId.ToLower().Contains(searchTerm)))
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error searching patients with term: {searchTerm}");
                throw;
            }
        }

        public async Task<Patient?> CreatePatientAsync(Patient? patient)
        {
            if (patient == null)
            {
                _logger.LogWarning("Attempted to create null patient");
                return null;
            }

            try 
            {
                patient.CreatedAt = DateTime.UtcNow;
                patient.UpdatedAt = DateTime.UtcNow;

                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();
                return patient;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating patient");
                throw;
            }
        }

        public async Task<Patient?> UpdatePatientAsync(int? id, Patient? patient)
        {
            if (!id.HasValue || patient == null)
            {
                _logger.LogWarning("Attempted to update patient with null ID or patient");
                return null;
            }

            try 
            {
                var existingPatient = await GetPatientByIdAsync(id);
                if (existingPatient == null)
                {
                    _logger.LogWarning($"Patient with ID {id} not found");
                    return null;
                }

                // Bezpečná aktualizace s nullability
                existingPatient.FirstName = patient.FirstName ?? existingPatient.FirstName;
                existingPatient.LastName = patient.LastName ?? existingPatient.LastName;
                existingPatient.Email = patient.Email ?? existingPatient.Email;
                existingPatient.PersonalId = patient.PersonalId ?? existingPatient.PersonalId;
                existingPatient.Phone = patient.Phone ?? existingPatient.Phone;
                existingPatient.Address = patient.Address ?? existingPatient.Address;
                existingPatient.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return existingPatient;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating patient with ID {id}");
                throw;
            }
        }

        public async Task<bool> DeletePatientAsync(int? id)
        {
            if (!id.HasValue)
            {
                _logger.LogWarning("Attempted to delete patient with null ID");
                return false;
            }

            try 
            {
                var patient = await GetPatientByIdAsync(id);
                if (patient == null)
                {
                    _logger.LogWarning($"Patient with ID {id} not found for deletion");
                    return false;
                }

                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting patient with ID {id}");
                throw;
            }
        }
    }
}
