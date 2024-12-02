using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace NeuronaLabs.Models.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    public string? ProfilePictureUrl { get; set; }

    public UserRole UserRole { get; set; } = UserRole.Patient;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastLoginAt { get; set; }

    public bool IsActive { get; set; } = true;

    public Guid? AssociatedPatientId { get; set; }

    public Patient? AssociatedPatient { get; set; }
}
