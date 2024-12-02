using HotChocolate;
using HotChocolate.Types;
using NeuronaLabs.Services;
using NeuronaLabs.Models;

namespace NeuronaLabs.GraphQL.Queries;

[ExtendObjectType(Name = "Query")]
public class OhifQueries
{
    [Authorize(Policy = "DoctorOnly")]
    public async Task<OhifStudyConfiguration> GetOhifStudyConfiguration(
        [Service] IDicomService dicomService,
        [Service] IDicomStudyRepository dicomStudyRepository,
        string studyInstanceUid)
    {
        var dicomStudy = await dicomStudyRepository.GetByStudyInstanceUidAsync(studyInstanceUid);
        
        if (dicomStudy == null)
        {
            throw new ArgumentException($"Studie s UID {studyInstanceUid} nebyla nalezena.");
        }

        return await dicomService.GenerateOhifStudyConfiguration(dicomStudy);
    }

    [Authorize(Policy = "DoctorOnly")]
    public async Task<IEnumerable<OhifStudyConfiguration>> GetPatientOhifStudies(
        [Service] IDicomService dicomService,
        [Service] IDicomStudyRepository dicomStudyRepository,
        Guid patientId)
    {
        var dicomStudies = await dicomStudyRepository.GetByPatientIdAsync(patientId);
        
        var ohifConfigurations = new List<OhifStudyConfiguration>();
        foreach (var study in dicomStudies)
        {
            ohifConfigurations.Add(await dicomService.GenerateOhifStudyConfiguration(study));
        }

        return ohifConfigurations;
    }

    [Authorize(Policy = "DoctorOnly")]
    public async Task<string> GetOhifWadoUri(
        [Service] IDicomService dicomService,
        string studyInstanceUid, 
        string seriesInstanceUid)
    {
        return await dicomService.GenerateOhifWadoUri(studyInstanceUid, seriesInstanceUid);
    }
}
