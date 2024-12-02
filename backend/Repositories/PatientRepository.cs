using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;

namespace NeuronaLabs.Repositories;

public interface IPatientRepository : IBaseRepository<Patient>
{
    Task<Patient?> GetPatientWithDetailsAsync(Guid id);
    Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm);
}

public class PatientRepository : BaseRepository<Patient>, IPatientRepository
{
    public PatientRepository(ApplicationDbContext context) : base(context) {}

    public async Task<Patient?> GetPatientWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Include(p => p.Diagnoses)
            .Include(p => p.DicomStudies)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm)
    {
        return await _dbSet
            .Where(p => 
                p.FirstName.Contains(searchTerm) || 
                p.LastName.Contains(searchTerm) || 
                p.PersonalId == searchTerm)
            .ToListAsync();
    }
}
