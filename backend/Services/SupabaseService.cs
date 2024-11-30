using Supabase;
using Microsoft.Extensions.Options;
using NeuronaLabs.Configuration;
using System.Threading.Tasks;
using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public interface ISupabaseService
    {
        Task<Patient> GetPatientAsync(string id);
        Task<IEnumerable<Patient>> GetPatientsAsync();
        Task<Patient> CreatePatientAsync(Patient patient);
        Task<Patient> UpdatePatientAsync(string id, Patient patient);

        Task<DicomStudy> GetStudyAsync(string id);
        Task<IEnumerable<DicomStudy>> GetStudiesAsync(string patientId = null);
        Task<DicomStudy> CreateStudyAsync(DicomStudy study);
        Task<DicomStudy> UpdateStudyAsync(string id, DicomStudy study);
        Task<DicomStudy> UpdateStudyStatusAsync(string id, string status);

        Task<Doctor> GetCurrentDoctorAsync();
        Task<Doctor> GetDoctorAsync(string id);
        Task<IEnumerable<Doctor>> GetDoctorsAsync();

        Task<Diagnosis> CreateDiagnosisAsync(Diagnosis diagnosis);
        Task<Diagnosis> UpdateDiagnosisAsync(string id, Diagnosis diagnosis);
        Task<IEnumerable<Diagnosis>> GetDiagnosesForStudyAsync(string studyId);

        Task<string> UploadDicomFileAsync(Stream fileStream, string fileName, string patientId, string studyId);
        Task<byte[]> DownloadDicomFileAsync(string filePath);
        Task DeleteDicomFileAsync(string filePath);

        Task<IEnumerable<AuditLog>> GetAuditLogsAsync(
            string? doctorId = null,
            string? entityType = null,
            string? entityId = null,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            int? limit = null);
    }

    public class SupabaseService : ISupabaseService
    {
        private readonly Supabase.Client _client;
        private readonly ILogger<SupabaseService> _logger;
        private readonly SupabaseOptions _options;

        public SupabaseService(
            IOptions<SupabaseOptions> options,
            ILogger<SupabaseService> logger)
        {
            _options = options.Value;
            _logger = logger;

            var clientOptions = new SupabaseOptions
            {
                AutoRefreshToken = true,
                AutoConnectRealtime = true
            };

            _client = new Supabase.Client(_options.Url, _options.ServiceKey, clientOptions);
        }

        public async Task<Patient> GetPatientAsync(string id)
        {
            try
            {
                var response = await _client
                    .From<Patient>()
                    .Where(p => p.Id == id)
                    .Single();

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching patient with ID {PatientId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Patient>> GetPatientsAsync()
        {
            try
            {
                var response = await _client
                    .From<Patient>()
                    .Order(p => p.LastName)
                    .Get();

                return response.Models;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching patients");
                throw;
            }
        }

        public async Task<Patient> CreatePatientAsync(Patient patient)
        {
            try
            {
                var response = await _client
                    .From<Patient>()
                    .Insert(patient);

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
                var response = await _client
                    .From<Patient>()
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
                var response = await _client
                    .From<DicomStudy>()
                    .Where(s => s.Id == id)
                    .Single();

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching study with ID {StudyId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<DicomStudy>> GetStudiesAsync(string patientId = null)
        {
            try
            {
                var query = _client.From<DicomStudy>();
                
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
                var response = await _client
                    .From<DicomStudy>()
                    .Insert(study);

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
                var response = await _client
                    .From<DicomStudy>()
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
                var response = await _client
                    .From<DicomStudy>()
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
                var user = await _client.Auth.GetUser();
                if (user == null) throw new UnauthorizedAccessException("No authenticated user found");

                var response = await _client
                    .From<Doctor>()
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
                var response = await _client
                    .From<Doctor>()
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
                var response = await _client
                    .From<Doctor>()
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
                var response = await _client
                    .From<Diagnosis>()
                    .Insert(diagnosis);

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
                var response = await _client
                    .From<Diagnosis>()
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
                var response = await _client
                    .From<Diagnosis>()
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
                var filePath = $"{patientId}/{studyId}/{fileName}";
                
                await _client.Storage
                    .From(_options.Storage.Bucket)
                    .Upload(fileStream, filePath);

                var response = _client.Storage
                    .From(_options.Storage.Bucket)
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
                var response = await _client.Storage
                    .From(_options.Storage.Bucket)
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
                await _client.Storage
                    .From(_options.Storage.Bucket)
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
                var query = _client.From<AuditLog>();

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
