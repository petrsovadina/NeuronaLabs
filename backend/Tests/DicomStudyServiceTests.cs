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
        private readonly Mock<DbSet<DicomStudy>> _mockSet;
        private readonly DicomStudyService _service;

        public DicomStudyServiceTests()
        {
            _mockContext = new Mock<NeuronaLabsContext>();
            _mockSet = new Mock<DbSet<DicomStudy>>();
            _mockContext.Setup(c => c.DicomStudies).Returns(_mockSet.Object);
            _service = new DicomStudyService(_mockContext.Object);
        }

        [Fact]
        public async Task GetAllDicomStudiesAsync_ReturnsAllStudies()
        {
            // Arrange
            var patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" };
            var studies = new List<DicomStudy>
            {
                new DicomStudy {
                    Id = 1,
                    PatientId = patientId,
                    Patient = patient,
                    StudyInstanceUid = "1.2.3.4.5.1",
                    Modality = "CT"
                },
                new DicomStudy {
                    Id = 2,
                    PatientId = patientId,
                    Patient = patient,
                    StudyInstanceUid = "1.2.3.4.5.2",
                    Modality = "MR"
                }
            }.AsQueryable();

            _mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.Provider).Returns(studies.Provider);
            _mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.Expression).Returns(studies.Expression);
            _mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.ElementType).Returns(studies.ElementType);
            _mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.GetEnumerator()).Returns(studies.GetEnumerator());

            // Act
            var result = await _service.GetAllDicomStudiesAsync();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetDicomStudyByIdAsync_ReturnsStudy()
        {
            // Arrange
            var patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" };
            var study = new DicomStudy
            {
                Id = 1,
                PatientId = patientId,
                Patient = patient,
                StudyInstanceUid = "1.2.3.4.5.1",
                Modality = "CT"
            };

            _mockSet.Setup(m => m.FindAsync(1))
                .ReturnsAsync(study);

            // Act
            var result = await _service.GetDicomStudyByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(study.Id, result.Id);
        }

        [Fact]
        public async Task GetDicomStudiesByPatientIdAsync_ReturnsStudies()
        {
            // Arrange
            var patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" };
            var studies = new List<DicomStudy>
            {
                new DicomStudy {
                    Id = 1,
                    PatientId = patientId,
                    Patient = patient,
                    StudyInstanceUid = "1.2.3.4.5.1",
                    Modality = "CT"
                }
            }.AsQueryable();

            _mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.Provider).Returns(studies.Provider);
            _mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.Expression).Returns(studies.Expression);
            _mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.ElementType).Returns(studies.ElementType);
            _mockSet.As<IQueryable<DicomStudy>>().Setup(m => m.GetEnumerator()).Returns(studies.GetEnumerator());

            // Act
            var result = await _service.GetDicomStudiesByPatientIdAsync(patientId);

            // Assert
            Assert.Single(result);
            Assert.Equal(patientId, result.First().PatientId);
        }

        [Fact]
        public async Task GetStudyMetadataAsync_ReturnsMetadata()
        {
            // Arrange
            var studyId = 1;
            var patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" };
            var study = new DicomStudy
            {
                Id = studyId,
                PatientId = patientId,
                Patient = patient,
                StudyInstanceUid = "1.2.3.4.5.1",
                Modality = "CT"
            };

            _mockSet.Setup(m => m.FindAsync(studyId))
                .ReturnsAsync(study);

            // Act
            var result = await _service.GetStudyMetadataAsync(studyId);

            // Assert
            Assert.NotNull(result);
            Assert.Contains(studyId.ToString(), result);
        }

        [Fact]
        public async Task GetOhifViewerUrlAsync_ReturnsUrl()
        {
            // Arrange
            var studyId = 1;
            var patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" };
            var study = new DicomStudy
            {
                Id = studyId,
                PatientId = patientId,
                Patient = patient,
                StudyInstanceUid = "1.2.3.4.5.1",
                Modality = "CT"
            };

            _mockSet.Setup(m => m.FindAsync(studyId))
                .ReturnsAsync(study);

            // Act
            var result = await _service.GetOhifViewerUrlAsync(studyId);

            // Assert
            Assert.NotNull(result);
            Assert.Contains(studyId.ToString(), result);
        }
    }
}
