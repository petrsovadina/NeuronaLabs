using System;
using System.IO;
using System.Threading.Tasks;
using Xunit;
using Moq;
using NeuronaLabs.Services;
using NeuronaLabs.Repositories;
using NeuronaLabs.Models;

namespace NeuronaLabs.Tests.Services
{
    public class DicomServiceTests
    {
        private readonly Mock<IOrthancService> _mockOrthancService;
        private readonly Mock<IDicomStudyRepository> _mockDicomStudyRepository;
        private readonly DicomService _dicomService;

        public DicomServiceTests()
        {
            _mockOrthancService = new Mock<IOrthancService>();
            _mockDicomStudyRepository = new Mock<IDicomStudyRepository>();
            _dicomService = new DicomService(
                _mockOrthancService.Object, 
                _mockDicomStudyRepository.Object
            );
        }

        [Fact]
        public async Task ProcessDicomFileAsync_ValidFile_ReturnsStudy()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var mockStream = new MemoryStream(new byte[] { 1, 2, 3 });
            var expectedOrthancId = "test-orthanc-id";

            _mockOrthancService
                .Setup(x => x.UploadDicomStudyAsync(It.IsAny<Stream>()))
                .ReturnsAsync(expectedOrthancId);

            _mockDicomStudyRepository
                .Setup(x => x.AddAsync(It.IsAny<DicomStudy>()))
                .ReturnsAsync((DicomStudy study) => study);

            // Act
            var result = await _dicomService.ProcessDicomFileAsync(mockStream, patientId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(patientId, result.PatientId);
            Assert.Equal(expectedOrthancId, result.OrthancServerId);
            Assert.Equal(StudyStatus.NEW.ToString(), result.Status);

            _mockOrthancService.Verify(x => x.UploadDicomStudyAsync(It.IsAny<Stream>()), Times.Once);
            _mockDicomStudyRepository.Verify(x => x.AddAsync(It.IsAny<DicomStudy>()), Times.Once);
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

            _mockDicomStudyRepository
                .Setup(x => x.GetByIdAsync(studyId))
                .ReturnsAsync(mockStudy);

            _mockOrthancService
                .Setup(x => x.DeleteStudyAsync(It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            _mockDicomStudyRepository
                .Setup(x => x.DeleteAsync(studyId))
                .Returns(Task.CompletedTask);

            // Act
            await _dicomService.DeleteDicomStudyAsync(studyId);

            // Assert
            _mockOrthancService.Verify(x => x.DeleteStudyAsync(mockStudy.OrthancServerId), Times.Once);
            _mockDicomStudyRepository.Verify(x => x.DeleteAsync(studyId), Times.Once);
        }
    }
}
