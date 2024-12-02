using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NeuronaLabs.Data;
using NeuronaLabs.Models.Dto;
using NeuronaLabs.Models.Identity;

namespace NeuronaLabs.Services.Implementation;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration,
        ApplicationDbContext context,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _context = context;
        _logger = logger;
    }

    public async Task<AuthResult> RegisterAsync(UserRegistrationDto registrationDto)
    {
        try
        {
            var user = new ApplicationUser
            {
                UserName = registrationDto.Email,
                Email = registrationDto.Email,
                FirstName = registrationDto.FirstName,
                LastName = registrationDto.LastName,
                UserRole = registrationDto.UserRole,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, registrationDto.Password);

            if (!result.Succeeded)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    ErrorMessage = string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            // Přiřazení role
            await _userManager.AddToRoleAsync(user, user.UserRole.ToString());

            var token = GenerateJwtToken(user);

            _logger.LogInformation($"Registrován uživatel: {user.Email}");

            return new AuthResult
            {
                IsSuccess = true,
                UserId = user.Id.ToString(),
                AccessToken = token.Token,
                RefreshToken = token.RefreshToken,
                ExpiresAt = token.Expiration
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při registraci: {ex.Message}");
            return new AuthResult
            {
                IsSuccess = false,
                ErrorMessage = "Registrace selhala"
            };
        }
    }

    public async Task<AuthResult> LoginAsync(UserLoginDto loginDto)
    {
        try
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Uživatel nenalezen"
                };
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, lockoutOnFailure: true);

            if (!result.Succeeded)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Neplatné přihlašovací údaje"
                };
            }

            var token = GenerateJwtToken(user);

            user.LastLoginAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            _logger.LogInformation($"Přihlášen uživatel: {user.Email}");

            return new AuthResult
            {
                IsSuccess = true,
                UserId = user.Id.ToString(),
                AccessToken = token.Token,
                RefreshToken = token.RefreshToken,
                ExpiresAt = token.Expiration
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při přihlašování: {ex.Message}");
            return new AuthResult
            {
                IsSuccess = false,
                ErrorMessage = "Přihlášení selhalo"
            };
        }
    }

    public async Task<AuthResult> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            var user = await _userManager.FindByEmailAsync(GetEmailFromToken(refreshToken));
            if (user == null)
            {
                return new AuthResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Uživatel nenalezen"
                };
            }

            var token = GenerateJwtToken(user);

            _logger.LogInformation($"Obnoven token pro uživatele: {user.Email}");

            return new AuthResult
            {
                IsSuccess = true,
                UserId = user.Id.ToString(),
                AccessToken = token.Token,
                RefreshToken = token.RefreshToken,
                ExpiresAt = token.Expiration
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při obnovení tokenu: {ex.Message}");
            return new AuthResult
            {
                IsSuccess = false,
                ErrorMessage = "Obnovení tokenu selhalo"
            };
        }
    }

    public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            return result.Succeeded;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při změně hesla: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> ResetPasswordAsync(string email)
    {
        try
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return false;
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            // Zde byste obvykle odeslali token e-mailem
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při resetování hesla: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> ConfirmEmailAsync(string userId, string token)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            return result.Succeeded;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při potvrzení emailu: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> LockoutUserAsync(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var result = await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(10));
            return result.Succeeded;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při zablokování uživatele: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> UnlockUserAsync(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var result = await _userManager.SetLockoutEndDateAsync(user, null);
            return result.Succeeded;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Chyba při odblokování uživatele: {ex.Message}");
            return false;
        }
    }

    public async Task<ApplicationUser?> GetUserByIdAsync(string userId)
    {
        return await _userManager.FindByIdAsync(userId);
    }

    public async Task<ApplicationUser?> GetUserByEmailAsync(string email)
    {
        return await _userManager.FindByEmailAsync(email);
    }

    private (string Token, string RefreshToken, DateTime Expiration) GenerateJwtToken(ApplicationUser user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(ClaimTypes.Role, user.UserRole.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpirationInMinutes"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        var refreshToken = GenerateRefreshToken(user.Email!);

        return (
            new JwtSecurityTokenHandler().WriteToken(token),
            refreshToken,
            expires
        );
    }

    private string GenerateRefreshToken(string email)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:RefreshSecretKey"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expires = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:RefreshTokenExpirationInDays"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GetEmailFromToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:RefreshSecretKey"]!);

        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = _configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        }, out SecurityToken validatedToken);

        var jwtToken = (JwtSecurityToken)validatedToken;
        return jwtToken.Claims.First(x => x.Type == JwtRegisteredClaimNames.Email).Value;
    }
}
