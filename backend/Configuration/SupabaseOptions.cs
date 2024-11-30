namespace NeuronaLabs.Configuration
{
    public class SupabaseOptions
    {
        public const string SectionName = "Supabase";

        public string Url { get; set; } = string.Empty;
        public string ServiceKey { get; set; } = string.Empty;
        public string AnonKey { get; set; } = string.Empty;
        public StorageOptions Storage { get; set; } = new StorageOptions();
    }

    public class StorageOptions
    {
        public string Bucket { get; set; } = "dicom-files";
    }
}
