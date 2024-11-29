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
    public class DiagnosticDataServiceTests
    {
        private readonly Mock<NeuronaLabsContext> _mockContext;
        private readonly DiagnosticDataService _diagnosticDataService;

        public DiagnosticDataServiceTests()
        {
            _mockContext = new Mock<NeuronaLabsContext>();
            _diagnosticDataService = new DiagnosticDataService(_mockContext.Object);
        }

        [Fact]
        public async Task GetDiagnosticDataForPatientAsync_ShouldReturnPatientData()
        {
            // Arrange
            var patientId = 1;
            var diagnosticData = new List<DiagnosticData>
            {
                new DiagnosticData { Id = 1, PatientId = patientId, DiagnosisType = "Type1" },
                new DiagnosticData { Id = 2, PatientId = patientId, DiagnosisType = "Type2" }
            };

            var mockSet = new Mock<DbSet<DiagnosticData>>();
            mockSet.As<IQueryable<DiagnosticData>>().Setup(m => m.Provider).Returns(diagnosticData.AsQueryable().Provider);
            mockSet.As<IQueryable<DiagnosticData>>().Setup(m => m.Expression).Returns(diagnosticData.AsQueryable().Expression);
            mockSet.As<IQueryable<DiagnosticData>>().Setup(m => m.ElementType).Returns(diagnosticData.AsQueryable().ElementType);
            mockSet.As<IQueryable<DiagnosticData>>().Setup(m => m.GetEnumerator()).Returns(diagnosticData.GetEnumerator());

            _mockContext.Setup(c => c.DiagnosticData).Returns(mockSet.Object);

            // Act
            var result = await _diagnosticDataService.GetDiagnosticDataForPatientAsync(patientId);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, d => d.DiagnosisType == "Type1");
            Assert.Contains(result, d => d.DiagnosisType == "Type2");
        }

        [Fact]
        public async Task CreateDiagnosticDataAsync_ShouldAddData()
        {
            // Arrange
            var diagnosticData = new DiagnosticData
            {
                Id = 1,
                PatientId = 1,
                DiagnosisType = "Test",
                Description = "Test Description",
                Date = DateTime.Now
            };

            var mockSet = new Mock<DbSet<DiagnosticData>>();
            _mockContext.Setup(c => c.DiagnosticData).Returns(mockSet.Object);

            // Act
            var result = await _diagnosticDataService.CreateDiagnosticDataAsync(diagnosticData);

            // Assert
            mockSet.Verify(m => m.Add(It.IsAny<DiagnosticData>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
            Assert.Equal(diagnosticData, result);
        }

        [Fact]
        public async Task UpdateDiagnosticDataAsync_ShouldUpdateData()
        {
            // Arrange
            var diagnosticData = new DiagnosticData
            {
                Id = 1,
                PatientId = 1,
                DiagnosisType = "Updated",
                Description = "Updated Description",
                Date = DateTime.Now
            };

            var mockSet = new Mock<DbSet<DiagnosticData>>();
            _mockContext.Setup(c => c.DiagnosticData).Returns(mockSet.Object);

            // Act
            var result = await _diagnosticDataService.UpdateDiagnosticDataAsync(diagnosticData);

            // Assert
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
            Assert.Equal(diagnosticData, result);
        }

        [Fact]
        public async Task DeleteDiagnosticDataAsync_ShouldDeleteData()
        {
            // Arrange
            var id = 1;
            var diagnosticData = new DiagnosticData { Id = id };

            var mockSet = new Mock<DbSet<DiagnosticData>>();
            _mockContext.Setup(c => c.DiagnosticData).Returns(mockSet.Object);
            mockSet.Setup(m => m.FindAsync(id)).ReturnsAsync(diagnosticData);

            // Act
            var result = await _diagnosticDataService.DeleteDiagnosticDataAsync(id);

            // Assert
            mockSet.Verify(m => m.Remove(diagnosticData), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteDiagnosticDataAsync_ShouldReturnFalseWhenNotFound()
        {
            // Arrange
            var id = 1;
            var mockSet = new Mock<DbSet<DiagnosticData>>();
            _mockContext.Setup(c => c.DiagnosticData).Returns(mockSet.Object);
            mockSet.Setup(m => m.FindAsync(id)).ReturnsAsync((DiagnosticData)null);

            // Act
            var result = await _diagnosticDataService.DeleteDiagnosticDataAsync(id);

            // Assert
            mockSet.Verify(m => m.Remove(It.IsAny<DiagnosticData>()), Times.Never());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Never());
            Assert.False(result);
        }
    }
}
