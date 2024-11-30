import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormProps, useForm } from 'react-hook-form';
import { z } from 'zod';

// Generická funkce pro vytvoření formuláře s Zod validací
export function useZodForm<TSchema extends z.ZodType>(
  schema: TSchema, 
  options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
) {
  return useForm({
    resolver: zodResolver(schema),
    ...options
  });
}

// Pomocná funkce pro zpracování chyb formuláře
export function handleFormError(error: any) {
  console.error('Form validation error:', error);
  // Zde můžete přidat vlastní logiku zpracování chyb, 
  // například zobrazení toast notifikace
}

// Ukázka použití v komponentě
/*
export function LoginForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useZodForm(LoginSchema);

  const onSubmit = (data: Login) => {
    // Logika přihlášení
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, handleFormError)}>
      <input 
        {...register('email')} 
        placeholder="Email" 
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input 
        type="password" 
        {...register('password')} 
        placeholder="Heslo" 
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Přihlásit se</button>
    </form>
  );
}
*/
