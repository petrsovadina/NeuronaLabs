using NeuronaLabs.Data;
using NeuronaLabs.Models;
using Microsoft.EntityFrameworkCore;

namespace NeuronaLabs.GraphQL.Resolvers;

public class DicomStudyResolver
{
    private readonly ApplicationDbContext _context;

    public DicomStudyResolver(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Patient?> GetPatient(DicomStudy study)
    {
        return await _context.Patients
            .FirstOrDefaultAsync(p => p.Id == study.PatientId);
    }
}
