namespace NeuronaLabs.Models
{
    public class DicomSettings
    {
        public string ServerUrl { get; set; } = string.Empty;
        public int Port { get; set; } = 4242;
        public string AeTitle { get; set; } = "NEURONALABS";
        public string? Username { get; set; }
        public string? Password { get; set; }
        public bool UseSSL { get; set; }
        public int ConnectionTimeout { get; set; } = 5000;
        public int ReadTimeout { get; set; } = 5000;
    }
}
