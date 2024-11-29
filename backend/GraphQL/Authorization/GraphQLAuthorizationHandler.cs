using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;
using NeuronaLabs.Models;

namespace NeuronaLabs.GraphQL.Authorization
{
    public class GraphQLAuthorizationHandler : AuthorizationHandler<GraphQLAuthorizationRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GraphQLAuthorizationHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor ?? 
                throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            GraphQLAuthorizationRequirement requirement)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));
            
            if (requirement == null)
                throw new ArgumentNullException(nameof(requirement));

            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return Task.CompletedTask;
            }

            var user = httpContext.Items["User"] as User;
            if (user == null)
            {
                return Task.CompletedTask;
            }

            if (requirement.AllowedRoles?.Any() == true)
            {
                if (string.IsNullOrEmpty(user.Role) || !requirement.AllowedRoles.Contains(user.Role))
                {
                    return Task.CompletedTask;
                }
            }

            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }

    public class GraphQLAuthorizationRequirement : IAuthorizationRequirement
    {
        public string[] AllowedRoles { get; }

        public GraphQLAuthorizationRequirement(string[]? allowedRoles = null)
        {
            AllowedRoles = allowedRoles ?? Array.Empty<string>();
        }
    }
}
