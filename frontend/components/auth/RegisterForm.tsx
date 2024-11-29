import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { registerSchema, RegisterInput } from '@/lib/validation/auth';
import { authHelpers } from '@/lib/supabase/authHelpers';

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);

    try {
      const { error } = await authHelpers.signUp(data.email, data.password);

      if (error) {
        toast({
          title: "Chyba registrace",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registrace úspěšná",
          description: "Byl vám zaslán ověřovací email",
        });
        router.push('/login');
      }
    } catch (err) {
      toast({
        title: "Neočekávaná chyba",
        description: "Došlo k chybě při registraci",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registrace</CardTitle>
          <CardDescription>
            Vytvořte si nový účet v systému NeuronaLabs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="vas@email.cz" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heslo</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="********" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potvrzení hesla</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="********" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Accordion type="single" collapsible>
                <AccordionItem value="password-rules">
                  <AccordionTrigger>Pravidla pro heslo</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>Minimálně 8 znaků</li>
                      <li>Alespoň jedno velké písmeno</li>
                      <li>Alespoň jedno malé písmeno</li>
                      <li>Alespoň jedna číslice</li>
                      <li>Alespoň jeden speciální znak</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Registrace...' : 'Zaregistrovat se'}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Již máte účet?{' '}
                  <Link 
                    href="/login" 
                    className="font-medium text-primary hover:text-primary-dark"
                  >
                    Přihlaste se
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
