using NeuronaLabs.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuronaLabs.Services.Interfaces
{
    public interface IOrthancService
    {
        Task<IEnumerable<DicomStudy>> GetAllStudiesAsync();
        Task<DicomStudy> GetStudyByIdAsync(string orthancStudyId);
        Task<bool> DeleteStudyAsync(string orthancStudyId);
        Task<string> UploadDicomFileAsync(byte[] dicomData);
        Task<byte[]> DownloadDicomFileAsync(string orthancInstanceId);
        Task<string> GetStudyMetadataAsync(string orthancStudyId);
    }
}
