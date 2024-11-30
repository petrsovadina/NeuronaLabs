import React, { useEffect, useRef } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';

interface CornerstoneElementProps {
  imageId: string;
  className?: string;
}

export function CornerstoneElement({ imageId, className }: CornerstoneElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Enable the element for use with Cornerstone
    cornerstone.enable(elementRef.current);

    // Load and display the image
    cornerstone.loadImage(imageId).then(image => {
      cornerstone.displayImage(elementRef.current!, image);

      // Enable tools
      cornerstoneTools.init();
      
      // Enable common tools
      const WwwcTool = cornerstoneTools.WwwcTool;
      const PanTool = cornerstoneTools.PanTool;
      const ZoomTool = cornerstoneTools.ZoomTool;
      const LengthTool = cornerstoneTools.LengthTool;
      
      cornerstoneTools.addTool(WwwcTool);
      cornerstoneTools.addTool(PanTool);
      cornerstoneTools.addTool(ZoomTool);
      cornerstoneTools.addTool(LengthTool);
      
      cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
    });

    return () => {
      if (elementRef.current) {
        cornerstone.disable(elementRef.current);
      }
    };
  }, [imageId]);

  return (
    <div
      ref={elementRef}
      className={`cornerstone-element ${className || ''}`}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  );
}
