using HotChocolate;
using HotChocolate.Types;
using NeuronaLabs.Models;
using NeuronaLabs.Services.Interfaces;

namespace NeuronaLabs.GraphQL.Types
{
    public class PatientType : ObjectType<Patient>
    {
        protected override void Configure(IObjectTypeDescriptor<Patient> descriptor)
        {
            descriptor.Field(f => f.Id)
                .Type<NonNullType<IdType>>()
                .Description("Jedinečný identifikátor pacienta");

            descriptor.Field(f => f.FirstName)
                .Type<NonNullType<StringType>>()
                .Description("Křestní jméno pacienta");

            descriptor.Field(f => f.LastName)
                .Type<NonNullType<StringType>>()
                .Description("Příjmení pacienta");

            descriptor.Field(f => f.Email)
                .Type<StringType>()
                .Description("Email pacienta");

            descriptor.Field(f => f.PersonalId)
                .Type<StringType>()
                .Description("Osobní identifikátor pacienta");

            descriptor.Field(f => f.DicomStudies)
                .Type<ListType<DicomStudyType>>()
                .Description("Seznam DICOM studií pacienta");

            descriptor.Field(f => f.CreatedAt)
                .Type<NonNullType<DateTimeType>>()
                .Description("Datum vytvoření záznamu");

            descriptor.Field(f => f.UpdatedAt)
                .Type<NonNullType<DateTimeType>>()
                .Description("Datum poslední aktualizace");
        }
    }

    public class PatientResolver
    {
        private readonly IDiagnosisService _diagnosisService;
        private readonly IDicomStudyService _dicomStudyService;

        public PatientResolver(
            IDiagnosisService diagnosisService, 
            IDicomStudyService dicomStudyService)
        {
            _diagnosisService = diagnosisService;
            _dicomStudyService = dicomStudyService;
        }

        public async Task<IEnumerable<Diagnosis>?> GetDiagnoses([Parent] Patient patient)
        {
            return await _diagnosisService.GetDiagnosesByPatientIdAsync(patient.Id);
        }

        public async Task<IEnumerable<DicomStudy>?> GetDicomStudies([Parent] Patient patient)
        {
            return await _dicomStudyService.GetDicomStudiesByPatientIdAsync(patient.Id);
        }
    }
}
