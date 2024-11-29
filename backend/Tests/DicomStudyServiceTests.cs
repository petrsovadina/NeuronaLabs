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
    public class DicomStudyServiceTests
    {
        private readonly Mock<NeuronaLabsContext> _mockContext;
        private readonly DicomStudyService _dicomStudyService;

        public DicomStudyServiceTests()
        {
            _mockContext = new Mock<NeuronaLabsContext>();
            _dicomStudyService = new DicomStudyService(_mockContext.Object);
        }

        [Fact]
        public async Task GetDicomStudiesForPatientAsync_ShouldReturnPatientStudies()
        {
            // Arrange
            var patientId = 1;
            var studies = new List<DicomStudy>
            {
                new DicomStudy { StudyInstanceUid = "1.2.3", PatientId = patientId, Modality = "CT" },
                new DicomStudy { StudyInstanceUid = "1.2.4", PatientId = patientId, Modality = "MRI" }
            };

            var mockSet = new Mock<DbSet<DicomStudy>>();
            mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.Provider).Returns(studies.AsQueryable().Provider);
            mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.Expression).Returns(studies.AsQueryable().Expression);
            mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.ElementType).Returns(studies.AsQueryable().ElementType);
            mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.GetEnumerator()).Returns(studies.GetEnumerator());

            _mockContext.Setup(c => c.DicomStudies).Returns(mockSet.Object);

            // Act
            var result = await _dicomStudyService.GetDicomStudiesForPatientAsync(patientId);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, s => s.Modality == "CT");
            Assert.Contains(result, s => s.Modality == "MRI");
        }

        [Fact]
        public async Task GetDicomStudyAsync_ShouldReturnStudy()
        {
            // Arrange
            var studyInstanceUid = "1.2.3";
            var study = new DicomStudy { StudyInstanceUid = studyInstanceUid, Modality = "CT" };

            var mockSet = new Mock<DbSet<DicomStudy>>();
            mockSet.Setup(m => m.FindAsync(studyInstanceUid)).ReturnsAsync(study);
            _mockContext.Setup(c => c.DicomStudies).Returns(mockSet.Object);

            // Act
            var result = await _dicomStudyService.GetDicomStudyAsync(studyInstanceUid);

            // Assert
            Assert.Equal(study, result);
        }

        [Fact]
        public async Task CreateDicomStudyAsync_ShouldAddStudy()
        {
            // Arrange
            var study = new DicomStudy
            {
                StudyInstanceUid = "1.2.3",
                PatientId = 1,
                Modality = "CT",
                StudyDate = DateTime.Now
            };

            var mockSet = new Mock<DbSet<DicomStudy>>();
            _mockContext.Setup(c => c.DicomStudies).Returns(mockSet.Object);

            // Act
            var result = await _dicomStudyService.CreateDicomStudyAsync(study);

            // Assert
            mockSet.Verify(m => m.Add(It.IsAny<DicomStudy>()), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
            Assert.Equal(study, result);
        }

        [Fact]
        public async Task UpdateDicomStudyAsync_ShouldUpdateStudy()
        {
            // Arrange
            var study = new DicomStudy
            {
                StudyInstanceUid = "1.2.3",
                PatientId = 1,
                Modality = "Updated",
                StudyDate = DateTime.Now
            };

            var mockSet = new Mock<DbSet<DicomStudy>>();
            _mockContext.Setup(c => c.DicomStudies).Returns(mockSet.Object);

            // Act
            var result = await _dicomStudyService.UpdateDicomStudyAsync(study);

            // Assert
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
            Assert.Equal(study, result);
        }

        [Fact]
        public async Task DeleteDicomStudyAsync_ShouldDeleteStudy()
        {
            // Arrange
            var studyInstanceUid = "1.2.3";
            var study = new DicomStudy { StudyInstanceUid = studyInstanceUid };

            var mockSet = new Mock<DbSet<DicomStudy>>();
            _mockContext.Setup(c => c.DicomStudies).Returns(mockSet.Object);
            mockSet.Setup(m => m.FindAsync(studyInstanceUid)).ReturnsAsync(study);

            // Act
            var result = await _dicomStudyService.DeleteDicomStudyAsync(studyInstanceUid);

            // Assert
            mockSet.Verify(m => m.Remove(study), Times.Once());
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
            Assert.True(result);
        }

        [Fact]
        public async Task GetStudyMetadataAsync_ShouldReturnMetadata()
        {
            // Arrange
            var studyInstanceUid = "1.2.3";
            var study = new DicomStudy 
            { 
                StudyInstanceUid = studyInstanceUid,
                PatientId = 1,
                Modality = "CT",
                StudyDate = DateTime.Now
            };
            var patient = new Patient { Id = 1, Name = "John Doe" };

            var mockSet = new Mock<DbSet<DicomStudy>>();
            _mockContext.Setup(c => c.DicomStudies).Returns(mockSet.Object);

            var studies = new List<DicomStudy> { study }.AsQueryable();
            mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.Provider).Returns(studies.Provider);
            mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.Expression).Returns(studies.Expression);
            mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.ElementType).Returns(studies.ElementType);
            mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.GetEnumerator()).Returns(studies.GetEnumerator());

            // Act
            var result = await _dicomStudyService.GetStudyMetadataAsync(studyInstanceUid);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(studyInstanceUid, result["studyInstanceUid"]);
            Assert.Equal("CT", result["modality"]);
        }
    }
}
