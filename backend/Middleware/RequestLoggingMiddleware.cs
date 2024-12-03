using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace NeuronaLabs.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly Microsoft.AspNetCore.Http.RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;

        public RequestLoggingMiddleware(Microsoft.AspNetCore.Http.RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await LogRequest(context);
                await _next(context);
            }
            finally
            {
                await LogResponse(context);
            }
        }

        private async Task LogRequest(HttpContext context)
        {
            context.Request.EnableBuffering();

            var requestBody = string.Empty;
            if (context.Request.ContentLength > 0)
            {
                using var reader = new System.IO.StreamReader(
                    context.Request.Body,
                    encoding: System.Text.Encoding.UTF8,
                    detectEncodingFromByteOrderMarks: false,
                    leaveOpen: true);
                
                requestBody = await reader.ReadToEndAsync();
                context.Request.Body.Position = 0;
            }

            _logger.LogInformation(
                "HTTP {RequestMethod} {RequestPath} started - Body: {RequestBody}",
                context.Request.Method,
                context.Request.Path,
                requestBody);
        }

        private Task LogResponse(HttpContext context)
        {
            _logger.LogInformation(
                "HTTP {RequestMethod} {RequestPath} completed with status code {StatusCode}",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode);

            return Task.CompletedTask;
        }
    }
}
