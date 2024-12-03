using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace NeuronaLabs.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly Microsoft.AspNetCore.Http.RequestDelegate _next;
        private static readonly ConcurrentDictionary<string, DateTime> _lastRequestTimes = new ConcurrentDictionary<string, DateTime>();
        private static readonly TimeSpan _interval = TimeSpan.FromSeconds(1);
        private const int _maxRequests = 10;

        public RateLimitingMiddleware(Microsoft.AspNetCore.Http.RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var ipAddress = context.Connection.RemoteIpAddress.ToString();

            if (_lastRequestTimes.TryGetValue(ipAddress, out var lastRequestTime))
            {
                var timeSinceLastRequest = DateTime.UtcNow - lastRequestTime;

                if (timeSinceLastRequest < _interval)
                {
                    context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    await context.Response.WriteAsync("Rate limit exceeded. Try again later.");
                    return;
                }
            }

            _lastRequestTimes[ipAddress] = DateTime.UtcNow;

            await _next(context);
        }
    }
}
