using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;
using NeuronaLabs.Services;
using System.ComponentModel.DataAnnotations;

namespace NeuronaLabs.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class DicomStudyMutations
    {
        public async Task<DicomStudy> UploadDicomStudy(
            [Service] OrthancService orthancService,
            [Service] ApplicationDbContext dbContext,
            [Required] string patientId,
            [Required] IFile dicomFile)
        {
            // Validace souboru
            if (dicomFile == null)
                throw new GraphQLException("DICOM soubor je povinný.");

            // Čtení souboru do byte[]
            using var memoryStream = new MemoryStream();
            await dicomFile.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            // Nahrání do Orthanc
            var orthancStudyId = await orthancService.UploadDicomStudyAsync(fileBytes, patientId);

            // Vytvoření záznamu studie v databázi
            var dicomStudy = new DicomStudy
            {
                PatientId = patientId,
                StudyInstanceUid = orthancStudyId,
                Description = dicomFile.Name,
                StudyDate = DateTime.UtcNow,
                Modality = DetermineModalityFromFileName(dicomFile.Name)
            };

            dbContext.DicomStudies.Add(dicomStudy);
            await dbContext.SaveChangesAsync();

            return dicomStudy;
        }

        private string DetermineModalityFromFileName(string fileName)
        {
            // Jednoduché určení modality podle přípony nebo názvu souboru
            fileName = fileName.ToLower();
            return fileName.Contains("mri") ? "MR" :
                   fileName.Contains("ct") ? "CT" :
                   fileName.Contains("xray") ? "XR" :
                   "UN"; // Neznámá modalita
        }

        public async Task<bool> DeleteDicomStudy(
            [Service] OrthancService orthancService,
            [Service] ApplicationDbContext dbContext,
            [Required] string studyId)
        {
            // Smazání studie z Orthanc
            var response = await orthancService.DeleteStudyAsync(studyId);

            // Smazání záznamu z databáze
            var study = await dbContext.DicomStudies
                .FirstOrDefaultAsync(s => s.StudyInstanceUid == studyId);

            if (study != null)
            {
                dbContext.DicomStudies.Remove(study);
                await dbContext.SaveChangesAsync();
            }

            return response;
        }
    }
}
