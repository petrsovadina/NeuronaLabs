using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace NeuronaLabs.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception has occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            var (statusCode, message) = exception switch
            {
                ArgumentException _ => (HttpStatusCode.BadRequest, exception.Message),
                UnauthorizedAccessException _ => (HttpStatusCode.Unauthorized, "Unauthorized access"),
                KeyNotFoundException _ => (HttpStatusCode.NotFound, "Resource not found"),
                _ => (HttpStatusCode.InternalServerError, 
                    Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development" 
                        ? exception.Message 
                        : "An internal error has occurred.")
            };

            response.StatusCode = (int)statusCode;

            var result = JsonSerializer.Serialize(new
            {
                statusCode = (int)statusCode,
                message = message
            });

            await response.WriteAsync(result);
        }
    }
}
