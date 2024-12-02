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
                .Type<StringType>()
                .Description("Unikátní identifikátor studie");

            descriptor.Field(d => d.StudyDate)
                .Type<DateTimeType>()
                .Description("Datum studie");

            descriptor.Field(d => d.Modality)
                .Type<StringType>()
                .Description("Modalita studie");

            descriptor.Field(d => d.Patient)
                .Type<PatientType>()
                .Description("Pacient");
        }
    }
}
