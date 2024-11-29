using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public class PatientService : IPatientService
    {
        private readonly NeuronaLabsContext _context;

        public PatientService(NeuronaLabsContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            return await _context.Patients
                .Include(p => p.DiagnosticData)
                .Include(p => p.DicomStudies)
                .ToListAsync();
        }

        public async Task<Patient?> GetPatientByIdAsync(int id)
        {
            return await _context.Patients
                .Include(p => p.DiagnosticData)
                .Include(p => p.DicomStudies)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Patient> CreatePatientAsync(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<Patient> UpdatePatientAsync(Patient patient)
        {
            _context.Entry(patient).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task DeletePatientAsync(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return;

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
        }
    }
}
