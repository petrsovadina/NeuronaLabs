import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

interface DicomViewerProps {
  url: string;
}

export function DicomViewer({ url }: DicomViewerProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize OHIF Viewer here
    const initializeViewer = async () => {
      try {
        // Load OHIF Viewer with the DICOM URL
        // This is a placeholder - you'll need to implement the actual OHIF Viewer integration
        setLoading(false);
      } catch (error) {
        console.error('Error initializing DICOM viewer:', error);
        setLoading(false);
      }
    };

    initializeViewer();
  }, [url]);

  if (loading) {
    return (
      <Card className="w-full h-[600px] p-4">
        <Skeleton className="w-full h-full" />
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] p-4">
      <div id="ohif-viewer-container" className="w-full h-full">
        {/* OHIF Viewer will be mounted here */}
        <div className="flex items-center justify-center h-full text-muted-foreground">
          OHIF Viewer Integration Placeholder
        </div>
      </div>
    </Card>
  );
}
