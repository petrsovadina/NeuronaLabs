import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Patient, PatientFormData } from '@/types/patient';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Jméno musí mít alespoň 2 znaky' }),
  dateOfBirth: z.string().min(1, { message: 'Datum narození je povinné' }),
  gender: z.enum(['male', 'female', 'other'], { 
    required_error: 'Pohlaví je povinné' 
  }),
  lastDiagnosis: z.string().optional(),
});

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: PatientFormData) => Promise<void>;
}

export default function PatientForm({ patient, onSubmit }: PatientFormProps) {
  const { toast } = useToast();
  const form = useForm<PatientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient?.name || '',
      dateOfBirth: patient?.dateOfBirth || '',
      gender: patient?.gender || 'other',
      lastDiagnosis: patient?.lastDiagnosis || '',
    },
  });

  const handleSubmit = async (values: PatientFormData) => {
    try {
      await onSubmit(values);
      toast({
        title: 'Úspěch',
        description: patient 
          ? 'Pacient byl úspěšně aktualizován' 
          : 'Nový pacient byl úspěšně přidán',
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jméno</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Datum narození</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pohlaví</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte pohlaví" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Muž</SelectItem>
                  <SelectItem value="female">Žena</SelectItem>
                  <SelectItem value="other">Jiné</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastDiagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poslední diagnóza</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {patient ? 'Aktualizovat pacienta' : 'Přidat pacienta'}
        </Button>
      </form>
    </Form>
  );
}
