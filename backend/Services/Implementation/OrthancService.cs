using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using NeuronaLabs.Models;
using Microsoft.Extensions.Logging;

namespace NeuronaLabs.Services
{
    public class OrthancService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OrthancService> _logger;

        public OrthancService(
            HttpClient httpClient, 
            IConfiguration configuration,
            ILogger<OrthancService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;

            var orthancBaseUrl = _configuration["Orthanc:BaseUrl"];
            _httpClient.BaseAddress = new Uri(orthancBaseUrl);
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

            // Nastavení základní autentizace, pokud je vyžadována
            var username = _configuration["Orthanc:Username"];
            var password = _configuration["Orthanc:Password"];
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
            {
                var byteArray = Encoding.ASCII.GetBytes($"{username}:{password}");
                _httpClient.DefaultRequestHeaders.Authorization = 
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", 
                        Convert.ToBase64String(byteArray));
            }
        }

        public async Task<string> UploadDicomStudyAsync(byte[] dicomFile, string patientId)
        {
            try 
            {
                using var content = new ByteArrayContent(dicomFile);
                content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/dicom");

                var response = await _httpClient.PostAsync("/instances", content);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                var studyMetadata = JsonSerializer.Deserialize<Dictionary<string, string>>(responseContent);

                var instanceId = studyMetadata?["ID"] ?? throw new Exception("Study upload failed");

                // Přiřazení studie k pacientovi (pokud Orthanc podporuje)
                await UpdateStudyMetadataAsync(instanceId, patientId);

                return instanceId;
            }
            catch (Exception ex)
            {
                _logger.LogError($"DICOM Study Upload Error: {ex.Message}");
                throw;
            }
        }

        public async Task<List<DicomStudyInfo>> GetPatientStudiesAsync(string patientId)
        {
            var response = await _httpClient.GetAsync($"/patients/{patientId}/studies");
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var studyIds = JsonSerializer.Deserialize<List<string>>(responseContent);

            var studies = new List<DicomStudyInfo>();
            foreach (var studyId in studyIds)
            {
                var studyResponse = await _httpClient.GetAsync($"/studies/{studyId}");
                var studyContent = await studyResponse.Content.ReadAsStringAsync();
                var studyDetails = JsonSerializer.Deserialize<Dictionary<string, object>>(studyContent);

                studies.Add(new DicomStudyInfo
                {
                    Id = studyId,
                    Description = studyDetails.ContainsKey("StudyDescription") 
                        ? studyDetails["StudyDescription"].ToString() 
                        : "Bez popisu",
                    Date = studyDetails.ContainsKey("StudyDate") 
                        ? studyDetails["StudyDate"].ToString() 
                        : DateTime.Now.ToString("yyyyMMdd")
                });
            }

            return studies;
        }

        private async Task UpdateStudyMetadataAsync(string instanceId, string patientId)
        {
            var metadata = new Dictionary<string, string>
            {
                { "PatientID", patientId }
            };

            var metadataJson = JsonSerializer.Serialize(metadata);
            var content = new StringContent(metadataJson, Encoding.UTF8, "application/json");

            await _httpClient.PutAsync($"/instances/{instanceId}/metadata", content);
        }

        public async Task<DicomStudyMetadata> GetStudyMetadataAsync(string studyId)
        {
            try 
            {
                var response = await _httpClient.GetAsync($"/studies/{studyId}");
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                var studyDetails = JsonSerializer.Deserialize<Dictionary<string, object>>(responseContent);

                return new DicomStudyMetadata
                {
                    StudyInstanceUid = studyDetails["MainDicomTags"]["StudyInstanceUID"].ToString(),
                    Modality = studyDetails["MainDicomTags"]["Modality"].ToString(),
                    StudyDescription = studyDetails["MainDicomTags"]["StudyDescription"]?.ToString(),
                    StudyDate = DateTime.ParseExact(
                        studyDetails["MainDicomTags"]["StudyDate"].ToString(), 
                        "yyyyMMdd", 
                        null
                    ),
                    SeriesCount = int.Parse(studyDetails["Series"].ToString()),
                    ImagesCount = int.Parse(studyDetails["Instances"].ToString())
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"DICOM Study Metadata Error: {ex.Message}");
                throw;
            }
        }

        public string GenerateViewerUrl(string studyId)
        {
            var ohifBaseUrl = _configuration["OHIF:BaseUrl"];
            return $"{ohifBaseUrl}/viewer?studyInstanceUid={studyId}";
        }

        public async Task<bool> DeleteStudyAsync(string studyId)
        {
            try 
            {
                var response = await _httpClient.DeleteAsync($"/studies/{studyId}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError($"DICOM Study Deletion Error: {ex.Message}");
                return false;
            }
        }
    }

    public class DicomStudyInfo
    {
        public string Id { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
    }
}
