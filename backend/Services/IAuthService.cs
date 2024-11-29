using NeuronaLabs.Models;

namespace NeuronaLabs.Services
{
    public interface IAuthService
    {
        Task<string> AuthenticateAsync(string username, string password);
        Task<User> GetUserByIdAsync(int userId);
        Task<User> RegisterAsync(string username, string password, string email);
    }
}
