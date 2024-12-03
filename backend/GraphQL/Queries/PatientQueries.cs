using HotChocolate;
using HotChocolate.Data;
using NeuronaLabs.Models;
using NeuronaLabs.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuronaLabs.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public class PatientQueries
    {
        private readonly IPatientService _patientService;

        public PatientQueries(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HotChocolate.Data.UseFiltering]
        [HotChocolate.Data.UseSorting]
        public async Task<IEnumerable<Patient>> GetPatients()
        {
            return await _patientService.GetAllPatientsAsync();
        }

        public async Task<Patient> GetPatientById(Guid id)
        {
            return await _patientService.GetPatientByIdAsync(id);
        }
    }
}
