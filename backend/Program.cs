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
using NeuronaLabs.Repositories;
using NeuronaLabs.Validators;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Supabase;

var builder = WebApplication.CreateBuilder(args);

// Konfigurace prostředí
var configuration = EnvironmentConfig.LoadConfiguration();
builder.Configuration.AddConfiguration(configuration);

// Load environment variables
builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables()
    .Build();

// Supabase konfigurace
var supabaseUrl = builder.Configuration["Supabase:Url"];
var supabaseKey = builder.Configuration["Supabase:ServiceRoleKey"];

builder.Services.AddSingleton(provider => 
    new Supabase.Client(supabaseUrl, supabaseKey, new Supabase.SupabaseOptions {
        AutoRefreshToken = true,
        PersistSession = true
    }));

// Nahradit stávající JWT autentizaci Supabase autentizací
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = supabaseUrl;
        options.Audience = "authenticated";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = supabaseUrl,
            ValidateAudience = true,
            ValidAudience = "authenticated",
            ValidateLifetime = true
        };
    });

// Zachování stávajících rolí jako custom claims
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => 
        policy.RequireClaim("role", "admin"));
    
    options.AddPolicy("DoctorOnly", policy => 
        policy.RequireClaim("role", "admin", "doctor"));
    
    options.AddPolicy("PatientOnly", policy => 
        policy.RequireClaim("role", "admin", "doctor", "patient"));
});

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .UseSnakeCaseNamingConvention());

// Identity konfigurace
builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;

    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;

    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Registrace AuthService
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IDiagnosisService, DiagnosisService>();
builder.Services.AddScoped<IDicomStudyService, DicomStudyService>();
builder.Services.AddScoped<ISupabaseService, SupabaseService>();

// Supabase Auth Service
builder.Services.AddScoped<ISupabaseAuthService, SupabaseAuthService>();

// Add health checks
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection"), 
        name: "Database",
        failureStatus: HealthStatus.Unhealthy,
        tags: new[] { "db" });

// Add response compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Registrace repozitářů
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IPatientRepository, PatientRepository>();

// Přidání validátorů
builder.Services.AddScoped<IValidator<Patient>, PatientValidator>();
builder.Services.AddScoped<IValidator<Diagnosis>, DiagnosisValidator>();
builder.Services.AddScoped<IValidator<DicomStudy>, DicomStudyValidator>();

// Konfigurace HttpClient pro Orthanc
builder.Services.AddHttpClient<IDicomService, DicomService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Orthanc:BaseUrl"]);
    client.DefaultRequestHeaders.Accept.Add(
        new MediaTypeWithQualityHeaderValue("application/json"));

    var username = builder.Configuration["Orthanc:Username"];
    var password = builder.Configuration["Orthanc:Password"];
    
    if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
    {
        var byteArray = Encoding.ASCII.GetBytes($"{username}:{password}");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Basic", Convert.ToBase64String(byteArray));
    }
})
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
})
.SetHandlerLifetime(TimeSpan.FromMinutes(5));

// GraphQL konfigurace
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddAuthorization()
    .AddType<PatientQueries>()
    .AddType<DicomStudyQueries>()
    .AddFiltering()
    .AddSorting();

// Globální middleware pro autentizaci
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<GlobalStateMiddleware>();

// Přidání vlastního error filtru
builder.Services.AddScoped<GraphQLErrorFilter>();

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
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseResponseCompression();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.MapGraphQL();
app.MapHealthChecks("/health");

// Ensure database is created and migrations are applied
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate();
}

app.Run();
