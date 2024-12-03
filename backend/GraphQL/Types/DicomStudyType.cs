using HotChocolate.Types;
using NeuronaLabs.Models;

namespace NeuronaLabs.GraphQL.Types
{
    public class DicomStudyType : ObjectType<DicomStudy>
    {
        protected override void Configure(IObjectTypeDescriptor<DicomStudy> descriptor)
        {
            descriptor.Field(d => d.Id)
                .Type<NonNullType<IntType>>()
                .Description("Jedinečný identifikátor DICOM studie");

            descriptor.Field(d => d.PatientId)
                .Type<IntType>()
                .Description("ID pacienta");

            descriptor.Field(d => d.StudyInstanceUid)
                .Type<NonNullType<StringType>>()
                .Description("Unikátní identifikátor studie");

            descriptor.Field(d => d.StudyDate)
                .Type<NonNullType<DateTimeType>>()
                .Description("Datum studie");

            descriptor.Field(d => d.Modality)
                .Type<NonNullType<StringType>>()
                .Description("Modalita studie (např. MR, CT, XR)");

            descriptor.Field(d => d.StudyDescription)
                .Type<StringType>()
                .Description("Popis studie");

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

            descriptor.Field(d => d.StudyStatus)
                .Type<EnumType<StudyStatus>>()
                .Description("Status studie");

            descriptor.Field(d => d.Patient)
                .Type<NonNullType<PatientType>>()
                .Description("Související pacient");

            descriptor.Field(d => d.Metadata)
                .Type<DicomStudyMetadataType>()
                .Description("Detailní DICOM metadata studie")
                .Resolve(context => 
                {
                    var study = context.Parent<DicomStudy>();
                    return study.Metadata;
                });

            descriptor.Field(d => d.OhifViewerUrl)
                .Type<StringType>()
                .Description("URL pro otevření studie v OHIF prohlížeči")
                .Resolve(context =>
                {
                    var study = context.Parent<DicomStudy>();
                    return $"/viewer/{study.StudyInstanceUid}";
                });
        }
    }
}
