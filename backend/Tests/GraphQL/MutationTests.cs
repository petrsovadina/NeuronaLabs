using System;
using System.Threading.Tasks;
using Moq;
using NeuronaLabs.GraphQL;
using NeuronaLabs.Models;
using NeuronaLabs.Services;
using Xunit;

namespace NeuronaLabs.Tests.GraphQL
{
    public class MutationTests
    {
        private readonly Mock<PatientService> _mockPatientService;
        private readonly Mock<DiagnosticDataService> _mockDiagnosticDataService;
        private readonly Mock<DicomStudyService> _mockDicomStudyService;
        private readonly Mutation _mutation;

        public MutationTests()
        {
            _mockPatientService = new Mock<PatientService>();
            _mockDiagnosticDataService = new Mock<DiagnosticDataService>();
            _mockDicomStudyService = new Mock<DicomStudyService>();
            _mutation = new Mutation();
        }

        [Fact]
        public async Task CreatePatient_ShouldCreateAndReturnPatient()
        {
            // Arrange
            var patient = new Patient 
            { 
                Name = "John Doe",
                DateOfBirth = DateTime.Now.AddYears(-30),
                Gender = "Male"
            };

            _mockPatientService.Setup(s => s.CreatePatientAsync(patient))
                .ReturnsAsync(patient);

            // Act
            var result = await _mutation.CreatePatient(patient, _mockPatientService.Object);

            // Assert
            Assert.Equal(patient, result);
            _mockPatientService.Verify(s => s.CreatePatientAsync(patient), Times.Once());
        }

        [Fact]
        public async Task UpdatePatient_ShouldUpdateAndReturnPatient()
        {
            // Arrange
            var patient = new Patient 
            { 
                Id = 1,
                Name = "John Doe Updated",
                DateOfBirth = DateTime.Now.AddYears(-30),
                Gender = "Male"
            };

            _mockPatientService.Setup(s => s.UpdatePatientAsync(patient))
                .ReturnsAsync(patient);

            // Act
            var result = await _mutation.UpdatePatient(patient, _mockPatientService.Object);

            // Assert
            Assert.Equal(patient, result);
            _mockPatientService.Verify(s => s.UpdatePatientAsync(patient), Times.Once());
        }

        [Fact]
        public async Task DeletePatient_ShouldReturnTrue()
        {
            // Arrange
            _mockPatientService.Setup(s => s.DeletePatientAsync(1))
                .ReturnsAsync(true);

            // Act
            var result = await _mutation.DeletePatient(1, _mockPatientService.Object);

            // Assert
            Assert.True(result);
            _mockPatientService.Verify(s => s.DeletePatientAsync(1), Times.Once());
        }

        [Fact]
        public async Task CreateDiagnosticData_ShouldCreateAndReturnData()
        {
            // Arrange
            var diagnosticData = new DiagnosticData 
            { 
                PatientId = 1,
                DiagnosisType = "Test",
                Description = "Test Description",
                Date = DateTime.Now
            };

            _mockDiagnosticDataService.Setup(s => s.CreateDiagnosticDataAsync(diagnosticData))
                .ReturnsAsync(diagnosticData);

            // Act
            var result = await _mutation.CreateDiagnosticData(diagnosticData, _mockDiagnosticDataService.Object);

            // Assert
            Assert.Equal(diagnosticData, result);
            _mockDiagnosticDataService.Verify(s => s.CreateDiagnosticDataAsync(diagnosticData), Times.Once());
        }

        [Fact]
        public async Task UpdateDiagnosticData_ShouldUpdateAndReturnData()
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

            _mockDiagnosticDataService.Setup(s => s.UpdateDiagnosticDataAsync(diagnosticData))
                .ReturnsAsync(diagnosticData);

            // Act
            var result = await _mutation.UpdateDiagnosticData(diagnosticData, _mockDiagnosticDataService.Object);

            // Assert
            Assert.Equal(diagnosticData, result);
            _mockDiagnosticDataService.Verify(s => s.UpdateDiagnosticDataAsync(diagnosticData), Times.Once());
        }

        [Fact]
        public async Task CreateDicomStudy_ShouldCreateAndReturnStudy()
        {
            // Arrange
            var study = new DicomStudy 
            { 
                StudyInstanceUid = "1.2.3",
                PatientId = 1,
                Modality = "CT",
                StudyDate = DateTime.Now
            };

            _mockDicomStudyService.Setup(s => s.CreateDicomStudyAsync(study))
                .ReturnsAsync(study);

            // Act
            var result = await _mutation.CreateDicomStudy(study, _mockDicomStudyService.Object);

            // Assert
            Assert.Equal(study, result);
            _mockDicomStudyService.Verify(s => s.CreateDicomStudyAsync(study), Times.Once());
        }

        [Fact]
        public async Task UpdateDicomStudy_ShouldUpdateAndReturnStudy()
        {
            // Arrange
            var study = new DicomStudy 
            { 
                StudyInstanceUid = "1.2.3",
                PatientId = 1,
                Modality = "Updated",
                StudyDate = DateTime.Now
            };

            _mockDicomStudyService.Setup(s => s.UpdateDicomStudyAsync(study))
                .ReturnsAsync(study);

            // Act
            var result = await _mutation.UpdateDicomStudy(study, _mockDicomStudyService.Object);

            // Assert
            Assert.Equal(study, result);
            _mockDicomStudyService.Verify(s => s.UpdateDicomStudyAsync(study), Times.Once());
        }
    }
}
