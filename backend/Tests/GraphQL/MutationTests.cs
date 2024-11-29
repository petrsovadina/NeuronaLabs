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
        private readonly Mock<IPatientService> _mockPatientService;
        private readonly Mock<IDiagnosticDataService> _mockDiagnosticDataService;
        private readonly Mock<IDicomStudyService> _mockDicomStudyService;
        private readonly Mutation _mutation;

        public MutationTests()
        {
            _mockPatientService = new Mock<IPatientService>();
            _mockDiagnosticDataService = new Mock<IDiagnosticDataService>();
            _mockDicomStudyService = new Mock<IDicomStudyService>();
            _mutation = new Mutation(
                _mockPatientService.Object,
                _mockDiagnosticDataService.Object,
                _mockDicomStudyService.Object);
        }

        [Fact]
        public async Task AddPatient_ReturnsCreatedPatient()
        {
            // Arrange
            var patient = new Patient { Id = 1, Name = "John Doe", Gender = "Male" };
            _mockPatientService.Setup(s => s.CreatePatientAsync(It.IsAny<Patient>()))
                .ReturnsAsync(patient);

            // Act
            var result = await _mutation.AddPatient(patient);

            // Assert
            Assert.Equal(patient.Id, result.Id);
            Assert.Equal(patient.Name, result.Name);
            _mockPatientService.Verify(s => s.CreatePatientAsync(It.IsAny<Patient>()), Times.Once);
        }

        [Fact]
        public async Task AddDiagnosticData_ReturnsCreatedData()
        {
            // Arrange
            var patient = new Patient { Id = 1, Name = "John Doe" };
            var diagnosticData = new DiagnosticData 
            { 
                Id = 1, 
                Patient = patient,
                DiagnosisType = "Test",
                Description = "Test Description"
            };
            _mockDiagnosticDataService.Setup(s => s.CreateDiagnosticDataAsync(It.IsAny<DiagnosticData>()))
                .ReturnsAsync(diagnosticData);

            // Act
            var result = await _mutation.AddDiagnosticData(diagnosticData);

            // Assert
            Assert.Equal(diagnosticData.Id, result.Id);
            _mockDiagnosticDataService.Verify(s => s.CreateDiagnosticDataAsync(It.IsAny<DiagnosticData>()), Times.Once);
        }

        [Fact]
        public async Task AddDicomStudy_ReturnsCreatedStudy()
        {
            // Arrange
            var patient = new Patient { Id = 1, Name = "John Doe" };
            var dicomStudy = new DicomStudy 
            { 
                Id = 1, 
                Patient = patient,
                Modality = "CT",
                StudyInstanceUid = "1.2.3.4.5.6.7.8.9"
            };
            _mockDicomStudyService.Setup(s => s.CreateDicomStudyAsync(It.IsAny<DicomStudy>()))
                .ReturnsAsync(dicomStudy);

            // Act
            var result = await _mutation.AddDicomStudy(dicomStudy);

            // Assert
            Assert.Equal(dicomStudy.Id, result.Id);
            _mockDicomStudyService.Verify(s => s.CreateDicomStudyAsync(It.IsAny<DicomStudy>()), Times.Once);
        }

        [Fact]
        public async Task DeletePatient_ReturnsTrue()
        {
            // Arrange
            _mockPatientService.Setup(s => s.DeletePatientAsync(It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _mutation.DeletePatient(1);

            // Assert
            Assert.True(result);
            _mockPatientService.Verify(s => s.DeletePatientAsync(1), Times.Once);
        }
    }
}
