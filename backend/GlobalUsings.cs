// Global using directives

global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading.Tasks;
global using System.ComponentModel.DataAnnotations;
global using System.Text;
global using System.Text.Json;
global using System.Net.Http; // Added explicit using directive for Http namespace

// ASP.NET Core
global using Microsoft.AspNetCore.Http;
global using Microsoft.AspNetCore.Builder;
global using Microsoft.AspNetCore.Hosting;

// Entity Framework
global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Configuration;

// GraphQL
global using HotChocolate;
global using HotChocolate.Types;
global using HotChocolate.AspNetCore;
global using HotChocolate.Data;
global using HotChocolate.Execution;
global using HotChocolate.Subscriptions;

// Logging
global using Microsoft.Extensions.Logging;
global using Serilog;
global using Serilog.Events;

// Authentication & Authorization
global using System.Security.Claims;
global using System.IdentityModel.Tokens.Jwt;
global using Microsoft.AspNetCore.Authentication;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.IdentityModel.Tokens;

// Validation
global using FluentValidation;
global using FluentValidation.AspNetCore;

// DICOM
global using FellowOakDicom;
global using FellowOakDicom.Imaging;

// Supabase
global using Supabase.Gotrue;
global using Supabase.Postgrest;
global using Supabase.Storage;

// Project specific
global using NeuronaLabs.Models;
global using NeuronaLabs.Services;
global using NeuronaLabs.Data;
global using NeuronaLabs.GraphQL;
global using NeuronaLabs.GraphQL.Types;
global using NeuronaLabs.Configuration;
global using NeuronaLabs.Models.Identity;
global using NeuronaLabs.Models.Enums;
