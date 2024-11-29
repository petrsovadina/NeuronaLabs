using Moq;
using NeuronaLabs.Models;
using NeuronaLabs.Services;
using NeuronaLabs.GraphQL;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuronaLabs.Tests.GraphQL
{
    public class QueryTests
    {
        private readonly Mock<IPatientService> _mockPatientService;
        private readonly Mock<IDiagnosticDataService> _mockDiagnosticDataService;
        private readonly Mock<IDicomStudyService> _mockDicomStudyService;
        private readonly Query _query;

        public QueryTests()
        {
            _mockPatientService = new Mock<IPatientService>();
            _mockDiagnosticDataService = new Mock<IDiagnosticDataService>();
            _mockDicomStudyService = new Mock<IDicomStudyService>();
            _query = new Query(
                _mockPatientService.Object,
                _mockDiagnosticDataService.Object,
                _mockDicomStudyService.Object);
        }

        [Fact]
        public async Task GetPatients_ReturnsAllPatients()
        {
            // Arrange
            var patients = new List<Patient>
            {
                new Patient { Id = 1, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" },
                new Patient { Id = 2, Name = "Jane Doe", Gender = "Female", LastDiagnosis = "Healthy" }
            };

            _mockPatientService.Setup(s => s.GetAllPatientsAsync())
                .ReturnsAsync(patients);

            // Act
            var result = await _query.GetPatients();

            // Assert
            Assert.Equal(2, result.Count());
            _mockPatientService.Verify(s => s.GetAllPatientsAsync(), Times.Once);
        }

        [Fact]
        public async Task GetDiagnosticDataForPatient_ReturnsDiagnosticData()
        {
            // Arrange
            int patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" };
            var diagnosticData = new List<DiagnosticData>
            {
                new DiagnosticData { 
                    Id = 1, 
                    PatientId = patientId,
                    Patient = patient,
                    DiagnosisType = "EEG",
                    Description = "Normal EEG findings"
                },
                new DiagnosticData { 
                    Id = 2, 
                    PatientId = patientId,
                    Patient = patient,
                    DiagnosisType = "MRI",
                    Description = "Normal MRI findings"
                }
            };

            _mockDiagnosticDataService.Setup(s => s.GetDiagnosticDataByPatientIdAsync(patientId))
                .ReturnsAsync(diagnosticData);

            // Act
            var result = await _query.GetDiagnosticDataForPatient(patientId);

            // Assert
            Assert.Equal(2, result.Count());
            _mockDiagnosticDataService.Verify(s => s.GetDiagnosticDataByPatientIdAsync(patientId), Times.Once);
        }

        [Fact]
        public async Task GetDicomStudiesForPatient_ReturnsDicomStudies()
        {
            // Arrange
            int patientId = 1;
            var patient = new Patient { Id = patientId, Name = "John Doe", Gender = "Male", LastDiagnosis = "Healthy" };
            var dicomStudies = new List<DicomStudy>
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
            };

            _mockDicomStudyService.Setup(s => s.GetDicomStudiesByPatientIdAsync(patientId))
                .ReturnsAsync(dicomStudies);

            // Act
            var result = await _query.GetDicomStudiesForPatient(patientId);

            // Assert
            Assert.Equal(2, result.Count());
            _mockDicomStudyService.Verify(s => s.GetDicomStudiesByPatientIdAsync(patientId), Times.Once);
        }
    }
}
