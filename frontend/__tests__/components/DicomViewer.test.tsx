import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DicomViewer } from '@/components/dicom/DicomViewer';
import '@testing-library/jest-dom';

// Mock OHIF Viewer
jest.mock('@ohif/viewer', () => ({
  Viewer: jest.fn().mockImplementation(() => ({
    render: jest.fn().resolvedValue(true)
  })),
  init: jest.fn().mockResolvedValue({})
}));

describe('DicomViewer Component', () => {
  const mockOrthancBaseUrl = 'http://mock-orthanc.local';
  const mockStudyId = 'test-study-123';

  it('renders the viewer container', async () => {
    render(
      <DicomViewer 
        orthancStudyId={mockStudyId} 
        orthancBaseUrl={mockOrthancBaseUrl} 
      />
    );

    // Check for viewer title
    expect(screen.getByText('DICOM Study Viewer')).toBeInTheDocument();

    // Check for control buttons
    expect(screen.getByText('Reset View')).toBeInTheDocument();
    expect(screen.getByText('Toggle Layout')).toBeInTheDocument();

    // Check for viewer container
    const viewerContainer = screen.getByTestId('ohif-viewer-container');
    expect(viewerContainer).toBeInTheDocument();
  });

  it('initializes OHIF Viewer with correct configuration', async () => {
    const { init, Viewer } = require('@ohif/viewer');

    render(
      <DicomViewer 
        orthancStudyId={mockStudyId} 
        orthancBaseUrl={mockOrthancBaseUrl} 
      />
    );

    await waitFor(() => {
      expect(init).toHaveBeenCalledWith(
        expect.objectContaining({
          servers: {
            dicomWeb: [
              expect.objectContaining({
                name: 'Orthanc Server',
                wadoUriRoot: `${mockOrthancBaseUrl}/wado`
              })
            ]
          },
          studyInstanceUid: mockStudyId
        })
      );

      expect(Viewer).toHaveBeenCalledWith(
        expect.objectContaining({
          container: expect.any(HTMLElement),
          mode: 'basic'
        })
      );
    });
  });
});
