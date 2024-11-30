'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CornerstoneElement } from './cornerstone-element';
import {
  ZoomInIcon,
  ZoomOutIcon,
  MoveIcon,
  RulerIcon,
  ContrastIcon,
} from 'lucide-react';

interface DicomViewerProps {
  studyInstanceUid: string;
  seriesInstanceUid: string;
}

export function DicomViewer({ studyInstanceUid, seriesInstanceUid }: DicomViewerProps) {
  const [activeTool, setActiveTool] = useState('Wwwc');
  const [activeView, setActiveView] = useState('axial');

  // Toto by mělo být nahrazeno skutečným načítáním DICOM dat
  const imageId = `wadouri:${process.env.NEXT_PUBLIC_API_URL}/api/dicom/${studyInstanceUid}/${seriesInstanceUid}`;

  const tools = [
    { id: 'Wwwc', icon: <ContrastIcon className="h-4 w-4" />, label: 'Kontrast' },
    { id: 'Pan', icon: <MoveIcon className="h-4 w-4" />, label: 'Posun' },
    { id: 'Zoom', icon: <ZoomInIcon className="h-4 w-4" />, label: 'Zoom' },
    { id: 'Length', icon: <RulerIcon className="h-4 w-4" />, label: 'Měření' },
  ];

  const handleToolChange = (toolId: string) => {
    setActiveTool(toolId);
    // Zde by měla být implementace změny aktivního nástroje v Cornerstone
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>DICOM Prohlížeč</CardTitle>
        <div className="flex space-x-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleToolChange(tool.id)}
            >
              {tool.icon}
              <span className="ml-2">{tool.label}</span>
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList>
            <TabsTrigger value="axial">Axiální</TabsTrigger>
            <TabsTrigger value="sagittal">Sagitální</TabsTrigger>
            <TabsTrigger value="coronal">Koronální</TabsTrigger>
          </TabsList>
          <TabsContent value="axial">
            <div className="aspect-square w-full">
              <CornerstoneElement imageId={imageId} />
            </div>
          </TabsContent>
          <TabsContent value="sagittal">
            <div className="aspect-square w-full">
              <CornerstoneElement imageId={imageId} />
            </div>
          </TabsContent>
          <TabsContent value="coronal">
            <div className="aspect-square w-full">
              <CornerstoneElement imageId={imageId} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
