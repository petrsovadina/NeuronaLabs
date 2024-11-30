using HotChocolate;
using HotChocolate.Types;
using NeuronaLabs.Models;
using NeuronaLabs.Services;
using System.Threading.Tasks;

namespace NeuronaLabs.GraphQL.Resolvers
{
    [ExtendObjectType("Mutation")]
    public class MutationResolver
    {
        private readonly ISupabaseService _supabaseService;
        private readonly ILogger<MutationResolver> _logger;

        public MutationResolver(
            ISupabaseService supabaseService,
            ILogger<MutationResolver> logger)
        {
            _supabaseService = supabaseService;
            _logger = logger;
        }

        public async Task<Patient> CreatePatient(CreatePatientInput input)
        {
            try
            {
                var currentDoctor = await _supabaseService.GetCurrentDoctorAsync();
                
                var patient = new Patient
                {
                    FirstName = input.FirstName,
                    LastName = input.LastName,
                    BirthDate = input.BirthDate,
                    PersonalId = input.PersonalId,
                    Gender = input.Gender.ToString(),
                    Email = input.Email,
                    Phone = input.Phone,
                    Address = input.Address,
                    InsuranceNumber = input.InsuranceNumber,
                    InsuranceProvider = input.InsuranceProvider,
                    CreatedBy = currentDoctor.Id
                };

                // Implementace vytvoření pacienta v Supabase
                return patient;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating patient");
                throw;
            }
        }

        public async Task<DicomStudy> CreateStudy(CreateStudyInput input)
        {
            try
            {
                var currentDoctor = await _supabaseService.GetCurrentDoctorAsync();
                
                var study = new DicomStudy
                {
                    PatientId = input.PatientId,
                    DoctorId = currentDoctor.Id,
                    DicomUid = input.DicomUid,
                    Modality = input.Modality.ToString(),
                    StudyDate = input.StudyDate,
                    AccessionNumber = input.AccessionNumber,
                    StudyDescription = input.StudyDescription,
                    Status = StudyStatus.NEW.ToString(),
                    FolderPath = $"/storage/studies/{input.PatientId}/{input.DicomUid}",
                    Metadata = input.Metadata
                };

                // Implementace vytvoření studie v Supabase
                return study;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating study");
                throw;
            }
        }

        public async Task<DicomStudy> UpdateStudyStatus(string id, StudyStatus status)
        {
            try
            {
                var study = await _supabaseService.GetStudyAsync(id);
                if (study == null)
                {
                    throw new Exception($"Study with ID {id} not found");
                }

                study.Status = status.ToString();
                // Implementace aktualizace studie v Supabase
                return study;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating study status");
                throw;
            }
        }

        public async Task<Diagnosis> CreateDiagnosis(CreateDiagnosisInput input)
        {
            try
            {
                var currentDoctor = await _supabaseService.GetCurrentDoctorAsync();
                
                var diagnosis = new Diagnosis
                {
                    StudyId = input.StudyId,
                    DoctorId = currentDoctor.Id,
                    DiagnosisText = input.DiagnosisText,
                    Findings = input.Findings,
                    Recommendations = input.Recommendations
                };

                // Implementace vytvoření diagnózy v Supabase
                return diagnosis;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating diagnosis");
                throw;
            }
        }

        public async Task<bool> DeleteStudyNote(string id)
        {
            try
            {
                // Implementace smazání poznámky v Supabase
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting study note");
                throw;
            }
        }
    }
}
