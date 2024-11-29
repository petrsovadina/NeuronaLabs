using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using NeuronaLabs.Data;
using NeuronaLabs.Models;
using NeuronaLabs.Services;
using Xunit;

namespace NeuronaLabs.Tests
{
    public class PatientServiceTests
    {
        private readonly Mock<NeuronaLabsContext> _mockContext;
        private readonly PatientService _patientService;

        public PatientServiceTests()
        {
            _mockContext = new Mock<NeuronaLabsContext>();
            _patientService = new PatientService(_mockContext.Object);
        }

        [Fact]
        public async Task GetPatientsAsync_ShouldReturnAllPatients()
        {
            // Arrange
            var patients = new List<Patient>
            {
                new Patient { Id = 1, Name = "John Doe" },
                new Patient { Id = 2, Name = "Jane Doe" }
            };

            var mockSet = new Mock<DbSet<Patient>>();
            mockSet.As<IQueryable<Patient>>().Setup(m => m.Provider).Returns(patients.AsQueryable().Provider);
            mockSet.As<IQueryable<Patient>>().Setup(m => m.Expression).Returns(patients.AsQueryable().Expression);
            mockSet.As<IQueryable<Patient>>().Setup(m => m.ElementType).Returns(patients.AsQueryable().ElementType);
            mockSet.As<IQueryable<Patient>>().Setup(m => m.GetEnumerator()).Returns(patients.GetEnumerator());

            _mockContext.Setup(c => c.Patients).Returns(mockSet.Object);

            // Act
            var result = await _patientService.GetPatientsAsync();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, p => p.Name == "John Doe");
            Assert.Contains(result, p => p.Name == "Jane Doe");
        }

        [Fact]
        public async Task CreatePatientAsync_ShouldAddAndReturnPatient()
        {
            // Arrange
            var patient = new Patient { Name = "John Doe" };
            var mockSet = new Mock<DbSet<Patient>>();
            _mockContext.Setup(c => c.Patients).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _patientService.CreatePatientAsync(patient);

            // Assert
            Assert.Equal(patient.Name, result.Name);
            mockSet.Verify(m => m.Add(It.IsAny<Patient>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }

        [Fact]
        public async Task UpdatePatientAsync_ShouldUpdateAndReturnPatient()
        {
            // Arrange
            var patient = new Patient { Id = 1, Name = "John Doe" };
            var mockSet = new Mock<DbSet<Patient>>();
            _mockContext.Setup(c => c.Patients).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _patientService.UpdatePatientAsync(patient);

            // Assert
            Assert.Equal(patient.Name, result.Name);
            mockSet.Verify(m => m.Update(It.IsAny<Patient>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }

        [Fact]
        public async Task DeletePatientAsync_ShouldRemovePatient()
        {
            // Arrange
            var patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe" };
            
            var mockSet = new Mock<DbSet<Patient>>();
            mockSet.Setup(m => m.FindAsync(patientId)).ReturnsAsync(patient);
            
            _mockContext.Setup(c => c.Patients).Returns(mockSet.Object);
            _mockContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _patientService.DeletePatientAsync(patientId);

            // Assert
            Assert.True(result);
            mockSet.Verify(m => m.Remove(It.IsAny<Patient>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }
    }
}
