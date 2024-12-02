// Global using directives

global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading.Tasks;
global using System.ComponentModel.DataAnnotations;

// Entity Framework
global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.DependencyInjection;

// GraphQL
global using HotChocolate;
global using HotChocolate.Types;
global using HotChocolate.AspNetCore;
global using HotChocolate.Data;

// Logging
global using Microsoft.Extensions.Logging;
global using Serilog;

// Authentication
global using System.Security.Claims;
global using System.IdentityModel.Tokens.Jwt;
global using Microsoft.AspNetCore.Authentication;
global using Microsoft.AspNetCore.Authorization;

// DICOM
global using Dicom;
global using Dicom.Imaging;

// Project specific
global using NeuronaLabs.Models;
global using NeuronaLabs.Services.Interfaces;
global using NeuronaLabs.Data;
global using NeuronaLabs.GraphQL.Types;
