using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using NeuronaLabs.Models;
using BC = BCrypt.Net.BCrypt;

namespace NeuronaLabs.Services
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;

        public AuthService(IConfiguration configuration, ApplicationDbContext dbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
        }

        public async Task<AuthResult> RegisterAsync(string email, string password, UserRole role)
        {
            // Kontrola existence uživatele
            if (_dbContext.Users.Any(u => u.Email == email))
            {
                return new AuthResult { Success = false, Message = "Uživatel s tímto emailem již existuje." };
            }

            // Hashování hesla
            var hashedPassword = BC.HashPassword(password);

            // Vytvoření uživatele
            var user = new User
            {
                Email = email,
                PasswordHash = hashedPassword,
                Role = role,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            // Generování tokenu
            var token = GenerateJwtToken(user);

            return new AuthResult 
            { 
                Success = true, 
                Token = token,
                User = user 
            };
        }

        public async Task<AuthResult> LoginAsync(string email, string password)
        {
            // Nalezení uživatele
            var user = _dbContext.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                return new AuthResult { Success = false, Message = "Neplatné přihlašovací údaje." };
            }

            // Ověření hesla
            if (!BC.Verify(password, user.PasswordHash))
            {
                return new AuthResult { Success = false, Message = "Neplatné přihlašovací údaje." };
            }

            // Generování tokenu
            var token = GenerateJwtToken(user);

            return new AuthResult 
            { 
                Success = true, 
                Token = token,
                User = user 
            };
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            // Ověření stávajícího hesla
            if (!BC.Verify(currentPassword, user.PasswordHash))
            {
                return false;
            }

            // Nastavení nového hesla
            user.PasswordHash = BC.HashPassword(newPassword);
            await _dbContext.SaveChangesAsync();

            return true;
        }
    }

    public class AuthResult
    {
        public bool Success { get; set; }
        public string? Token { get; set; }
        public string? Message { get; set; }
        public User? User { get; set; }
    }
}
