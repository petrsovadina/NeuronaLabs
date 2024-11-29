import { useEffect, useRef } from 'react';

interface OHIFViewerProps {
  studyInstanceUID: string;
  height?: string;
  width?: string;
}

export default function OHIFViewer({ 
  studyInstanceUID, 
  height = '600px', 
  width = '100%' 
}: OHIFViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Zde můžete přidat inicializační logiku pro OHIF viewer
    if (iframeRef.current) {
      const viewer = iframeRef.current;
      // Příklad URL pro OHIF viewer
      const viewerUrl = `${process.env.NEXT_PUBLIC_OHIF_VIEWER_URL}/viewer/${studyInstanceUID}`;
      viewer.src = viewerUrl;
    }
  }, [studyInstanceUID]);

  return (
    <div className="w-full">
      <iframe
        ref={iframeRef}
        style={{ width, height }}
        className="border-0"
        title="OHIF Viewer"
      />
    </div>
  );
}
