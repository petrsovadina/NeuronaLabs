using NeuronaLabs.Models.Identity;
using NeuronaLabs.Models.Dto;

namespace NeuronaLabs.Services;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(UserRegistrationDto registrationDto);
    Task<AuthResult> LoginAsync(UserLoginDto loginDto);
    Task<AuthResult> RefreshTokenAsync(string refreshToken);
    Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword);
    Task<bool> ResetPasswordAsync(string email);
    Task<bool> ConfirmEmailAsync(string userId, string token);
    Task<bool> LockoutUserAsync(string userId);
    Task<bool> UnlockUserAsync(string userId);
    Task<ApplicationUser?> GetUserByIdAsync(string userId);
    Task<ApplicationUser?> GetUserByEmailAsync(string email);
}
