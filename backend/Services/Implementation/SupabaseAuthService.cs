using Supabase;
using Supabase.Interfaces;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace NeuronaLabs.Services.Implementation
{
    public class SupabaseAuthService : ISupabaseAuthService
    {
        private readonly ISupabaseClient _client;
        private readonly ILogger<SupabaseAuthService> _logger;

        public SupabaseAuthService(
            IOptions<SupabaseOptions> options, 
            ILogger<SupabaseAuthService> logger)
        {
            var clientOptions = new SupabaseOptions
            {
                AutoRefreshToken = true,
                AutoConnectRealtime = true
            };

            _client = new Supabase.Client(
                options.Value.Url, 
                options.Value.AnonKey, 
                clientOptions
            );
            _logger = logger;
        }

        public async Task<(bool Success, string? Token, string? ErrorMessage)> SignInWithPassword(string email, string password)
        {
            try 
            {
                var response = await _client.Auth.SignInWithPassword(email, password);
                
                if (response?.Session?.AccessToken != null)
                {
                    return (true, response.Session.AccessToken, null);
                }

                return (false, null, "Invalid credentials");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Supabase SignIn Error");
                return (false, null, ex.Message);
            }
        }

        public async Task<(bool Success, string? Token, string? ErrorMessage)> SignUp(string email, string password)
        {
            try 
            {
                var response = await _client.Auth.SignUp(email, password);
                
                if (response?.Session?.AccessToken != null)
                {
                    return (true, response.Session.AccessToken, null);
                }

                return (false, null, "Registration failed");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Supabase SignUp Error");
                return (false, null, ex.Message);
            }
        }
    }

    public interface ISupabaseAuthService
    {
        Task<(bool Success, string? Token, string? ErrorMessage)> SignInWithPassword(string email, string password);
        Task<(bool Success, string? Token, string? ErrorMessage)> SignUp(string email, string password);
    }
}
