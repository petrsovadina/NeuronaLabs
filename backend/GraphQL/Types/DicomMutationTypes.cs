using HotChocolate.Types;
using NeuronaLabs.Models;
using NeuronaLabs.Models.Ohif;
using NeuronaLabs.GraphQL.Mutations;

namespace NeuronaLabs.GraphQL.Types
{
    public class UploadDicomResultType : ObjectType<UploadDicomResult>
    {
        protected override void Configure(IObjectTypeDescriptor<UploadDicomResult> descriptor)
        {
            descriptor.Field(r => r.Success)
                .Type<NonNullType<BooleanType>>()
                .Description("Indikuje, zda byl upload úspěšný");

            descriptor.Field(r => r.ErrorMessage)
                .Type<StringType>()
                .Description("Chybová zpráva v případě neúspěchu");

            descriptor.Field(r => r.StudyInstanceUid)
                .Type<StringType>()
                .Description("StudyInstanceUID úspěšně nahrané studie");

            descriptor.Field(r => r.DicomMetadata)
                .Type<DicomStudyMetadataType>()
                .Description("Extrahovaná DICOM metadata");

            descriptor.Field(r => r.OhifMetadata)
                .Type<OhifStudyMetadataType>()
                .Description("Extrahovaná OHIF metadata");

            descriptor.Field(r => r.OhifConfiguration)
                .Type<OhifStudyConfigurationType>()
                .Description("Vygenerovaná OHIF konfigurace pro viewer");
        }
    }

    public class UpdateDicomStudyResultType : ObjectType<UpdateDicomStudyResult>
    {
        protected override void Configure(IObjectTypeDescriptor<UpdateDicomStudyResult> descriptor)
        {
            descriptor.Field(r => r.Success)
                .Type<NonNullType<BooleanType>>()
                .Description("Indikuje, zda byla aktualizace úspěšná");

            descriptor.Field(r => r.ErrorMessage)
                .Type<StringType>()
                .Description("Chybová zpráva v případě neúspěchu");

            descriptor.Field(r => r.Study)
                .Type<DicomStudyType>()
                .Description("Aktualizovaná DICOM studie");
        }
    }

    public class OhifStudyConfigurationType : ObjectType<OhifStudyConfiguration>
    {
        protected override void Configure(IObjectTypeDescriptor<OhifStudyConfiguration> descriptor)
        {
            descriptor.Field(c => c.StudyInstanceUid)
                .Type<NonNullType<StringType>>()
                .Description("StudyInstanceUID studie");

            descriptor.Field(c => c.StudyDescription)
                .Type<StringType>()
                .Description("Popis studie");

            descriptor.Field(c => c.StudyDate)
                .Type<NonNullType<DateTimeType>>()
                .Description("Datum studie");

            descriptor.Field(c => c.PatientName)
                .Type<StringType>()
                .Description("Jméno pacienta");

            descriptor.Field(c => c.PatientId)
                .Type<StringType>()
                .Description("ID pacienta");

            descriptor.Field(c => c.Modality)
                .Type<StringType>()
                .Description("Modalita");

            descriptor.Field(c => c.AccessionNumber)
                .Type<StringType>()
                .Description("Číslo žádanky");

            descriptor.Field(c => c.WadoRsRoot)
                .Type<StringType>()
                .Description("WADO-RS root URL");

            descriptor.Field(c => c.QidoRsRoot)
                .Type<StringType>()
                .Description("QIDO-RS root URL");

            descriptor.Field(c => c.WadoRoot)
                .Type<StringType>()
                .Description("WADO root URL");

            descriptor.Field(c => c.Series)
                .Type<ListType<OhifSeriesType>>()
                .Description("Seznam sérií ve studii");
        }
    }

    public class OhifSeriesType : ObjectType<OhifSeries>
    {
        protected override void Configure(IObjectTypeDescriptor<OhifSeries> descriptor)
        {
            descriptor.Field(s => s.SeriesInstanceUid)
                .Type<NonNullType<StringType>>()
                .Description("SeriesInstanceUID série");

            descriptor.Field(s => s.SeriesDescription)
                .Type<StringType>()
                .Description("Popis série");

            descriptor.Field(s => s.Modality)
                .Type<NonNullType<StringType>>()
                .Description("Modalita série");

            descriptor.Field(s => s.SeriesNumber)
                .Type<StringType>()
                .Description("Číslo série");

            descriptor.Field(s => s.WadoUri)
                .Type<NonNullType<StringType>>()
                .Description("WADO URI pro sérii");

            descriptor.Field(s => s.Instances)
                .Type<ListType<OhifInstanceType>>()
                .Description("Seznam instancí v sérii");
        }
    }

    public class OhifInstanceType : ObjectType<OhifInstance>
    {
        protected override void Configure(IObjectTypeDescriptor<OhifInstance> descriptor)
        {
            descriptor.Field(i => i.SopInstanceUid)
                .Type<NonNullType<StringType>>()
                .Description("SOP Instance UID");

            descriptor.Field(i => i.InstanceNumber)
                .Type<StringType>()
                .Description("Číslo instance");

            descriptor.Field(i => i.Rows)
                .Type<StringType>()
                .Description("Počet řádků v obraze");

            descriptor.Field(i => i.Columns)
                .Type<StringType>()
                .Description("Počet sloupců v obraze");

            descriptor.Field(i => i.WadoUri)
                .Type<NonNullType<StringType>>()
                .Description("WADO URI pro instanci");

            descriptor.Field(i => i.FrameIndex)
                .Type<StringType>()
                .Description("Index snímku pro multiframe instance");

            descriptor.Field(i => i.InstanceMetadata)
                .Type<AnyType>()
                .Description("Další metadata instance");
        }
    }
}
