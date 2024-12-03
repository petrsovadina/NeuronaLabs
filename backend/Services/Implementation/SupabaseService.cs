using NeuronaLabs.Configuration;
using NeuronaLabs.Models;
using NeuronaLabs.Services.Interfaces;
using Supabase;
using Postgrest.Models;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using System;

namespace NeuronaLabs.Services.Implementation
{
    public class SupabaseService : ISupabaseService
    {
        private readonly SupabaseOptions _options;
        private readonly ILogger<SupabaseService> _logger;
        private Client? _supabaseClient;

        public SupabaseService(
            SupabaseOptions options, 
            ILogger<SupabaseService> logger)
        {
            _options = options;
            _logger = logger;
        }

        public async Task<Client> GetSupabaseClientAsync()
        {
            if (_supabaseClient == null)
            {
                _supabaseClient = SupabaseConfiguration.CreateSupabaseClient(_options);
                await _supabaseClient.InitializeAsync();
            }
            return _supabaseClient;
        }

        public async Task<bool> TestConnectionAsync()
        {
            try 
            {
                var client = await GetSupabaseClientAsync();
                // Zde můžete přidat specifický test připojení, např. dotaz na tabulku
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Chyba připojení k Supabase");
                return false;
            }
        }

        public async Task<IEnumerable<Patient>> GetPatientsAsync()
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var result = await client.From<Patient>().Get();
                return result.Models;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching patients");
                throw;
            }
        }

        public async Task<Patient> GetPatientAsync(string id)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var result = await client.From<Patient>()
                    .Where(p => p.Id == id)
                    .Single();
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching patient with ID {PatientId}", id);
                throw;
            }
        }

        public async Task<Patient> CreatePatientAsync(Patient patient)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.From<Patient>().Insert(patient);
                return response.Models.First();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating patient");
                throw;
            }
        }

        public async Task<Patient> UpdatePatientAsync(string id, Patient patient)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.From<Patient>()
                    .Where(p => p.Id == id)
                    .Update(patient);
                return response.Models.First();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating patient with ID {PatientId}", id);
                throw;
            }
        }

        public async Task<DicomStudy> GetStudyAsync(string id)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var result = await client.From<DicomStudy>()
                    .Where(s => s.Id == id)
                    .Single();
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching study with ID {StudyId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<DicomStudy>> GetStudiesAsync(string? patientId = null)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var query = client.From<DicomStudy>();
                
                if (!string.IsNullOrEmpty(patientId))
                {
                    query = query.Where(s => s.PatientId == patientId);
                }

                var response = await query
                    .Order(s => s.StudyDate, Postgrest.Constants.Ordering.Descending)
                    .Get();

                return response.Models;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching studies");
                throw;
            }
        }

        public async Task<DicomStudy> CreateStudyAsync(DicomStudy study)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.From<DicomStudy>().Insert(study);
                return response.Models.First();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating study");
                throw;
            }
        }

        public async Task<DicomStudy> UpdateStudyAsync(string id, DicomStudy study)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.From<DicomStudy>()
                    .Where(s => s.Id == id)
                    .Update(study);
                return response.Models.First();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating study with ID {StudyId}", id);
                throw;
            }
        }

        public async Task<DicomStudy> UpdateStudyStatusAsync(string id, string status)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.From<DicomStudy>()
                    .Where(s => s.Id == id)
                    .Update(new { Status = status });
                return response.Models.First();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating study status for ID {StudyId}", id);
                throw;
            }
        }

        public async Task<Doctor> GetCurrentDoctorAsync()
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var user = await client.Auth.GetUser();
                if (user == null) throw new UnauthorizedAccessException("No authenticated user found");

                var response = await client.From<Doctor>()
                    .Where(d => d.Id == user.Id)
                    .Single();

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching current doctor");
                throw;
            }
        }

        public async Task<Doctor> GetDoctorAsync(string id)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.From<Doctor>()
                    .Where(d => d.Id == id)
                    .Single();

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching doctor with ID {DoctorId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Doctor>> GetDoctorsAsync()
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.From<Doctor>()
                    .Order(d => d.LastName)
                    .Get();

                return response.Models;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching doctors");
                throw;
            }
        }

        public async Task<Diagnosis> CreateDiagnosisAsync(Diagnosis diagnosis)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.From<Diagnosis>().Insert(diagnosis);
                return response.Models.First();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating diagnosis");
                throw;
            }
        }

        public async Task<Diagnosis> UpdateDiagnosisAsync(string id, Diagnosis diagnosis)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.From<Diagnosis>()
                    .Where(d => d.Id == id)
                    .Update(diagnosis);
                return response.Models.First();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating diagnosis with ID {DiagnosisId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Diagnosis>> GetDiagnosesForStudyAsync(string studyId)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.From<Diagnosis>()
                    .Where(d => d.StudyId == studyId)
                    .Order(d => d.CreatedAt, Postgrest.Constants.Ordering.Descending)
                    .Get();

                return response.Models;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching diagnoses for study ID {StudyId}", studyId);
                throw;
            }
        }

        public async Task<string> UploadDicomFileAsync(Stream fileStream, string fileName, string patientId, string studyId)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var filePath = $"{patientId}/{studyId}/{fileName}";
                
                await client.Storage
                    .From(_options.StorageBucket)
                    .Upload(fileStream, filePath);

                var response = client.Storage
                    .From(_options.StorageBucket)
                    .GetPublicUrl(filePath);

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading DICOM file");
                throw;
            }
        }

        public async Task<byte[]> DownloadDicomFileAsync(string filePath)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var response = await client.Storage
                    .From(_options.StorageBucket)
                    .Download(filePath);

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading DICOM file from path {FilePath}", filePath);
                throw;
            }
        }

        public async Task DeleteDicomFileAsync(string filePath)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                await client.Storage
                    .From(_options.StorageBucket)
                    .Remove(new List<string> { filePath });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting DICOM file from path {FilePath}", filePath);
                throw;
            }
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogsAsync(
            string? doctorId = null,
            string? entityType = null,
            string? entityId = null,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            int? limit = null)
        {
            try
            {
                var client = await GetSupabaseClientAsync();
                var query = client.From<AuditLog>();

                if (!string.IsNullOrEmpty(doctorId))
                {
                    query = query.Where(a => a.DoctorId == doctorId);
                }

                if (!string.IsNullOrEmpty(entityType))
                {
                    query = query.Where(a => a.EntityType == entityType);
                }

                if (!string.IsNullOrEmpty(entityId))
                {
                    query = query.Where(a => a.EntityId == entityId);
                }

                if (fromDate.HasValue)
                {
                    query = query.Where(a => a.CreatedAt >= fromDate.Value);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(a => a.CreatedAt <= toDate.Value);
                }

                query = query.Order(a => a.CreatedAt, Postgrest.Constants.Ordering.Descending);

                if (limit.HasValue)
                {
                    query = query.Limit(limit.Value);
                }

                var response = await query.Get();
                return response.Models;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching audit logs");
                throw;
            }
        }
    }
}
