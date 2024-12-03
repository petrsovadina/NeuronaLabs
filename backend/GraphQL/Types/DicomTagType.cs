using HotChocolate.Types;
using NeuronaLabs.Models;

namespace NeuronaLabs.GraphQL.Types
{
    public class DicomTagType : ObjectType<DicomTag>
    {
        protected override void Configure(IObjectTypeDescriptor<DicomTag> descriptor)
        {
            descriptor.Field(d => d.Group)
                .Type<NonNullType<StringType>>()
                .Description("Skupina DICOM tagu (např. 0008)");

            descriptor.Field(d => d.Element)
                .Type<NonNullType<StringType>>()
                .Description("Element DICOM tagu (např. 0020)");

            descriptor.Field(d => d.Vr)
                .Type<NonNullType<StringType>>()
                .Description("Value Representation (VR) DICOM tagu");

            descriptor.Field(d => d.Name)
                .Type<NonNullType<StringType>>()
                .Description("Název DICOM tagu");

            descriptor.Field(d => d.Value)
                .Type<StringType>()
                .Description("Hodnota DICOM tagu");

            descriptor.Field(d => d.FullPath)
                .Type<NonNullType<StringType>>()
                .Description("Plná cesta k tagu v DICOM hierarchii")
                .Resolve(context =>
                {
                    var tag = context.Parent<DicomTag>();
                    return $"({tag.Group},{tag.Element})";
                });
        }
    }
}
