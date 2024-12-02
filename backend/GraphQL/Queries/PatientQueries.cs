using HotChocolate;
using HotChocolate.Types;
using HotChocolate.Data;
using NeuronaLabs.Models;
using NeuronaLabs.Services.Interfaces;
using System.Threading.Tasks;

namespace NeuronaLabs.GraphQL.Queries
{
    [ExtendObjectType(typeof(Query))]
    public class PatientQueries
    {
        [UseFiltering]
        [UseSorting]
        public async Task<IEnumerable<Patient>> GetAllPatients(
            [Service] IPatientService patientService)
        {
            return await patientService.GetAllPatientsAsync();
        }

        [UseFirstOrDefault]
        [GraphQLName("patient")]
        public async Task<Patient?> GetPatientById(
            int id, 
            [Service] IPatientService patientService)
        {
            return await patientService.GetPatientByIdAsync(id);
        }

        [UseFiltering]
        [UseSorting]
        [GraphQLName("patients")]
        public async Task<IEnumerable<Patient>> SearchPatients(
            string? searchTerm, 
            [Service] IPatientService patientService)
        {
            return await patientService.SearchPatientsAsync(searchTerm);
        }
    }
}
