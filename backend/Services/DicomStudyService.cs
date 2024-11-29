using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public class DicomStudyService
    {
        private readonly NeuronaLabsContext _context;

        public DicomStudyService(NeuronaLabsContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DicomStudy>> GetDicomStudiesForPatientAsync(int patientId)
        {
            return await _context.DicomStudies
                .Where(d => d.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<DicomStudy> GetDicomStudyAsync(string studyInstanceUid)
        {
            return await _context.DicomStudies.FindAsync(studyInstanceUid);
        }

        public async Task<DicomStudy> CreateDicomStudyAsync(DicomStudy dicomStudy)
        {
            _context.DicomStudies.Add(dicomStudy);
            await _context.SaveChangesAsync();
            return dicomStudy;
        }

        public async Task<DicomStudy> UpdateDicomStudyAsync(DicomStudy dicomStudy)
        {
            _context.Entry(dicomStudy).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return dicomStudy;
        }

        public async Task<bool> DeleteDicomStudyAsync(string studyInstanceUid)
        {
            var dicomStudy = await _context.DicomStudies.FindAsync(studyInstanceUid);
            if (dicomStudy == null)
                return false;

            _context.DicomStudies.Remove(dicomStudy);
            await _context.SaveChangesAsync();
            return true;
        }

        // Metody pro integraci s OHIF Viewer
        public async Task<string> GetOhifViewerUrlAsync(string studyInstanceUid)
        {
            var study = await GetDicomStudyAsync(studyInstanceUid);
            if (study == null)
                return null;

            // Vytvoření URL pro OHIF Viewer
            return $"/viewer/{studyInstanceUid}";
        }

        public async Task<Dictionary<string, object>> GetStudyMetadataAsync(string studyInstanceUid)
        {
            var study = await _context.DicomStudies
                .Include(s => s.Patient)
                .FirstOrDefaultAsync(s => s.StudyInstanceUid == studyInstanceUid);

            if (study == null)
                return null;

            // Vrátit metadata ve formátu vhodném pro OHIF Viewer
            return new Dictionary<string, object>
            {
                { "studyInstanceUid", study.StudyInstanceUid },
                { "patientName", study.Patient.Name },
                { "patientId", study.PatientId },
                { "studyDate", study.StudyDate },
                { "modality", study.Modality }
            };
        }
    }
}
