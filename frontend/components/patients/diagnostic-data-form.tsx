'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { StudySchema } from '@/lib/validation';
import { useZodForm } from '@/lib/form-utils';

interface DiagnosticDataFormProps {
  patientId: string;
  onSuccess?: () => void;
  initialData?: Partial<z.infer<typeof StudySchema>>;
}

export function DiagnosticDataForm({
  patientId,
  onSuccess,
  initialData,
}: DiagnosticDataFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const form = useZodForm(StudySchema, {
    defaultValues: {
      patientId: patientId,
      studyType: initialData?.studyType || '',
      date: initialData?.date || new Date(),
      description: initialData?.description || '',
      results: initialData?.results || '',
    },
  });

  async function onSubmit(values: z.infer<typeof StudySchema>) {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from('diagnostic_data').upsert({
        ...values,
        patient_id: patientId,
        doctor_id: user?.id,
        id: initialData?.id,
      });

      if (error) throw error;

      toast.success(
        initialData ? 'Data byla aktualizována' : 'Data byla přidána'
      );
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error('Chyba při ukládání dat');
      console.error('Error saving diagnostic data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="studyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typ vyšetření</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte typ vyšetření" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CT">CT</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                    <SelectItem value="RTG">RTG</SelectItem>
                    <SelectItem value="Ultrazvuk">Ultrazvuk</SelectItem>
                    <SelectItem value="Laboratorní test">Laboratorní test</SelectItem>
                    <SelectItem value="Jiné">Jiné</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datum vyšetření</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    value={field.value instanceof Date 
                      ? field.value.toISOString().split('T')[0] 
                      : field.value || ''
                    }
                    onChange={(e) => {
                      const dateValue = e.target.value 
                        ? new Date(e.target.value) 
                        : undefined;
                      field.onChange(dateValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Popis vyšetření</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Podrobnosti k vyšetření" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="results"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Výsledky</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Interpretace a závěry vyšetření" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Ukládání...' : 'Uložit vyšetření'}
        </Button>
      </form>
    </Form>
  );
}
