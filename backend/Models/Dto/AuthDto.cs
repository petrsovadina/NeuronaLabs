using System.ComponentModel.DataAnnotations;
using NeuronaLabs.Models.Identity;

namespace NeuronaLabs.Models.Dto;

public record UserRegistrationDto
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; init; } = string.Empty;

    [Required]
    public string FirstName { get; init; } = string.Empty;

    [Required]
    public string LastName { get; init; } = string.Empty;

    public UserRole UserRole { get; init; } = UserRole.Patient;
}

public record UserLoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}

public record AuthResult
{
    public bool IsSuccess { get; init; }
    public string? UserId { get; init; }
    public string? AccessToken { get; init; }
    public string? RefreshToken { get; init; }
    public DateTime? ExpiresAt { get; init; }
    public string? ErrorMessage { get; init; }
}

public record PasswordResetDto
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;
}

public record PasswordChangeDto
{
    [Required]
    public string CurrentPassword { get; init; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string NewPassword { get; init; } = string.Empty;
}
