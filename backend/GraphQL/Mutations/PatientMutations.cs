using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.GraphQL.Types;
using NeuronaLabs.Models;
using NeuronaLabs.Services;
using System.ComponentModel.DataAnnotations;

namespace NeuronaLabs.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class PatientMutations
    {
        public async Task<PatientType> CreatePatient(
            [Service] ApplicationDbContext context,
            [Service] AuthService authService,
            CreatePatientInput input)
        {
            // Validace vstupu
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(input);
            
            if (!Validator.TryValidateObject(input, validationContext, validationResults, true))
            {
                throw new GraphQLException(validationResults.Select(vr => vr.ErrorMessage).ToList());
            }

            // Kontrola duplicity emailu
            if (await context.Patients.AnyAsync(p => p.Email == input.Email))
            {
                throw new GraphQLException("Patient with this email already exists.");
            }

            var patient = new Patient
            {
                Id = Guid.NewGuid(),
                FirstName = input.FirstName,
                LastName = input.LastName,
                BirthDate = input.BirthDate,
                Gender = input.Gender,
                Email = input.Email,
                PhoneNumber = input.PhoneNumber,
                MedicalInsuranceNumber = input.MedicalInsuranceNumber
            };

            context.Patients.Add(patient);
            await context.SaveChangesAsync();

            return new PatientType
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                BirthDate = patient.BirthDate,
                Gender = patient.Gender,
                Email = patient.Email,
                PhoneNumber = patient.PhoneNumber
            };
        }

        public async Task<PatientType> UpdatePatient(
            [Service] ApplicationDbContext context,
            Guid patientId,
            CreatePatientInput input)
        {
            var patient = await context.Patients.FindAsync(patientId);
            
            if (patient == null)
            {
                throw new GraphQLException("Patient not found.");
            }

            // Validace vstupu
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(input);
            
            if (!Validator.TryValidateObject(input, validationContext, validationResults, true))
            {
                throw new GraphQLException(validationResults.Select(vr => vr.ErrorMessage).ToList());
            }

            patient.FirstName = input.FirstName;
            patient.LastName = input.LastName;
            patient.BirthDate = input.BirthDate;
            patient.Gender = input.Gender;
            patient.Email = input.Email;
            patient.PhoneNumber = input.PhoneNumber;
            patient.MedicalInsuranceNumber = input.MedicalInsuranceNumber;

            await context.SaveChangesAsync();

            return new PatientType
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                BirthDate = patient.BirthDate,
                Gender = patient.Gender,
                Email = patient.Email,
                PhoneNumber = patient.PhoneNumber
            };
        }

        public async Task<bool> DeletePatient(
            [Service] ApplicationDbContext context,
            Guid patientId)
        {
            var patient = await context.Patients
                .Include(p => p.Diagnoses)
                .Include(p => p.DicomStudies)
                .FirstOrDefaultAsync(p => p.Id == patientId);

            if (patient == null)
            {
                throw new GraphQLException("Patient not found.");
            }

            // Smazání všech závislostí
            context.Diagnoses.RemoveRange(patient.Diagnoses);
            context.DicomStudies.RemoveRange(patient.DicomStudies);
            context.Patients.Remove(patient);

            await context.SaveChangesAsync();
            return true;
        }

        public async Task<DicomStudyType> UploadDicomStudy(
            [Service] ApplicationDbContext context,
            [Service] OrthancService orthancService,
            CreateDicomStudyInput input,
            Stream dicomFile)
        {
            // Kontrola existence pacienta
            var patient = await context.Patients.FindAsync(input.PatientId);
            if (patient == null)
            {
                throw new GraphQLException("Patient not found.");
            }

            // Upload do Orthanc
            var orthancStudyId = await orthancService.UploadDicomStudyAsync(dicomFile);
            
            // Získání metadat studie
            var studyMetadata = await orthancService.GetStudyMetadataAsync(orthancStudyId);

            var dicomStudy = new DicomStudy
            {
                Id = Guid.NewGuid(),
                PatientId = input.PatientId,
                StudyInstanceUid = input.StudyInstanceUid,
                StudyDate = studyMetadata.StudyDate,
                Modality = studyMetadata.Modality,
                Description = studyMetadata.StudyDescription,
                OrthancStudyId = orthancStudyId,
                SeriesCount = studyMetadata.SeriesCount,
                ImagesCount = studyMetadata.ImagesCount,
                StudyStatus = "UPLOADED"
            };

            context.DicomStudies.Add(dicomStudy);
            await context.SaveChangesAsync();

            return new DicomStudyType
            {
                Id = dicomStudy.Id,
                PatientId = dicomStudy.PatientId,
                StudyInstanceUid = dicomStudy.StudyInstanceUid,
                StudyDate = dicomStudy.StudyDate,
                Modality = dicomStudy.Modality,
                Description = dicomStudy.Description,
                OrthancStudyId = dicomStudy.OrthancStudyId,
                SeriesCount = dicomStudy.SeriesCount,
                ImagesCount = dicomStudy.ImagesCount,
                StudyStatus = dicomStudy.StudyStatus
            };
        }

        public async Task<bool> DeleteDicomStudy(
            [Service] ApplicationDbContext context,
            [Service] OrthancService orthancService,
            Guid studyId)
        {
            var dicomStudy = await context.DicomStudies.FindAsync(studyId);
            
            if (dicomStudy == null)
            {
                throw new GraphQLException("DICOM study not found.");
            }

            // Smazání z Orthanc
            var orthancDeleteResult = await orthancService.DeleteStudyAsync(dicomStudy.OrthancStudyId);
            
            if (!orthancDeleteResult)
            {
                throw new GraphQLException("Failed to delete DICOM study from Orthanc.");
            }

            // Smazání z databáze
            context.DicomStudies.Remove(dicomStudy);
            await context.SaveChangesAsync();

            return true;
        }
    }
}
