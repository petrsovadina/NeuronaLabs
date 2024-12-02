using System.Net.Http;
using System.Text.Json;
using NeuronaLabs.Models;
using NeuronaLabs.Repositories;
using FellowOakDicom;
using FellowOakDicom.Imaging;
using Microsoft.Extensions.Configuration;

namespace NeuronaLabs.Services;

public interface IDicomService
{
    Task<DicomStudy> ProcessDicomFileAsync(Stream dicomFileStream, Guid patientId);
    Task<string> UploadToOrthancAsync(Stream dicomFileStream);
    Task<DicomStudyMetadata> ExtractDicomMetadataAsync(Stream dicomFileStream);
    Task<IEnumerable<DicomStudy>> GetPatientStudiesAsync(Guid patientId);
    Task<Stream> DownloadDicomStudyAsync(string studyInstanceUid);
    Task<OhifStudyMetadata> ExtractOhifMetadataAsync(Stream dicomFileStream);
    Task<string> GenerateOhifWadoUri(string studyInstanceUid, string seriesInstanceUid);
    Task<OhifStudyConfiguration> GenerateOhifStudyConfiguration(DicomStudy dicomStudy);
}

public class DicomService : IDicomService
{
    private readonly HttpClient _orthancClient;
    private readonly IConfiguration _configuration;
    private readonly IDicomStudyRepository _dicomStudyRepository;
    private readonly ILogger<DicomService> _logger;

    public DicomService(
        HttpClient orthancClient, 
        IConfiguration configuration,
        IDicomStudyRepository dicomStudyRepository,
        ILogger<DicomService> logger)
    {
        _orthancClient = orthancClient;
        _configuration = configuration;
        _dicomStudyRepository = dicomStudyRepository;
        _logger = logger;
    }

    public async Task<DicomStudy> ProcessDicomFileAsync(Stream dicomFileStream, Guid patientId)
    {
        try 
        {
            // Extrahuj metadata
            var metadata = await ExtractDicomMetadataAsync(dicomFileStream);

            // Nahraj do Orthanc
            var orthancId = await UploadToOrthancAsync(dicomFileStream);

            // Vytvoř studii v databázi
            var dicomStudy = new DicomStudy
            {
                Id = Guid.NewGuid(),
                PatientId = patientId,
                StudyInstanceUid = metadata.StudyInstanceUid,
                StudyDescription = metadata.StudyDescription,
                Modality = metadata.Modality,
                StudyDate = metadata.StudyDate,
                OrthancId = orthancId,
                Metadata = JsonSerializer.Serialize(metadata)
            };

            await _dicomStudyRepository.AddAsync(dicomStudy);
            return dicomStudy;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Chyba při zpracování DICOM souboru");
            throw;
        }
    }

    public async Task<string> UploadToOrthancAsync(Stream dicomFileStream)
    {
        var orthancUrl = _configuration["Orthanc:BaseUrl"];
        var request = new HttpRequestMessage(HttpMethod.Post, $"{orthancUrl}/instances");
        request.Content = new StreamContent(dicomFileStream);

        var response = await _orthancClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        var uploadResult = JsonSerializer.Deserialize<OrthancUploadResponse>(responseContent);

        return uploadResult?.ID;
    }

    public async Task<DicomStudyMetadata> ExtractDicomMetadataAsync(Stream dicomFileStream)
    {
        var dicomFile = await DicomFile.OpenAsync(dicomFileStream);
        var dataset = dicomFile.Dataset;

        return new DicomStudyMetadata
        {
            StudyInstanceUid = dataset.GetString(DicomTag.StudyInstanceUID),
            StudyDescription = dataset.GetString(DicomTag.StudyDescription),
            Modality = dataset.GetString(DicomTag.Modality),
            StudyDate = dataset.GetDateTime(DicomTag.StudyDate),
            PatientName = dataset.GetString(DicomTag.PatientName),
            PatientId = dataset.GetString(DicomTag.PatientID)
        };
    }

    public async Task<IEnumerable<DicomStudy>> GetPatientStudiesAsync(Guid patientId)
    {
        return await _dicomStudyRepository.GetByPatientIdAsync(patientId);
    }

    public async Task<Stream> DownloadDicomStudyAsync(string studyInstanceUid)
    {
        var orthancUrl = _configuration["Orthanc:BaseUrl"];
        var response = await _orthancClient.GetAsync($"{orthancUrl}/studies/{studyInstanceUid}/archive");
        
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStreamAsync();
    }

    public async Task<OhifStudyMetadata> ExtractOhifMetadataAsync(Stream dicomFileStream)
    {
        var dicomFile = await DicomFile.OpenAsync(dicomFileStream);
        var dataset = dicomFile.Dataset;

        return new OhifStudyMetadata
        {
            StudyInstanceUID = dataset.GetString(DicomTag.StudyInstanceUID),
            AccessionNumber = dataset.GetString(DicomTag.AccessionNumber),
            PatientName = dataset.GetString(DicomTag.PatientName),
            PatientID = dataset.GetString(DicomTag.PatientID),
            StudyDescription = dataset.GetString(DicomTag.StudyDescription),
            StudyDate = dataset.GetDateTime(DicomTag.StudyDate),
            Series = await ExtractOhifSeriesMetadataAsync(dicomFile)
        };
    }

    private async Task<List<OhifSeriesMetadata>> ExtractOhifSeriesMetadataAsync(DicomFile dicomFile)
    {
        var dataset = dicomFile.Dataset;
        var seriesMetadata = new List<OhifSeriesMetadata>
        {
            new OhifSeriesMetadata
            {
                SeriesInstanceUID = dataset.GetString(DicomTag.SeriesInstanceUID),
                Modality = dataset.GetString(DicomTag.Modality),
                SeriesDescription = dataset.GetString(DicomTag.SeriesDescription),
                NumberOfSeriesRelatedInstances = dataset.GetInt32(DicomTag.NumberOfSeriesRelatedInstances, 0)
            }
        };

        return seriesMetadata;
    }

    public async Task<string> GenerateOhifWadoUri(string studyInstanceUid, string seriesInstanceUid)
    {
        var orthancBaseUrl = _configuration["Orthanc:BaseUrl"];
        return $"{orthancBaseUrl}/wado?requestType=WADO&studyUID={studyInstanceUid}&seriesUID={seriesInstanceUid}";
    }

    public async Task<OhifStudyConfiguration> GenerateOhifStudyConfiguration(DicomStudy dicomStudy)
    {
        var metadata = JsonSerializer.Deserialize<OhifStudyMetadata>(dicomStudy.Metadata);
        
        return new OhifStudyConfiguration
        {
            StudyInstanceUID = dicomStudy.StudyInstanceUid,
            PatientName = metadata.PatientName,
            PatientID = metadata.PatientID,
            StudyDescription = metadata.StudyDescription,
            StudyDate = metadata.StudyDate,
            Series = metadata.Series.Select(series => new OhifSeriesConfiguration
            {
                SeriesInstanceUID = series.SeriesInstanceUID,
                Modality = series.Modality,
                Instances = GenerateOhifInstances(dicomStudy.StudyInstanceUid, series.SeriesInstanceUID)
            }).ToList()
        };
    }

    private List<OhifInstanceConfiguration> GenerateOhifInstances(string studyInstanceUid, string seriesInstanceUid)
    {
        var wadoUri = GenerateOhifWadoUri(studyInstanceUid, seriesInstanceUid);
        
        return new List<OhifInstanceConfiguration>
        {
            new OhifInstanceConfiguration
            {
                StudyInstanceUID = studyInstanceUid,
                SeriesInstanceUID = seriesInstanceUid,
                WadoUri = wadoUri
            }
        };
    }

    private class OrthancUploadResponse
    {
        public string ID { get; set; }
        public string Status { get; set; }
    }
}

public class DicomStudyMetadata
{
    public string StudyInstanceUid { get; set; }
    public string StudyDescription { get; set; }
    public string Modality { get; set; }
    public DateTime? StudyDate { get; set; }
    public string PatientName { get; set; }
    public string PatientId { get; set; }
    
    // Nové pole pro OHIF kompatibilitu
    public OhifStudyMetadata OhifMetadata { get; set; }
}

public class OhifStudyMetadata
{
    public string StudyInstanceUID { get; set; }
    public string AccessionNumber { get; set; }
    public string PatientName { get; set; }
    public string PatientID { get; set; }
    public string StudyDescription { get; set; }
    public DateTime StudyDate { get; set; }
    public List<OhifSeriesMetadata> Series { get; set; }
}

public class OhifSeriesMetadata
{
    public string SeriesInstanceUID { get; set; }
    public string Modality { get; set; }
    public int NumberOfSeriesRelatedInstances { get; set; }
    public string SeriesDescription { get; set; }
}

public class OhifStudyConfiguration
{
    public string StudyInstanceUID { get; set; }
    public string PatientName { get; set; }
    public string PatientID { get; set; }
    public string StudyDescription { get; set; }
    public DateTime StudyDate { get; set; }
    public List<OhifSeriesConfiguration> Series { get; set; }
}

public class OhifSeriesConfiguration
{
    public string SeriesInstanceUID { get; set; }
    public string Modality { get; set; }
    public List<OhifInstanceConfiguration> Instances { get; set; }
}

public class OhifInstanceConfiguration
{
    public string StudyInstanceUID { get; set; }
    public string SeriesInstanceUID { get; set; }
    public string WadoUri { get; set; }
}
