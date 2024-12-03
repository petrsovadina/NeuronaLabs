using System;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace NeuronaLabs.Configuration
{
    public static class EnvironmentConfig
    {
        public static IConfiguration LoadConfiguration(string? basePath = null)
        {
            basePath ??= Directory.GetCurrentDirectory();

            var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environmentName}.json", optional: true)
                .AddEnvironmentVariables()
                .AddDotenvFile(".env", optional: true)
                .AddDotenvFile($".env.{environmentName}", optional: true)
                .Build();

            return configuration;
        }
    }

    // Rozšíření pro načítání .env souborů
    public static class ConfigurationBuilderExtensions
    {
        public static IConfigurationBuilder AddDotenvFile(this IConfigurationBuilder builder, string path, bool optional = false)
        {
            if (!File.Exists(path))
            {
                if (optional) return builder;
                throw new FileNotFoundException($"Soubor {path} nebyl nalezen.");
            }

            var lines = File.ReadAllLines(path)
                .Where(line => !string.IsNullOrWhiteSpace(line) && !line.TrimStart().StartsWith("#"));

            var environmentVariables = lines.Select(line =>
            {
                var parts = line.Split('=', 2);
                return new { Key = parts[0].Trim(), Value = parts[1].Trim().Trim('"') };
            });

            foreach (var variable in environmentVariables)
            {
                Environment.SetEnvironmentVariable(variable.Key, variable.Value);
            }

            return builder;
        }
    }
}
