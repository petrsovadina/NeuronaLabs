using Supabase;

namespace NeuronaLabs.Configuration
{
    public class SupabaseConfiguration
    {
        public static Client CreateSupabaseClient(SupabaseOptions options)
        {
            if (string.IsNullOrEmpty(options.Url) || string.IsNullOrEmpty(options.AnonKey))
            {
                throw new InvalidOperationException("Chybí konfigurace Supabase. Zkontrolujte nastavení.");
            }

            var clientOptions = new SupabaseOptions
            {
                AutoConnectRealtime = options.RealtimeEnabled,
                ShouldRetryOnFailure = true,
                RetryAttempts = options.MaxRetryAttempts
            };

            var supabase = new Client(options.Url, options.AnonKey, clientOptions);
            
            return supabase;
        }
    }
}
