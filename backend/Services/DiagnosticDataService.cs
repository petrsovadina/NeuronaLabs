using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public class DiagnosticDataService : IDiagnosticDataService
    {
        private readonly NeuronaLabsContext _context;

        public DiagnosticDataService(NeuronaLabsContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DiagnosticData>> GetAllDiagnosticDataAsync()
        {
            return await _context.DiagnosticData
                .Include(d => d.Patient)
                .ToListAsync();
        }

        public async Task<DiagnosticData?> GetDiagnosticDataByIdAsync(int id)
        {
            return await _context.DiagnosticData
                .Include(d => d.Patient)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<IEnumerable<DiagnosticData>> GetDiagnosticDataByPatientIdAsync(int patientId)
        {
            return await _context.DiagnosticData
                .Include(d => d.Patient)
                .Where(d => d.PatientId == patientId)
                .ToListAsync();
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

        public async Task DeleteDiagnosticDataAsync(int id)
        {
            var diagnosticData = await _context.DiagnosticData.FindAsync(id);
            if (diagnosticData == null)
                return;

            _context.DiagnosticData.Remove(diagnosticData);
            await _context.SaveChangesAsync();
        }
    }
}
