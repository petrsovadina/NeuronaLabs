import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileUpload } from './FileUpload';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onUploadComplete?: (urls: string[]) => void;
}

export function UploadModal({
  isOpen,
  onClose,
  patientId,
  onUploadComplete,
}: UploadModalProps) {
  const handleUploadComplete = (urls: string[]) => {
    onUploadComplete?.(urls);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload DICOM Studies</DialogTitle>
          <DialogDescription>
            Upload DICOM files for this patient. You can select multiple files
            at once.
          </DialogDescription>
        </DialogHeader>
        <FileUpload
          patientId={patientId}
          onUploadComplete={handleUploadComplete}
        />
      </DialogContent>
    </Dialog>
  );
}
