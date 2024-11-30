'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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

import { PatientSchema } from '@/lib/validation';
import { useZodForm } from '@/lib/form-utils';

interface PatientFormProps {
  onSuccess?: () => void;
  initialData?: Partial<z.infer<typeof PatientSchema>>;
}

export function PatientForm({ onSuccess, initialData }: PatientFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const form = useZodForm(PatientSchema, {
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      birthDate: initialData?.birthDate || undefined,
      email: initialData?.email || '',
      phoneNumber: initialData?.phoneNumber || '',
      gender: initialData?.gender || '',
      address: initialData?.address || '',
      insuranceNumber: initialData?.insuranceNumber || '',
      insuranceCompany: initialData?.insuranceCompany || '',
      medicalHistory: initialData?.medicalHistory || '',
      notes: initialData?.notes || '',
    },
  });

  async function onSubmit(values: z.infer<typeof PatientSchema>) {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from('patients').upsert({
        ...values,
        doctor_id: user?.id,
        id: initialData?.id,
      });

      if (error) throw error;

      toast.success(
        initialData ? 'Pacient byl aktualizován' : 'Pacient byl přidán'
      );
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error('Chyba při ukládání pacienta');
      console.error('Error saving patient:', error);
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jméno</FormLabel>
                <FormControl>
                  <Input placeholder="Jan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Příjmení</FormLabel>
                <FormControl>
                  <Input placeholder="Novák" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datum narození</FormLabel>
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
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pohlaví</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="vas@email.cz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="+420 123 456 789" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresa</FormLabel>
              <FormControl>
                <Input placeholder="Ulice, město, PSČ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="insuranceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Číslo pojištěnce</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insuranceCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pojišťovna</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte pojišťovnu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="VZP">VZP</SelectItem>
                    <SelectItem value="ČPZP">ČPZP</SelectItem>
                    <SelectItem value="OZP">OZP</SelectItem>
                    <SelectItem value="ZPMV">ZPMV</SelectItem>
                    <SelectItem value="RBP">RBP</SelectItem>
                    <SelectItem value="Ostatní">Ostatní</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="medicalHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zdravotní historie</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Významné zdravotní informace" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poznámky</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Další důležité poznámky" 
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
          {loading ? 'Ukládání...' : 'Uložit pacienta'}
        </Button>
      </form>
    </Form>
  );
}
