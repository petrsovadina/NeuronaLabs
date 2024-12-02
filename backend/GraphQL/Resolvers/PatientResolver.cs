using NeuronaLabs.Data;
using NeuronaLabs.Models;
using Microsoft.EntityFrameworkCore;

namespace NeuronaLabs.GraphQL.Resolvers;

public class PatientResolver
{
    private readonly ApplicationDbContext _context;

    public PatientResolver(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Diagnosis>> GetDiagnoses(Patient patient)
    {
        return await _context.Diagnoses
            .Where(d => d.PatientId == patient.Id)
            .ToListAsync();
    }

    public async Task<IEnumerable<DicomStudy>> GetDicomStudies(Patient patient)
    {
        return await _context.DicomStudies
            .Where(s => s.PatientId == patient.Id)
            .ToListAsync();
    }
}
