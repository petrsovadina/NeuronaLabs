using Xunit;
using Moq;
using NeuronaLabs.Services.Interfaces;
using NeuronaLabs.Services.Implementation;
using NeuronaLabs.Models;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace NeuronaLabs.Tests
{
    public class DicomStudyServiceTests
    {
        private readonly Mock<IOrthancService> _orthancServiceMock;
        private readonly Mock<IDicomStudyRepository> _dicomStudyRepositoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly DicomService _dicomService;

        public DicomStudyServiceTests()
        {
            _orthancServiceMock = new Mock<IOrthancService>();
            _dicomStudyRepositoryMock = new Mock<IDicomStudyRepository>();
            _configurationMock = new Mock<IConfiguration>();
            
            _dicomService = new DicomService(
                _orthancServiceMock.Object,
                _dicomStudyRepositoryMock.Object,
                _configurationMock.Object);
        }

        [Fact]
        public async Task GetStudyById_ShouldReturnStudy_WhenStudyExists()
        {
            // Arrange
            var studyId = "test-study-id";
            var expectedStudy = new DicomStudy
            {
                Id = studyId,
                StudyInstanceUid = "1.2.3.4",
                StudyDescription = "Test Study"
            };

            _dicomStudyRepositoryMock
                .Setup(x => x.GetByIdAsync(studyId))
                .ReturnsAsync(expectedStudy);

            // Act
            var result = await _dicomService.GetStudyByIdAsync(studyId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedStudy.Id, result.Id);
            Assert.Equal(expectedStudy.StudyInstanceUid, result.StudyInstanceUid);
            Assert.Equal(expectedStudy.StudyDescription, result.StudyDescription);
        }

        [Fact]
        public async Task GetStudiesByPatientId_ShouldReturnStudies_WhenPatientHasStudies()
        {
            // Arrange
            var patientId = "test-patient-id";
            var expectedStudies = new List<DicomStudy>
            {
                new DicomStudy
                {
                    Id = "study-1",
                    PatientId = patientId,
                    StudyInstanceUid = "1.2.3.4"
                },
                new DicomStudy
                {
                    Id = "study-2",
                    PatientId = patientId,
                    StudyInstanceUid = "5.6.7.8"
                }
            };

            _dicomStudyRepositoryMock
                .Setup(x => x.GetByPatientIdAsync(patientId))
                .ReturnsAsync(expectedStudies);

            // Act
            var result = await _dicomService.GetStudiesByPatientIdAsync(patientId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.All(result, study => Assert.Equal(patientId, study.PatientId));
        }
    }
}
