using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace NeuronaLabs.Monitoring
{
    public class MonitoringMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<MonitoringMiddleware> _logger;

        public MonitoringMiddleware(RequestDelegate next, ILogger<MonitoringMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var sw = Stopwatch.StartNew();
            var requestPath = context.Request.Path;
            var method = context.Request.Method;

            try
            {
                await _next(context);

                sw.Stop();
                var statusCode = context.Response.StatusCode;
                var elapsed = sw.ElapsedMilliseconds;

                // Log request metrics
                _logger.LogInformation(
                    "Request {Method} {Path} completed with {StatusCode} in {Elapsed}ms",
                    method,
                    requestPath,
                    statusCode,
                    elapsed
                );

                // Add custom metrics
                if (elapsed > 1000)
                {
                    _logger.LogWarning(
                        "Slow request detected: {Method} {Path} took {Elapsed}ms",
                        method,
                        requestPath,
                        elapsed
                    );
                }
            }
            catch (Exception ex)
            {
                sw.Stop();
                _logger.LogError(
                    ex,
                    "Request {Method} {Path} failed after {Elapsed}ms",
                    method,
                    requestPath,
                    sw.ElapsedMilliseconds
                );
                throw;
            }
        }
    }
}
