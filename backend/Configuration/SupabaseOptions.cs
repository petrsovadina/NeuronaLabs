namespace NeuronaLabs.Configuration
{
    public class SupabaseOptions
    {
        public const string SectionName = "Supabase";

        public string Url { get; set; } = string.Empty;
        public string AnonKey { get; set; } = string.Empty;
        public string ServiceKey { get; set; } = string.Empty;
        public string StorageBucket { get; set; } = string.Empty;
        public bool RealtimeEnabled { get; set; } = true;
        public int MaxRetryAttempts { get; set; } = 3;

        public void LoadFromEnvironment()
        {
            Url = Environment.GetEnvironmentVariable("SUPABASE_URL") ?? Url;
            AnonKey = Environment.GetEnvironmentVariable("SUPABASE_ANON_KEY") ?? AnonKey;
            ServiceKey = Environment.GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY") ?? ServiceKey;
            StorageBucket = Environment.GetEnvironmentVariable("SUPABASE_STORAGE_BUCKET") ?? StorageBucket;
            
            bool.TryParse(
                Environment.GetEnvironmentVariable("SUPABASE_REALTIME_ENABLED"), 
                out bool realtimeEnabled
            );
            RealtimeEnabled = realtimeEnabled;

            int.TryParse(
                Environment.GetEnvironmentVariable("SUPABASE_MAX_RETRY_ATTEMPTS"), 
                out int maxRetryAttempts
            );
            MaxRetryAttempts = maxRetryAttempts > 0 ? maxRetryAttempts : MaxRetryAttempts;
        }
    }
}
