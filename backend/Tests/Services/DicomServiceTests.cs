using System;
using System.IO;
using System.Threading.Tasks;
using Xunit;
using Moq;
using NeuronaLabs.Services.Interfaces;
using NeuronaLabs.Services.Implementation;
using NeuronaLabs.Repositories;
using NeuronaLabs.Models;
using Microsoft.Extensions.Configuration;

namespace NeuronaLabs.Tests.Services
{
    public class DicomServiceTests
    {
        private readonly Mock<IOrthancService> _orthancServiceMock;
        private readonly Mock<IDicomStudyRepository> _dicomStudyRepositoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly DicomService _dicomService;

        public DicomServiceTests()
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
        public async Task ProcessDicomFileAsync_ValidFile_ReturnsStudy()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var mockStream = new MemoryStream(new byte[] { 1, 2, 3 });
            var expectedOrthancId = "test-orthanc-id";

            _orthancServiceMock
                .Setup(x => x.UploadDicomStudyAsync(It.IsAny<Stream>()))
                .ReturnsAsync(expectedOrthancId);

            _dicomStudyRepositoryMock
                .Setup(x => x.AddAsync(It.IsAny<DicomStudy>()))
                .ReturnsAsync((DicomStudy study) => study);

            // Act
            var result = await _dicomService.ProcessDicomFileAsync(mockStream, patientId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(patientId, result.PatientId);
            Assert.Equal(expectedOrthancId, result.OrthancServerId);
            Assert.Equal(StudyStatus.NEW.ToString(), result.Status);

            _orthancServiceMock.Verify(x => x.UploadDicomStudyAsync(It.IsAny<Stream>()), Times.Once);
            _dicomStudyRepositoryMock.Verify(x => x.AddAsync(It.IsAny<DicomStudy>()), Times.Once);
        }

        [Fact]
        public async Task ProcessDicomFileAsync_NullStream_ThrowsArgumentException()
        {
            // Arrange
            var patientId = Guid.NewGuid();

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => 
                _dicomService.ProcessDicomFileAsync(null, patientId));
        }

        [Fact]
        public async Task DeleteDicomStudyAsync_ExistingStudy_DeletesSuccessfully()
        {
            // Arrange
            var studyId = Guid.NewGuid();
            var mockStudy = new DicomStudy 
            { 
                Id = studyId, 
                OrthancServerId = "test-orthanc-id" 
            };

            _dicomStudyRepositoryMock
                .Setup(x => x.GetByIdAsync(studyId))
                .ReturnsAsync(mockStudy);

            _orthancServiceMock
                .Setup(x => x.DeleteStudyAsync(It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            _dicomStudyRepositoryMock
                .Setup(x => x.DeleteAsync(studyId))
                .Returns(Task.CompletedTask);

            // Act
            await _dicomService.DeleteDicomStudyAsync(studyId);

            // Assert
            _orthancServiceMock.Verify(x => x.DeleteStudyAsync(mockStudy.OrthancServerId), Times.Once);
            _dicomStudyRepositoryMock.Verify(x => x.DeleteAsync(studyId), Times.Once);
        }
    }
}
