using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using NeuronaLabs.Models;
using System.Reflection;

namespace NeuronaLabs.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options) {}

        // Databázové sady
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Diagnosis> Diagnoses { get; set; }
        public DbSet<DicomStudy> DicomStudies { get; set; }
        public DbSet<Doctor> Doctors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfigurace vztahů a indexů
            modelBuilder.Entity<Patient>(entity => 
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.PersonalId).IsUnique();
                entity.HasIndex(e => e.Email);
            });

            modelBuilder.Entity<Diagnosis>(entity => 
            {
                entity.HasKey(e => e.Id);
                entity.HasOne<Patient>()
                      .WithMany(p => p.Diagnoses)
                      .HasForeignKey(d => d.PatientId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DicomStudy>(entity => 
            {
                entity.HasKey(e => e.Id);
                entity.HasOne<Patient>()
                      .WithMany(p => p.DicomStudies)
                      .HasForeignKey(d => d.PatientId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Použití snake_case konvence pro Supabase
            modelBuilder.UseSnakeCaseNamingConvention();
        }

        public override int SaveChanges()
        {
            // Automatická aktualizace timestampů
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && 
                           (e.State == EntityState.Added || 
                            e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.Entity is BaseEntity entity)
                {
                    entity.UpdatedAt = DateTime.UtcNow;

                    if (entityEntry.State == EntityState.Added)
                    {
                        entity.CreatedAt = DateTime.UtcNow;
                    }
                }
            }

            return base.SaveChanges();
        }

        // Metoda pro konfiguraci připojení k databázi
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json")
                    .AddEnvironmentVariables()
                    .Build();

                var connectionString = configuration.GetConnectionString("DefaultConnection");
                optionsBuilder.UseNpgsql(connectionString);
            }
        }
    }

    // Factory pro návrháře migrace
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            optionsBuilder.UseNpgsql(connectionString, 
                options => options.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName));

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
