using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NeuronaLabs.Data;
using NeuronaLabs.Models;
using BC = BCrypt.Net.BCrypt;

namespace NeuronaLabs.Services
{
    public class AuthService : IAuthService
    {
        private readonly NeuronaLabsContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(NeuronaLabsContext context, IConfiguration configuration)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<string> AuthenticateAsync(string username, string password)
        {
            if (string.IsNullOrEmpty(username))
                throw new ArgumentException("Username cannot be empty", nameof(username));
            
            if (string.IsNullOrEmpty(password))
                throw new ArgumentException("Password cannot be empty", nameof(password));

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);

            if (user == null || !BC.Verify(password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid username or password");

            return GenerateJwtToken(user);
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {userId} not found");
            return user;
        }

        public async Task<User> RegisterAsync(string username, string password, string email)
        {
            if (string.IsNullOrEmpty(username))
                throw new ArgumentException("Username cannot be empty", nameof(username));
            
            if (string.IsNullOrEmpty(password))
                throw new ArgumentException("Password cannot be empty", nameof(password));
            
            if (string.IsNullOrEmpty(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            if (await _context.Users.AnyAsync(x => x.Username == username))
                throw new InvalidOperationException("Username already exists");

            if (await _context.Users.AnyAsync(x => x.Email == email))
                throw new InvalidOperationException("Email already exists");

            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = BC.HashPassword(password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSecret = _configuration["JWT:Secret"] ?? 
                throw new InvalidOperationException("JWT:Secret not configured");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtSecret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role ?? "user")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
