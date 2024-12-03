using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using NeuronaLabs.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace NeuronaLabs.Middleware
{
    public class JwtMiddleware
    {
        private readonly Microsoft.AspNetCore.Http.RequestDelegate _next;
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;

        public JwtMiddleware(Microsoft.AspNetCore.Http.RequestDelegate next, IConfiguration configuration, IAuthService authService)
        {
            _next = next;
            _configuration = configuration;
            _authService = authService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                await AttachUserToContext(context, token);
            }

            await _next(context);
        }

        private async Task AttachUserToContext(HttpContext context, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = System.Text.Encoding.ASCII.GetBytes(_configuration["JWT_SECRET"] ?? throw new InvalidOperationException("JWT_SECRET not configured"));

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

                // Attach user to context
                context.Items["User"] = await _authService.GetUserByIdAsync(userId);
            }
            catch
            {
                // Do nothing if jwt validation fails
                // User is not attached to context so the request won't have access to secure routes
            }
        }
    }
}
