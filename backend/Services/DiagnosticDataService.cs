using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public class DiagnosticDataService
    {
        private readonly NeuronaLabsContext _context;

        public DiagnosticDataService(NeuronaLabsContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DiagnosticData>> GetDiagnosticDataForPatientAsync(int patientId)
        {
            return await _context.DiagnosticData
                .Where(d => d.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<DiagnosticData> GetDiagnosticDataAsync(int id)
        {
            return await _context.DiagnosticData.FindAsync(id);
        }

        public async Task<DiagnosticData> CreateDiagnosticDataAsync(DiagnosticData diagnosticData)
        {
            _context.DiagnosticData.Add(diagnosticData);
            await _context.SaveChangesAsync();
            return diagnosticData;
        }

        public async Task<DiagnosticData> UpdateDiagnosticDataAsync(DiagnosticData diagnosticData)
        {
            _context.Entry(diagnosticData).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return diagnosticData;
        }

        public async Task<bool> DeleteDiagnosticDataAsync(int id)
        {
            var diagnosticData = await _context.DiagnosticData.FindAsync(id);
            if (diagnosticData == null)
                return false;

            _context.DiagnosticData.Remove(diagnosticData);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

