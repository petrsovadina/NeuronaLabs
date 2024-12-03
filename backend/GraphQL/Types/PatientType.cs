using HotChocolate.Types;
using NeuronaLabs.Models;
using NeuronaLabs.Services.Interfaces;

namespace NeuronaLabs.GraphQL.Types
{
    public class PatientType : ObjectType<Patient>
    {
        protected override void Configure(IObjectTypeDescriptor<Patient> descriptor)
        {
            descriptor.Field(p => p.Id).Type<NonNullType<IdType>>();
            descriptor.Field(p => p.FirstName).Type<NonNullType<StringType>>();
            descriptor.Field(p => p.LastName).Type<NonNullType<StringType>>();
            descriptor.Field(p => p.DateOfBirth).Type<DateTimeType>();
            descriptor.Field(p => p.Gender).Type<StringType>();
            descriptor.Field(p => p.Email).Type<StringType>();
            descriptor.Field(p => p.Phone).Type<StringType>();
            descriptor.Field(p => p.Address).Type<StringType>();
            descriptor.Field(p => p.CreatedAt).Type<NonNullType<DateTimeType>>();
            descriptor.Field(p => p.UpdatedAt).Type<DateTimeType>();

            descriptor
                .Field("studies")
                .ResolveWith<PatientResolvers>(r => r.GetStudies(default!, default!))
                .Type<ListType<StudyType>>();
        }
    }

    public class PatientResolvers
    {
        public async Task<IEnumerable<Study>> GetStudies([Parent] Patient patient,
            [Service] IStudyService studyService)
        {
            return await studyService.GetStudiesByPatientIdAsync(patient.Id);
        }
    }
}
