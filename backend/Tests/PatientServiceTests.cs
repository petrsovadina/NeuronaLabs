using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using NeuronaLabs.Data;
using NeuronaLabs.Models;
using NeuronaLabs.Repositories;
using NeuronaLabs.Services;
using NeuronaLabs.Services.Implementation;
using NeuronaLabs.Services.Interfaces;
using Xunit;

namespace NeuronaLabs.Tests
{
    public class PatientServiceTests
    {
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly PatientService _patientService;

        public PatientServiceTests()
        {
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _patientService = new PatientService(_patientRepositoryMock.Object);
        }

        [Fact]
        public async Task GetAllPatientsAsync_ReturnsAllPatients()
        {
            // Arrange
            var patients = new List<Patient>
            {
                new Patient { Id = 1, Name = "John Doe", Gender = "Male" },
                new Patient { Id = 2, Name = "Jane Doe", Gender = "Female" }
            };

            _patientRepositoryMock
                .Setup(x => x.GetAllAsync())
                .ReturnsAsync(patients);

            // Act
            var result = await _patientService.GetAllPatientsAsync();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, p => p.Name == "John Doe");
            Assert.Contains(result, p => p.Name == "Jane Doe");
        }

        [Fact]
        public async Task GetPatientByIdAsync_ReturnsPatient_WhenPatientExists()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var expectedPatient = new Patient
            {
                Id = patientId,
                FirstName = "John",
                LastName = "Doe"
            };

            _patientRepositoryMock
                .Setup(x => x.GetByIdAsync(patientId))
                .ReturnsAsync(expectedPatient);

            // Act
            var result = await _patientService.GetPatientByIdAsync(patientId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedPatient.Id, result.Id);
            Assert.Equal(expectedPatient.FirstName, result.FirstName);
            Assert.Equal(expectedPatient.LastName, result.LastName);
        }

        [Fact]
        public async Task CreatePatientAsync_ShouldReturnNewPatient_WhenValidDataProvided()
        {
            // Arrange
            var newPatient = new Patient
            {
                FirstName = "Jane",
                LastName = "Smith",
                DateOfBirth = DateTime.Now.AddYears(-30)
            };

            _patientRepositoryMock
                .Setup(x => x.AddAsync(It.IsAny<Patient>()))
                .ReturnsAsync((Patient patient) => patient);

            // Act
            var result = await _patientService.CreatePatientAsync(newPatient);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(newPatient.FirstName, result.FirstName);
            Assert.Equal(newPatient.LastName, result.LastName);
            Assert.Equal(newPatient.DateOfBirth, result.DateOfBirth);
        }

        [Fact]
        public async Task UpdatePatientAsync_ShouldReturnUpdatedPatient_WhenPatientExists()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var existingPatient = new Patient
            {
                Id = patientId,
                FirstName = "John",
                LastName = "Doe"
            };

            var updatedPatient = new Patient
            {
                Id = patientId,
                FirstName = "Johnny",
                LastName = "Doe"
            };

            _patientRepositoryMock
                .Setup(x => x.GetByIdAsync(patientId))
                .ReturnsAsync(existingPatient);

            _patientRepositoryMock
                .Setup(x => x.UpdateAsync(It.IsAny<Patient>()))
                .ReturnsAsync((Patient patient) => patient);

            // Act
            var result = await _patientService.UpdatePatientAsync(updatedPatient);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(updatedPatient.Id, result.Id);
            Assert.Equal(updatedPatient.FirstName, result.FirstName);
            Assert.Equal(updatedPatient.LastName, result.LastName);
        }

        [Fact]
        public async Task DeletePatientAsync_DeletesPatient()
        {
            // Arrange
            var patient = new Patient { Id = 1, Name = "John Doe" };

            _patientRepositoryMock
                .Setup(x => x.GetByIdAsync(patient.Id))
                .ReturnsAsync(patient);

            // Act
            await _patientService.DeletePatientAsync(patient.Id);

            // Assert
            _patientRepositoryMock.Verify(x => x.DeleteAsync(patient), Times.Once);
        }
    }
}
