using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using HotChocolate;
using HotChocolate.AspNetCore;
using HotChocolate.Data;
using Serilog;
using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;

// Konfigurace Serilog loggeru
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Konfigurace logování
builder.Logging.ClearProviders();
builder.Logging.AddSerilog();

// Načtení konfigurace
var configuration = builder.Configuration;

// Konfigurace JWT
var jwtConfig = configuration.GetSection("Jwt");
var secretKey = jwtConfig["SecretKey"] 
    ?? throw new InvalidOperationException("JWT Secret Key is not configured");

var key = Encoding.ASCII.GetBytes(secretKey);

// Konfigurace služeb
builder.Services
    // Přidání AutoMapper
    .AddAutoMapper(typeof(Program))
    
    // Přidání FluentValidation
    .AddFluentValidationAutoValidation()
    .AddFluentValidationClientsideAdapters()
    
    // Konfigurace GraphQL
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddType<PatientType>()
    .AddType<DicomStudyType>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddAuthorization();

// JWT konfigurace
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = jwtConfig.GetValue<bool>("ValidateIssuer"),
            ValidateAudience = jwtConfig.GetValue<bool>("ValidateAudience"),
            ValidateLifetime = jwtConfig.GetValue<bool>("ValidateLifetime"),
            ClockSkew = TimeSpan.Zero
        };
    });

// Konfigurace CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Konfigurace middlewaru
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL();

app.Run();
