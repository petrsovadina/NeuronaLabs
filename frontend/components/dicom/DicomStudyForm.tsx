import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { DicomStudy, DicomStudyFormData } from '@/types/dicom';

const formSchema = z.object({
  patientId: z.string().min(1, { message: 'ID pacienta je povinné' }),
  studyInstanceUID: z.string().min(1, { message: 'Study Instance UID je povinné' }),
  studyDate: z.string().optional(),
  studyDescription: z.string().optional(),
  modality: z.string().optional(),
  numberOfSeries: z.number().int().positive().optional(),
  numberOfInstances: z.number().int().positive().optional(),
});

interface DicomStudyFormProps {
  dicomStudy?: DicomStudy;
  onSubmit: (data: DicomStudyFormData) => Promise<void>;
}

export default function DicomStudyForm({ dicomStudy, onSubmit }: DicomStudyFormProps) {
  const { toast } = useToast();
  const form = useForm<DicomStudyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: dicomStudy?.patientId || '',
      studyInstanceUID: dicomStudy?.studyInstanceUID || '',
      studyDate: dicomStudy?.studyDate || '',
      studyDescription: dicomStudy?.studyDescription || '',
      modality: dicomStudy?.modality || '',
      numberOfSeries: dicomStudy?.numberOfSeries || undefined,
      numberOfInstances: dicomStudy?.numberOfInstances || undefined,
    },
  });

  const handleSubmit = async (values: DicomStudyFormData) => {
    try {
      await onSubmit(values);
      toast({
        title: 'Úspěch',
        description: dicomStudy 
          ? 'DICOM studie byla úspěšně aktualizována' 
          : 'Nová DICOM studie byla úspěšně přidána',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Chyba',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Pacienta</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studyInstanceUID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Study Instance UID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studyDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Datum studie</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studyDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Popis studie</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="modality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modalita</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfSeries"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Počet sérií</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfInstances"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Počet instancí</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {dicomStudy ? 'Aktualizovat DICOM studii' : 'Přidat DICOM studii'}
        </Button>
      </form>
    </Form>
  );
}
