import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/types/api';

interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  resetOnSuccess?: boolean;
}

export function useFormSubmit<T, D = unknown>(
  submitFn: (data: D) => Promise<T>,
  options: UseFormSubmitOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const {
    onSuccess,
    onError,
    successMessage = 'Změny byly úspěšně uloženy',
    resetOnSuccess = true,
  } = options;

  const handleSubmit = async (formData: D) => {
    try {
      setLoading(true);
      const result = await submitFn(formData);
      
      toast({
        title: 'Úspěch',
        description: successMessage,
      });

      onSuccess?.(result);
      return result;
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Došlo k neočekávané chybě');
      
      toast({
        variant: 'destructive',
        title: 'Chyba',
        description: error.message,
      });

      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
  };
}
