using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Threading.Tasks;

namespace NeuronaLabs.Monitoring
{
    public class MonitoringMiddleware
    {
        private readonly Microsoft.AspNetCore.Http.RequestDelegate _next;
        private readonly ILogger<MonitoringMiddleware> _logger;

        public MonitoringMiddleware(Microsoft.AspNetCore.Http.RequestDelegate next, ILogger<MonitoringMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var sw = Stopwatch.StartNew();
            await _next(context);
            sw.Stop();

            _logger.LogInformation($"Request {context.Request.Path} took {sw.ElapsedMilliseconds}ms");
        }
    }
}
