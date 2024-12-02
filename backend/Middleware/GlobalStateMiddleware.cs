using System.Security.Claims;
using HotChocolate.Resolvers;

namespace NeuronaLabs.Middleware;

public class GlobalStateMiddleware
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GlobalStateMiddleware(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public async ValueTask InvokeAsync(IMiddlewareContext context, MiddlewareDelegate next)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        
        if (httpContext?.User != null)
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = httpContext.User.FindFirstValue(ClaimTypes.Role);
            var userEmail = httpContext.User.FindFirstValue(ClaimTypes.Email);

            if (!string.IsNullOrEmpty(userId))
            {
                context.ContextData["UserId"] = userId;
            }

            if (!string.IsNullOrEmpty(userRole))
            {
                context.ContextData["UserRole"] = userRole;
            }

            if (!string.IsNullOrEmpty(userEmail))
            {
                context.ContextData["UserEmail"] = userEmail;
            }
        }

        await next(context);
    }
}
