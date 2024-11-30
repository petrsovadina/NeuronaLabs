import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { format } from 'date-fns';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { UploadModal } from '../upload/UploadModal';

interface DicomStudy {
  id: string;
  created_at: string;
  file_path: string;
  file_size: number;
  study_date?: string;
  study_description?: string;
}

interface DicomStudiesListProps {
  patientId: string;
  studies: DicomStudy[];
  onStudySelect: (study: DicomStudy) => void;
  onStudiesChange: () => void;
}

export function DicomStudiesList({
  patientId,
  studies,
  onStudySelect,
  onStudiesChange,
}: DicomStudiesListProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleDelete = async (study: DicomStudy) => {
    try {
      const { error } = await supabase.storage
        .from('dicom-studies')
        .remove([study.file_path]);

      if (error) throw error;

      toast({
        title: 'Study Deleted',
        description: 'The DICOM study has been successfully deleted.',
      });

      onStudiesChange();
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'There was an error deleting the study.',
        variant: 'destructive',
      });
      console.error('Delete error:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">DICOM Studies</h3>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Study
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Study Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>File Size</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studies.map(study => (
            <TableRow key={study.id}>
              <TableCell>
                {study.study_date
                  ? format(new Date(study.study_date), 'MMM d, yyyy')
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {study.study_description || 'No description'}
              </TableCell>
              <TableCell>{formatFileSize(study.file_size)}</TableCell>
              <TableCell>
                {format(new Date(study.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStudySelect(study)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(study)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {studies.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No DICOM studies found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        patientId={patientId}
        onUploadComplete={() => {
          onStudiesChange();
        }}
      />
    </div>
  );
}
