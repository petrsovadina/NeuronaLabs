using System.Security.Claims;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Authorization;
using NeuronaLabs.Models.Identity;
using NeuronaLabs.Services.Interfaces;

namespace NeuronaLabs.GraphQL.Queries;

[ExtendObjectType("Query")]
public class AuthQueries
{
    private readonly IAuthService _authService;

    public AuthQueries(IAuthService authService)
    {
        _authService = authService;
    }

    [Authorize]
    public async Task<ApplicationUser?> GetCurrentUser(
        [GlobalState("UserId")] string userId)
    {
        return await _authService.GetUserByIdAsync(userId);
    }

    [Authorize(Policy = "AdminOnly")]
    public async Task<ApplicationUser?> GetUserById(Guid id)
    {
        return await _authService.GetUserByIdAsync(id.ToString());
    }

    [Authorize(Policy = "AdminOnly")]
    public async Task<ApplicationUser?> GetUserByEmail(string email)
    {
        return await _authService.GetUserByEmailAsync(email);
    }

    [Authorize]
    public NeuronaLabs.Models.Identity.UserRole ParseUserRole(string userRole)
    {
        return Enum.Parse<NeuronaLabs.Models.Identity.UserRole>(userRole);
    }

    [Authorize]
    public async Task<bool> ValidateToken(ClaimsPrincipal claimsPrincipal)
    {
        // Implementace logiky validace tokenu
        return true;
    }
}
