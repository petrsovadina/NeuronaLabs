using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace NeuronaLabs.Middleware
{
    public class PerformanceMiddleware
    {
        private readonly Microsoft.AspNetCore.Http.RequestDelegate _next;
        private readonly ILogger<PerformanceMiddleware> _logger;
        private readonly PerformanceMetricsService _metrics;

        public PerformanceMiddleware(
            Microsoft.AspNetCore.Http.RequestDelegate next,
            ILogger<PerformanceMiddleware> logger,
            PerformanceMetricsService metrics)
        {
            _next = next;
            _logger = logger;
            _metrics = metrics;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var sw = Stopwatch.StartNew();
            var path = context.Request.Path;
            var method = context.Request.Method;

            try
            {
                await _next(context);
            }
            finally
            {
                sw.Stop();
                var elapsed = sw.ElapsedMilliseconds;

                _metrics.RecordRequestDuration(path, method, elapsed);

                if (elapsed > 1000) // Log slow requests
                {
                    _logger.LogWarning(
                        "Slow request detected: {Method} {Path} took {Duration}ms",
                        method, path, elapsed);
                }

                context.Response.Headers["X-Response-Time-Ms"] = elapsed.ToString();
            }
        }
    }

    public class PerformanceMetricsService
    {
        private readonly ILogger<PerformanceMetricsService> _logger;

        public PerformanceMetricsService(ILogger<PerformanceMetricsService> logger)
        {
            _logger = logger;
        }

        public void RecordRequestDuration(string path, string method, long durationMs)
        {
            // Here we can send metrics to monitoring system
            // For example Application Insights or Prometheus
            _logger.LogInformation(
                "Request performance: {Method} {Path} - {Duration}ms",
                method, path, durationMs);
        }
    }
}
