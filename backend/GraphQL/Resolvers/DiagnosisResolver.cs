using NeuronaLabs.Data;
using NeuronaLabs.Models;
using Microsoft.EntityFrameworkCore;

namespace NeuronaLabs.GraphQL.Resolvers;

public class DiagnosisResolver
{
    private readonly ApplicationDbContext _context;

    public DiagnosisResolver(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Patient?> GetPatient(Diagnosis diagnosis)
    {
        return await _context.Patients
            .FirstOrDefaultAsync(p => p.Id == diagnosis.PatientId);
    }
}
