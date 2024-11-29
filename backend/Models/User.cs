using System.ComponentModel.DataAnnotations;

namespace NeuronaLabs.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public required string Username { get; set; } = string.Empty;

        public required string Email { get; set; } = string.Empty;

        public required string PasswordHash { get; set; } = string.Empty;

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }
    }
}
