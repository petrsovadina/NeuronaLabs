namespace NeuronaLabs.Services.Interfaces
{
    public interface ISupabaseAuthService
    {
        Task<(bool Success, string? Token, string? ErrorMessage)> SignInWithPassword(string email, string password);
        Task<(bool Success, string? Token, string? ErrorMessage)> SignUp(string email, string password);
        Task<bool> ResetPassword(string email);
        Task<bool> SignOut();
    }
}
