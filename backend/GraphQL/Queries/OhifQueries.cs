using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using NeuronaLabs.Models;
using NeuronaLabs.Models.Ohif;
using NeuronaLabs.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuronaLabs.GraphQL.Queries;

[ExtendObjectType("Query")]
public class OhifQueries
{
    private readonly IDicomStudyRepository _dicomStudyRepository;
    private readonly IDicomService _dicomService;

    public OhifQueries(
        IDicomStudyRepository dicomStudyRepository,
        IDicomService dicomService)
    {
        _dicomStudyRepository = dicomStudyRepository;
        _dicomService = dicomService;
    }

    [Authorize(Policy = "DoctorOnly")]
    public async Task<OhifStudyConfiguration> GetOhifStudyConfiguration(string studyInstanceUid)
    {
        return await _dicomService.GetOhifStudyConfigurationAsync(studyInstanceUid);
    }

    [Authorize(Policy = "DoctorOnly")]
    public async Task<IEnumerable<OhifStudyConfiguration>> GetPatientOhifStudies(Guid patientId)
    {
        var studies = await _dicomStudyRepository.GetByPatientIdAsync(patientId.ToString());
        var configurations = new List<OhifStudyConfiguration>();
        
        foreach (var study in studies)
        {
            var config = await _dicomService.GetOhifStudyConfigurationAsync(study.StudyInstanceUid);
            if (config != null)
            {
                configurations.Add(config);
            }
        }

        return configurations;
    }

    [Authorize(Policy = "DoctorOnly")]
    public async Task<string> GetWadoUri(string studyInstanceUid, string seriesInstanceUid)
    {
        return await _dicomService.GenerateOhifWadoUri(studyInstanceUid, seriesInstanceUid);
    }

    public async Task<IEnumerable<DicomStudy>> GetStudies([Service] ISupabaseService supabaseService, string? patientId = null)
    {
        return await supabaseService.GetStudiesAsync(patientId);
    }

    public async Task<DicomStudy> GetStudyById(string id)
    {
        return await _dicomStudyRepository.GetByIdAsync(id);
    }
}
