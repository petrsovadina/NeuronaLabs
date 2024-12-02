using NeuronaLabs.Models;
using NeuronaLabs.Services;

namespace NeuronaLabs.GraphQL.Resolvers
{
    public class DicomStudyResolvers
    {
        public string GetViewerUrl(DicomStudy dicomStudy, [Service] DicomService dicomService)
        {
            // Generování URL pro prohlížení DICOM studie
            return dicomService.GenerateViewerUrl(dicomStudy.StudyInstanceUid);
        }
    }
}
