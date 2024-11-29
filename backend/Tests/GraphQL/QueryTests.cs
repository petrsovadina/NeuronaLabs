using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using NeuronaLabs.GraphQL;
using NeuronaLabs.Models;
using NeuronaLabs.Services;
using Xunit;

namespace NeuronaLabs.Tests.GraphQL
{
    public class QueryTests
    {
        private readonly Mock<PatientService> _mockPatientService;
        private readonly Mock<DiagnosticDataService> _mockDiagnosticDataService;
        private readonly Mock<DicomStudyService> _mockDicomStudyService;
        private readonly Query _query;

        public QueryTests()
        {
            _mockPatientService = new Mock<PatientService>();
            _mockDiagnosticDataService = new Mock<DiagnosticDataService>();
            _mockDicomStudyService = new Mock<DicomStudyService>();
            _query = new Query();
        }

        [Fact]
        public async Task GetPatients_ShouldReturnAllPatients()
        {
            // Arrange
            var patients = new List<Patient>
            {
                new Patient { Id = 1, Name = "John Doe" },
                new Patient { Id = 2, Name = "Jane Doe" }
            };

            _mockPatientService.Setup(s => s.GetPatientsAsync())
                .ReturnsAsync(patients);

            // Act
            var result = await _query.GetPatients(_mockPatientService.Object);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, p => p.Name == "John Doe");
            Assert.Contains(result, p => p.Name == "Jane Doe");
        }

        [Fact]
        public async Task GetPatient_ShouldReturnPatient()
        {
            // Arrange
            var patient = new Patient { Id = 1, Name = "John Doe" };

            _mockPatientService.Setup(s => s.GetPatientAsync(1))
                .ReturnsAsync(patient);

            // Act
            var result = await _query.GetPatient(1, _mockPatientService.Object);

            // Assert
            Assert.Equal(patient, result);
        }

        [Fact]
        public async Task GetDiagnosticDataForPatient_ShouldReturnData()
        {
            // Arrange
            var diagnosticData = new List<DiagnosticData>
            {
                new DiagnosticData { Id = 1, PatientId = 1, DiagnosisType = "Type1" },
                new DiagnosticData { Id = 2, PatientId = 1, DiagnosisType = "Type2" }
            };

            _mockDiagnosticDataService.Setup(s => s.GetDiagnosticDataForPatientAsync(1))
                .ReturnsAsync(diagnosticData);

            // Act
            var result = await _query.GetDiagnosticDataForPatient(1, _mockDiagnosticDataService.Object);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, d => d.DiagnosisType == "Type1");
            Assert.Contains(result, d => d.DiagnosisType == "Type2");
        }

        [Fact]
        public async Task GetDicomStudiesForPatient_ShouldReturnStudies()
        {
            // Arrange
            var studies = new List<DicomStudy>
            {
                new DicomStudy { StudyInstanceUid = "1.2.3", PatientId = 1, Modality = "CT" },
                new DicomStudy { StudyInstanceUid = "1.2.4", PatientId = 1, Modality = "MRI" }
            };

            _mockDicomStudyService.Setup(s => s.GetDicomStudiesForPatientAsync(1))
                .ReturnsAsync(studies);

            // Act
            var result = await _query.GetDicomStudiesForPatient(1, _mockDicomStudyService.Object);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, s => s.Modality == "CT");
            Assert.Contains(result, s => s.Modality == "MRI");
        }

        [Fact]
        public async Task GetDicomStudy_ShouldReturnStudy()
        {
            // Arrange
            var study = new DicomStudy 
            { 
                StudyInstanceUid = "1.2.3", 
                PatientId = 1, 
                Modality = "CT" 
            };

            _mockDicomStudyService.Setup(s => s.GetDicomStudyAsync("1.2.3"))
                .ReturnsAsync(study);

            // Act
            var result = await _query.GetDicomStudy("1.2.3", _mockDicomStudyService.Object);

            // Assert
            Assert.Equal(study, result);
        }
    }
}
