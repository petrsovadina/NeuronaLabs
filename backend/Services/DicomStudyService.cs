using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public class DicomStudyService : IDicomStudyService
    {
        private readonly NeuronaLabsContext _context;

        public DicomStudyService(NeuronaLabsContext context)
        {
            _context = context;
        }

        public async Task<DicomStudy?> GetDicomStudyByIdAsync(int id)
        {
            return await _context.DicomStudies
                .Include(s => s.Patient)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<DicomStudy?> GetDicomStudyByStudyInstanceUidAsync(string studyInstanceUid)
        {
            return await _context.DicomStudies
                .Include(s => s.Patient)
                .FirstOrDefaultAsync(s => s.StudyInstanceUid == studyInstanceUid);
        }

        public async Task<IEnumerable<DicomStudy>> GetDicomStudiesByPatientIdAsync(int patientId)
        {
            return await _context.DicomStudies
                .Include(s => s.Patient)
                .Where(s => s.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<IEnumerable<DicomStudy>> GetAllDicomStudiesAsync()
        {
            return await _context.DicomStudies
                .Include(s => s.Patient)
                .ToListAsync();
        }

        public async Task<DicomStudy> CreateDicomStudyAsync(DicomStudy study)
        {
            if (string.IsNullOrWhiteSpace(study.StudyInstanceUid))
                throw new ArgumentException("StudyInstanceUid is required");

            if (string.IsNullOrWhiteSpace(study.Modality))
                throw new ArgumentException("Modality is required");

            var patient = await _context.Patients.FindAsync(study.PatientId);
            if (patient == null)
                throw new KeyNotFoundException($"Patient with ID {study.PatientId} not found");

            var existingStudy = await GetDicomStudyByStudyInstanceUidAsync(study.StudyInstanceUid);
            if (existingStudy != null)
                throw new InvalidOperationException($"DicomStudy with StudyInstanceUid {study.StudyInstanceUid} already exists");

            _context.DicomStudies.Add(study);
            await _context.SaveChangesAsync();
            return study;
        }

        public async Task<DicomStudy> UpdateDicomStudyAsync(DicomStudy study)
        {
            var existingStudy = await GetDicomStudyByIdAsync(study.Id);
            if (existingStudy == null)
                throw new KeyNotFoundException($"DicomStudy with ID {study.Id} not found");

            existingStudy.Modality = study.Modality;
            existingStudy.Description = study.Description;
            existingStudy.NumberOfSeries = study.NumberOfSeries;
            existingStudy.NumberOfInstances = study.NumberOfInstances;
            existingStudy.StudyDate = study.StudyDate;

            await _context.SaveChangesAsync();
            return existingStudy;
        }

        public async Task DeleteDicomStudyAsync(int id)
        {
            var study = await GetDicomStudyByIdAsync(id);
            if (study == null)
                throw new KeyNotFoundException($"DicomStudy with ID {id} not found");

            _context.DicomStudies.Remove(study);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDicomStudyAsync(string studyInstanceUid)
        {
            var study = await GetDicomStudyByStudyInstanceUidAsync(studyInstanceUid);
            if (study == null)
                throw new KeyNotFoundException($"DicomStudy with StudyInstanceUid {studyInstanceUid} not found");

            _context.DicomStudies.Remove(study);
            await _context.SaveChangesAsync();
        }

        public async Task<string> GetStudyMetadataAsync(int studyId)
        {
            var study = await GetDicomStudyByIdAsync(studyId);
            if (study == null)
                throw new KeyNotFoundException($"DicomStudy with ID {studyId} not found");

            return await Task.FromResult($"{{\"studyInstanceUid\":\"{study.StudyInstanceUid}\",\"modality\":\"{study.Modality}\",\"studyDate\":\"{study.StudyDate:yyyy-MM-dd}\"}}");
        }

        public async Task<string> GetOhifViewerUrlAsync(int studyId)
        {
            var study = await GetDicomStudyByIdAsync(studyId);
            if (study == null)
                throw new KeyNotFoundException($"DicomStudy with ID {studyId} not found");

            return $"/viewer/{study.StudyInstanceUid}";
        }

        public async Task<string> GetOhifViewerUrlAsync(string studyInstanceUid)
        {
            var study = await GetDicomStudyByStudyInstanceUidAsync(studyInstanceUid);
            if (study == null)
                throw new KeyNotFoundException($"DicomStudy with StudyInstanceUid {studyInstanceUid} not found");

            return $"/viewer/{studyInstanceUid}";
        }

        public async Task<Dictionary<string, object>> GetStudyMetadataAsync(string studyInstanceUid)
        {
            var study = await GetDicomStudyByStudyInstanceUidAsync(studyInstanceUid);
            if (study == null)
                throw new KeyNotFoundException($"DicomStudy with StudyInstanceUid {studyInstanceUid} not found");

            return new Dictionary<string, object>
            {
                { "studyInstanceUid", study.StudyInstanceUid },
                { "modality", study.Modality },
                { "studyDate", study.StudyDate },
                { "numberOfSeries", study.NumberOfSeries },
                { "numberOfInstances", study.NumberOfInstances },
                { "description", study.Description ?? "" }
            };
        }
    }
}
