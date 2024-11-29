import { useEffect } from 'react'
import { installViewer } from '@ohif/viewer'

export default function OHIFViewer({ studyInstanceUID }) {
  useEffect(() => {
    const containerId = 'ohif-viewer-container'
    const ohifViewerConfig = {
      // Konfigurace OHIF Vieweru
      routerBasename: '/viewer',
      servers: {
        dicomWeb: [
          {
            name: 'Supabase DICOM',
            wadoUriRoot: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dicom`,
            qidoRoot: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/dicom_studies`,
            wadoRoot: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dicom`,
            qidoSupportsIncludeField: true,
            imageRendering: 'wadors',
            thumbnailRendering: 'wadors',
          },
        ],
      },
    }

    installViewer(
      ohifViewerConfig,
      containerId
    )

    return () => {
      // Cleanup OHIF Viewer
      const container = document.getElementById(containerId)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [studyInstanceUID])

  return <div id="ohif-viewer-container" style={{ height: '500px' }} />
}

