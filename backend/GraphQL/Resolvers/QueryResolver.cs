using HotChocolate;
using HotChocolate.Types;
using NeuronaLabs.Models;
using NeuronaLabs.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuronaLabs.GraphQL.Resolvers
{
    [ExtendObjectType("Query")]
    public class QueryResolver
    {
        private readonly ISupabaseService _supabaseService;
        private readonly ILogger<QueryResolver> _logger;

        public QueryResolver(
            ISupabaseService supabaseService,
            ILogger<QueryResolver> logger)
        {
            _supabaseService = supabaseService;
            _logger = logger;
        }

        public async Task<IEnumerable<Patient>> GetPatients(
            string? search = null,
            int? offset = null,
            int? limit = null,
            PatientOrderBy? orderBy = null)
        {
            try
            {
                var patients = await _supabaseService.GetPatientsAsync();
                // Zde by byla implementace filtrování, stránkování a řazení
                return patients;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching patients");
                throw;
            }
        }

        public async Task<Patient> GetPatient(string id)
        {
            try
            {
                return await _supabaseService.GetPatientAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching patient with ID {PatientId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<DicomStudy>> GetStudies(
            string? patientId = null,
            Modality? modality = null,
            StudyStatus? status = null,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            int? offset = null,
            int? limit = null,
            StudyOrderBy? orderBy = null)
        {
            try
            {
                var studies = await _supabaseService.GetStudiesAsync(patientId);
                // Zde by byla implementace filtrování, stránkování a řazení
                return studies;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching studies");
                throw;
            }
        }

        public async Task<DicomStudy> GetStudy(string id)
        {
            try
            {
                return await _supabaseService.GetStudyAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching study with ID {StudyId}", id);
                throw;
            }
        }

        public async Task<Doctor> GetCurrentDoctor()
        {
            try
            {
                return await _supabaseService.GetCurrentDoctorAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching current doctor");
                throw;
            }
        }
    }
}
