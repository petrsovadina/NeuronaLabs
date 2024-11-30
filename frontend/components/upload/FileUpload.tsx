import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { File, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface FileUploadProps {
  patientId: string;
  onUploadComplete?: (urls: string[]) => void;
}

export function FileUpload({ patientId, onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!selectedFiles.length) return;

    setUploading(true);
    setProgress(0);

    try {
      const uploadPromises = selectedFiles.map(async file => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${patientId}/${Math.random()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('dicom-studies')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            onUploadProgress: progress => {
              const percent = (progress.loaded / progress.total) * 100;
              setProgress(percent);
            },
          });

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('dicom-studies').getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);

      toast({
        title: 'Upload Complete',
        description: `Successfully uploaded ${selectedFiles.length} file(s)`,
      });

      onUploadComplete?.(urls);
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your files.',
        variant: 'destructive',
      });
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">DICOM files (DCM, DCM30)</p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            accept=".dcm,.DCM"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <File className="w-4 h-4" />
                <span className="text-sm">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {progress > 0 && <Progress value={progress} className="w-full" />}

      <div className="flex justify-end">
        <Button
          onClick={uploadFiles}
          disabled={uploading || selectedFiles.length === 0}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </div>
    </div>
  );
}
