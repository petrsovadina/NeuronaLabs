using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Models;

namespace NeuronaLabs.Data
{
    public class NeuronaLabsContext : DbContext
    {
        public NeuronaLabsContext(DbContextOptions<NeuronaLabsContext> options)
            : base(options)
        {
        }

        public DbSet<NeuronaLabs.Models.User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<DiagnosticData> DiagnosticData { get; set; }
        public DbSet<DicomStudy> DicomStudies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NeuronaLabs.Models.User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<NeuronaLabs.Models.User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Patient>()
                .HasMany(p => p.DiagnosticData)
                .WithOne(d => d.Patient)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Patient>()
                .HasMany(p => p.DicomStudies)
                .WithOne(d => d.Patient)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DicomStudy>()
                .HasIndex(d => d.StudyInstanceUid)
                .IsUnique();
        }
    }
}
