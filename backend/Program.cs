using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using NeuronaLabs.Data;
using NeuronaLabs.GraphQL;
using NeuronaLabs.Services;
using NeuronaLabs.Middleware;
using NeuronaLabs.GraphQL.Authorization;
using NeuronaLabs.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using HotChocolate.AspNetCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using NeuronaLabs.HealthChecks;
using Microsoft.ApplicationInsights.AspNetCore.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build();

// Configuration
builder.Services.Configure<SupabaseOptions>(options =>
{
    options.Url = Environment.GetEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL") ?? 
        builder.Configuration["Supabase:Url"];
    options.ServiceKey = Environment.GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY") ?? 
        builder.Configuration["Supabase:ServiceKey"];
    options.AnonKey = Environment.GetEnvironmentVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? 
        builder.Configuration["Supabase:AnonKey"];
});

// Database
builder.Services.AddDbContext<NeuronaLabsContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add health checks
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection"), 
        name: "Database",
        failureStatus: HealthStatus.Unhealthy,
        tags: new[] { "db" });

// Authentication
var jwtSecret = builder.Configuration["JWT:Secret"];
if (string.IsNullOrEmpty(jwtSecret))
{
    throw new InvalidOperationException("JWT:Secret is not configured");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
            ValidAudience = builder.Configuration["JWT:ValidAudience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

// Add response compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// CORS
var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? 
    Array.Empty<string>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowedOrigins", policy =>
    {
        policy.WithOrigins(corsOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// GraphQL
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddAuthorization()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddErrorFilter<GraphQLErrorFilter>();

// Services
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IDiagnosticDataService, DiagnosticDataService>();
builder.Services.AddScoped<IDicomStudyService, DicomStudyService>();
builder.Services.AddScoped<ISupabaseService, SupabaseService>();

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

if (builder.Environment.IsProduction())
{
    // Add Application Insights
    builder.Services.AddApplicationInsightsTelemetry(options =>
    {
        options.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"];
    });
}

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseResponseCompression();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("AllowedOrigins");

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.MapGraphQL();
app.MapHealthChecks("/health");

// Ensure database is created and migrations are applied
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<NeuronaLabsContext>();
    context.Database.Migrate();
}

app.Run();
