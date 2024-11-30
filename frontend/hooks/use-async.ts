import { useToast } from '@/hooks/use-toast';
import { useCallback, useState } from 'react';

interface UseAsyncOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { toast } = useToast();

  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operace byla úspěšně dokončena',
    onSuccess,
    onError,
  } = options;

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);

      if (showSuccessToast) {
        toast({
          title: 'Úspěch',
          description: successMessage,
        });
      }

      onSuccess?.(result);
      return result;
    } catch (e) {
      const error =
        e instanceof Error ? e : new Error('Došlo k neočekávané chybě');
      setError(error);

      if (showErrorToast) {
        toast({
          variant: 'destructive',
          title: 'Chyba',
          description: error.message,
        });
      }

      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [
    asyncFunction,
    showSuccessToast,
    showErrorToast,
    successMessage,
    onSuccess,
    onError,
    toast,
  ]);

  return {
    execute,
    loading,
    error,
    data,
  };
}
