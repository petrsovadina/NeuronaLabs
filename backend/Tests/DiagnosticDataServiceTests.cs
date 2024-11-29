using Microsoft.EntityFrameworkCore;
using Moq;
using NeuronaLabs.Data;
using NeuronaLabs.Models;
using NeuronaLabs.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace NeuronaLabs.Tests
{
    public class DiagnosticDataServiceTests
    {
        private readonly Mock<NeuronaLabsContext> _mockContext;
        private readonly Mock<DbSet<DiagnosticData>> _mockSet;
        private readonly DiagnosticDataService _service;

        public DiagnosticDataServiceTests()
        {
            _mockContext = new Mock<NeuronaLabsContext>();
            _mockSet = new Mock<DbSet<DiagnosticData>>();
            _mockContext.Setup(c => c.DiagnosticData).Returns(_mockSet.Object);
            _service = new DiagnosticDataService(_mockContext.Object);
        }

        [Fact]
        public async Task GetDiagnosticDataByPatientIdAsync_ReturnsDiagnosticData()
        {
            // Arrange
            var patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" };
            var diagnosticData = new List<DiagnosticData>
            {
                new DiagnosticData {
                    Id = 1,
                    PatientId = patientId,
                    Patient = patient,
                    DiagnosisType = "EEG",
                    Description = "Normal EEG findings"
                }
            }.AsQueryable();

            _mockSet.As<IQueryable<DiagnosticData>>().Setup(m => m.Provider).Returns(diagnosticData.Provider);
            _mockSet.As<IQueryable<DiagnosticData>>().Setup(m => m.Expression).Returns(diagnosticData.Expression);
            _mockSet.As<IQueryable<DiagnosticData>>().Setup(m => m.ElementType).Returns(diagnosticData.ElementType);
            _mockSet.As<IQueryable<DiagnosticData>>().Setup(m => m.GetEnumerator()).Returns(diagnosticData.GetEnumerator());

            // Act
            var result = await _service.GetDiagnosticDataByPatientIdAsync(patientId);

            // Assert
            Assert.Single(result);
            Assert.Equal(patientId, result.First().PatientId);
        }

        [Fact]
        public async Task CreateDiagnosticDataAsync_ReturnsCreatedData()
        {
            // Arrange
            var patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" };
            var diagnosticData = new DiagnosticData
            {
                Id = 1,
                PatientId = patientId,
                Patient = patient,
                DiagnosisType = "EEG",
                Description = "Normal EEG findings"
            };

            // Act
            var result = await _service.CreateDiagnosticDataAsync(diagnosticData);

            // Assert
            Assert.Equal(diagnosticData.Id, result.Id);
            _mockSet.Verify(m => m.Add(It.IsAny<DiagnosticData>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }

        [Fact]
        public async Task DeleteDiagnosticDataAsync_DeletesData()
        {
            // Arrange
            var id = 1;
            var patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" };
            var diagnosticData = new DiagnosticData
            {
                Id = id,
                PatientId = patientId,
                Patient = patient,
                DiagnosisType = "EEG",
                Description = "Normal EEG findings"
            };

            _mockSet.Setup(m => m.FindAsync(id))
                .ReturnsAsync(diagnosticData);

            // Act
            await _service.DeleteDiagnosticDataAsync(id);

            // Assert
            _mockSet.Verify(m => m.Remove(It.IsAny<DiagnosticData>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        }

        [Fact]
        public async Task DeleteDiagnosticDataAsync_NonExistentId_DoesNothing()
        {
            // Arrange
            var id = 999;
            _mockSet.Setup(m => m.FindAsync(id))
                .ReturnsAsync((DiagnosticData)null);

            // Act
            await _service.DeleteDiagnosticDataAsync(id);

            // Assert
            _mockSet.Verify(m => m.Remove(It.IsAny<DiagnosticData>()), Times.Never());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Never());
        }
    }
}
