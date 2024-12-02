using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;
using Dicom;
using Dicom.Imaging;
using System.IO;

namespace NeuronaLabs.Services.Implementation;

public class DicomStudyService : IDicomStudyService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DicomStudyService> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _dicomStoragePath;

    public DicomStudyService(
        ApplicationDbContext context, 
        ILogger<DicomStudyService> logger,
        IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
        _dicomStoragePath = _configuration["DicomStorage:Path"] ?? 
            Path.Combine(Directory.GetCurrentDirectory(), "DicomStorage");
    }

    public async Task<DicomStudy> UploadDicomStudyAsync(DicomStudy dicomStudy)
    {
        try
        {
            // Ověření, zda pacient existuje
            var patient = await _context.Patients.FindAsync(dicomStudy.PatientId);
            if (patient == null)
            {
                throw new KeyNotFoundException($"Pacient s ID {dicomStudy.PatientId} nebyl nalezen.");
            }

            // Zpracování DICOM souboru
            var processedFilePath = await ProcessDicomFileAsync(dicomStudy.DicomFilePath);

            dicomStudy.Id = Guid.NewGuid();
            dicomStudy.DicomFilePath = processedFilePath;
            dicomStudy.CreatedAt = DateTime.UtcNow;
            dicomStudy.UpdatedAt = DateTime.UtcNow;

            _context.DicomStudies.Add(dicomStudy);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Nahráno DICOM: {dicomStudy.Id}");
            return dicomStudy;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při nahrávání DICOM studie: {ex.Message}");
            throw;
        }
    }

    public async Task<DicomStudy> UpdateDicomStudyAsync(Guid id, DicomStudy dicomStudy)
    {
        try
        {
            var existingStudy = await _context.DicomStudies
                .FirstOrDefaultAsync(ds => ds.Id == id);

            if (existingStudy == null)
            {
                throw new KeyNotFoundException($"DICOM studie s ID {id} nebyla nalezena.");
            }

            // Aktualizace pouze poskytnutých polí
            existingStudy.StudyDescription = dicomStudy.StudyDescription ?? existingStudy.StudyDescription;
            existingStudy.Modality = dicomStudy.Modality ?? existingStudy.Modality;
            existingStudy.StudyDate = dicomStudy.StudyDate != default ? dicomStudy.StudyDate : existingStudy.StudyDate;

            existingStudy.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Aktualizována DICOM studie: {id}");
            return existingStudy;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při aktualizaci DICOM studie {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> DeleteDicomStudyAsync(Guid id)
    {
        try
        {
            var dicomStudy = await _context.DicomStudies
                .FirstOrDefaultAsync(ds => ds.Id == id);

            if (dicomStudy == null)
            {
                throw new KeyNotFoundException($"DICOM studie s ID {id} nebyla nalezena.");
            }

            // Smazání fyzického souboru
            if (File.Exists(dicomStudy.DicomFilePath))
            {
                File.Delete(dicomStudy.DicomFilePath);
            }

            _context.DicomStudies.Remove(dicomStudy);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Smazána DICOM studie: {id}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při mazání DICOM studie {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<DicomStudy?> GetDicomStudyByIdAsync(Guid id)
    {
        try
        {
            return await _context.DicomStudies
                .Include(ds => ds.Patient)
                .FirstOrDefaultAsync(ds => ds.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při načítání DICOM studie {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<IEnumerable<DicomStudy>> GetDicomStudiesByPatientIdAsync(Guid patientId)
    {
        try
        {
            // Ověření, zda pacient existuje
            var patient = await _context.Patients.FindAsync(patientId);
            if (patient == null)
            {
                throw new KeyNotFoundException($"Pacient s ID {patientId} nebyl nalezen.");
            }

            return await _context.DicomStudies
                .Where(ds => ds.PatientId == patientId)
                .OrderByDescending(ds => ds.StudyDate)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při načítání DICOM studií pro pacienta {patientId}: {ex.Message}");
            throw;
        }
    }

    public async Task<string> ProcessDicomFileAsync(string filePath)
    {
        try
        {
            // Kontrola existence souboru
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"DICOM soubor {filePath} nebyl nalezen.");
            }

            // Vytvoření adresáře pro ukládání DICOM souborů, pokud neexistuje
            Directory.CreateDirectory(_dicomStoragePath);

            // Generování jedinečného názvu souboru
            var fileName = $"{Guid.NewGuid():N}.dcm";
            var destinationPath = Path.Combine(_dicomStoragePath, fileName);

            // Kopírování souboru
            File.Copy(filePath, destinationPath, true);

            // Parsování DICOM metadat
            var dicomFile = DicomFile.Open(destinationPath);
            var dataset = dicomFile.Dataset;

            // Extrakce metadat
            var studyInstanceUid = dataset.GetString(DicomTag.StudyInstanceUID);
            var studyDescription = dataset.GetString(DicomTag.StudyDescription);
            var modality = dataset.GetString(DicomTag.Modality);

            _logger.LogInformation($"Zpracováno DICOM: {studyInstanceUid}");

            return destinationPath;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při zpracování DICOM souboru: {ex.Message}");
            throw;
        }
    }
}
