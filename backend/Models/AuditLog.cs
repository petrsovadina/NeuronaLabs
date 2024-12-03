using System;

namespace NeuronaLabs.Models
{
    public class AuditLog
    {
        public Guid Id { get; set; }
        public string Action { get; set; }
        public string EntityName { get; set; }
        public string EntityId { get; set; }
        public string UserId { get; set; }
        public string UserEmail { get; set; }
        public string Details { get; set; }
        public DateTime Timestamp { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
    }
}
