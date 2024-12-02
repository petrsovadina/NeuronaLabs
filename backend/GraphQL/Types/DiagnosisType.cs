using HotChocolate.Types;
using NeuronaLabs.Models;

namespace NeuronaLabs.GraphQL.Types;

public class DiagnosisType : ObjectType<Diagnosis>
{
    protected override void Configure(IObjectTypeDescriptor<Diagnosis> descriptor)
    {
        descriptor.Field(f => f.Id)
            .Type<NonNullType<IdType>>()
            .Description("Jedinečný identifikátor diagnózy");

        descriptor.Field(f => f.PatientId)
            .Type<NonNullType<IdType>>()
            .Description("ID pacienta");

        descriptor.Field(f => f.DiagnosisText)
            .Type<NonNullType<StringType>>()
            .Description("Text diagnózy");

        descriptor.Field(f => f.DiagnosisDate)
            .Type<NonNullType<DateType>>()
            .Description("Datum diagnózy");

        descriptor.Field(f => f.DiagnosisType)
            .Type<StringType>()
            .Description("Typ diagnózy");

        descriptor.Field(f => f.Severity)
            .Type<EnumType<DiagnosisSeverity>>()
            .Description("Závažnost diagnózy");

        descriptor.Field(f => f.Notes)
            .Type<StringType>()
            .Description("Poznámky k diagnóze");

        descriptor.Field("Patient")
            .ResolveWith<DiagnosisResolver>(r => r.GetPatient(default!))
            .Type<PatientType>()
            .Description("Pacient s touto diagnózou");
    }
}
