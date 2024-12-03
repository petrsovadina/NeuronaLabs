using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace NeuronaLabs.Middleware;

public class GlobalStateMiddleware
{
    private readonly Microsoft.AspNetCore.Http.RequestDelegate _next;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GlobalStateMiddleware(Microsoft.AspNetCore.Http.RequestDelegate next, IHttpContextAccessor httpContextAccessor)
    {
        _next = next;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        
        if (httpContext?.User != null)
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = httpContext.User.FindFirstValue(ClaimTypes.Role);
            var userEmail = httpContext.User.FindFirstValue(ClaimTypes.Email);

            if (!string.IsNullOrEmpty(userId))
            {
                context.Items["UserId"] = userId;
            }

            if (!string.IsNullOrEmpty(userRole))
            {
                context.Items["UserRole"] = userRole;
            }

            if (!string.IsNullOrEmpty(userEmail))
            {
                context.Items["UserEmail"] = userEmail;
            }
        }

        await _next(context);
    }
}
