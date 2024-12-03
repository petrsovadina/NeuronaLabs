using HotChocolate.Types;
using NeuronaLabs.Models;

namespace NeuronaLabs.GraphQL.Types
{
    public class DicomStudyMetadataType : ObjectType<DicomStudyMetadata>
    {
        protected override void Configure(IObjectTypeDescriptor<DicomStudyMetadata> descriptor)
        {
            descriptor.Field(d => d.StudyInstanceUid)
                .Type<NonNullType<StringType>>()
                .Description("Unikátní identifikátor studie");

            descriptor.Field(d => d.PatientId)
                .Type<NonNullType<StringType>>()
                .Description("ID pacienta v DICOM formátu");

            descriptor.Field(d => d.PatientName)
                .Type<StringType>()
                .Description("Jméno pacienta");

            descriptor.Field(d => d.PatientBirthDate)
                .Type<DateType>()
                .Description("Datum narození pacienta");

            descriptor.Field(d => d.PatientSex)
                .Type<StringType>()
                .Description("Pohlaví pacienta");

            descriptor.Field(d => d.StudyDate)
                .Type<NonNullType<DateTimeType>>()
                .Description("Datum studie");

            descriptor.Field(d => d.StudyTime)
                .Type<StringType>()
                .Description("Čas studie");

            descriptor.Field(d => d.StudyDescription)
                .Type<StringType>()
                .Description("Popis studie");

            descriptor.Field(d => d.Modality)
                .Type<NonNullType<StringType>>()
                .Description("Modalita studie");

            descriptor.Field(d => d.AccessionNumber)
                .Type<StringType>()
                .Description("Přístupové číslo studie");

            descriptor.Field(d => d.ReferringPhysicianName)
                .Type<StringType>()
                .Description("Jméno odesílajícího lékaře");

            descriptor.Field(d => d.InstitutionName)
                .Type<StringType>()
                .Description("Název instituce");

            descriptor.Field(d => d.SeriesCount)
                .Type<NonNullType<IntType>>()
                .Description("Počet sérií ve studii");

            descriptor.Field(d => d.InstancesCount)
                .Type<NonNullType<IntType>>()
                .Description("Celkový počet instancí ve studii");

            descriptor.Field(d => d.StudyId)
                .Type<StringType>()
                .Description("ID studie");

            descriptor.Field(d => d.PerformedProcedureStepStartDate)
                .Type<DateTimeType>()
                .Description("Datum zahájení procedury");

            descriptor.Field(d => d.PerformedProcedureStepStartTime)
                .Type<StringType>()
                .Description("Čas zahájení procedury");

            descriptor.Field(d => d.RequestedProcedureDescription)
                .Type<StringType>()
                .Description("Popis požadované procedury");

            descriptor.Field(d => d.RequestedProcedureId)
                .Type<StringType>()
                .Description("ID požadované procedury");

            descriptor.Field(d => d.ScheduledProcedureStepId)
                .Type<StringType>()
                .Description("ID naplánované procedury");

            descriptor.Field(d => d.OrthancStudyId)
                .Type<StringType>()
                .Description("ID studie v Orthanc PACS");

            descriptor.Field(d => d.DicomTags)
                .Type<ListType<DicomTagType>>()
                .Description("Seznam všech DICOM tagů");
        }
    }
}
