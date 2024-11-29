using System.Net.NetworkInformation;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.Models;

namespace NeuronaLabs.Monitoring
{
    public class DatabaseHealthCheck : IHealthCheck
    {
        private readonly NeuronaLabsContext _context;

        public DatabaseHealthCheck(NeuronaLabsContext context)
        {
            _context = context;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                await _context.Database.CanConnectAsync(cancellationToken);
                return HealthCheckResult.Healthy("Database connection is healthy.");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy("Database connection failed.", ex);
            }
        }
    }

    public class DicomHealthCheck : IHealthCheck
    {
        private readonly DicomSettings _settings;

        public DicomHealthCheck(DicomSettings settings)
        {
            _settings = settings;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                using var ping = new Ping();
                var reply = await ping.SendPingAsync(_settings.ServerUrl);
                
                if (reply.Status == IPStatus.Success)
                {
                    return HealthCheckResult.Healthy($"DICOM server is responding. Latency: {reply.RoundtripTime}ms");
                }
                
                return HealthCheckResult.Degraded($"DICOM server response is degraded. Status: {reply.Status}");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy("DICOM server health check failed.", ex);
            }
        }
    }
}
