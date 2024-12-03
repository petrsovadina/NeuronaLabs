using HotChocolate;
using HotChocolate.Types;
using NeuronaLabs.Models;
using NeuronaLabs.Services.Interfaces;
using System.Threading.Tasks;

namespace NeuronaLabs.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class Mutation
    {
        /// <summary>
        /// Vytvoří nového pacienta
        /// </summary>
        [GraphQLName("createPatient")]
        public async Task<Patient?> CreatePatient(
            [Service] IPatientService patientService, 
            Patient input)
        {
            return await patientService.CreatePatientAsync(input);
        }

        /// <summary>
        /// Aktualizuje údaje pacienta
        /// </summary>
        [GraphQLName("updatePatient")]
        public async Task<Patient?> UpdatePatient(
            [Service] IPatientService patientService, 
            int id, 
            Patient input)
        {
            return await patientService.UpdatePatientAsync(id, input);
        }

        /// <summary>
        /// Smaže pacienta
        /// </summary>
        [GraphQLName("deletePatient")]
        public async Task<bool> DeletePatient(
            [Service] IPatientService patientService, 
            int id)
        {
            return await patientService.DeletePatientAsync(id);
        }

        /// <summary>
        /// Vytvoří novou diagnózu
        /// </summary>
        [GraphQLName("createDiagnosis")]
        public async Task<Diagnosis?> CreateDiagnosis(
            [Service] IDiagnosisService diagnosisService, 
            Diagnosis input)
        {
            return await diagnosisService.CreateDiagnosisAsync(input);
        }

        /// <summary>
        /// Aktualizuje diagnózu
        /// </summary>
        [GraphQLName("updateDiagnosis")]
        public async Task<Diagnosis?> UpdateDiagnosis(
            [Service] IDiagnosisService diagnosisService, 
            Guid id, 
            Diagnosis input)
        {
            return await diagnosisService.UpdateDiagnosisAsync(id, input);
        }

        /// <summary>
        /// Smaže diagnózu
        /// </summary>
        [GraphQLName("deleteDiagnosis")]
        public async Task<bool> DeleteDiagnosis(
            [Service] IDiagnosisService diagnosisService, 
            Guid id)
        {
            return await diagnosisService.DeleteDiagnosisAsync(id);
        }

        /// <summary>
        /// Vytvoří novou DICOM studii
        /// </summary>
        [GraphQLName("createDicomStudy")]
        public async Task<DicomStudy?> CreateDicomStudy(
            [Service] IDicomStudyService dicomStudyService,
            int patientId,
            [GraphQLNonNullType] string studyInstanceUid,
            string? modality = null,
            DateTime? studyDate = null,
            string? status = null)
        {
            if (patientId <= 0)
            {
                throw new ArgumentException("Neplatné ID pacienta.");
            }

            if (string.IsNullOrWhiteSpace(studyInstanceUid))
            {
                throw new ArgumentException("Study Instance UID nesmí být prázdný.");
            }

            var dicomStudy = new DicomStudy
            {
                PatientId = patientId,
                StudyInstanceUid = studyInstanceUid.Trim(),
                Modality = modality?.Trim(),
                StudyDate = studyDate ?? DateTime.UtcNow,
                Status = status?.Trim()
            };

            return await dicomStudyService.CreateDicomStudyAsync(dicomStudy);
        }

        /// <summary>
        /// Aktualizuje DICOM studii
        /// </summary>
        [GraphQLName("updateDicomStudy")]
        public async Task<DicomStudy?> UpdateDicomStudy(
            [Service] IDicomStudyService dicomStudyService,
            int id,
            string? modality = null,
            DateTime? studyDate = null,
            string? status = null)
        {
            if (id <= 0)
            {
                throw new ArgumentException("Neplatné ID studie.");
            }

            var dicomStudy = new DicomStudy
            {
                Modality = modality?.Trim(),
                StudyDate = studyDate ?? DateTime.UtcNow,
                Status = status?.Trim()
            };

            return await dicomStudyService.UpdateDicomStudyAsync(id, dicomStudy);
        }

        /// <summary>
        /// Smaže DICOM studii
        /// </summary>
        [GraphQLName("deleteDicomStudy")]
        public async Task<bool> DeleteDicomStudy(
            [Service] IDicomStudyService dicomStudyService,
            int id)
        {
            if (id <= 0)
            {
                throw new ArgumentException("Neplatné ID studie.");
            }
            return await dicomStudyService.DeleteDicomStudyAsync(id);
        }
    }
}
