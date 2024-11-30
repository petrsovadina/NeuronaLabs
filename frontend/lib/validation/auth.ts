import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'Neplatný formát emailu' }),
    password: z
      .string()
      .min(8, { message: 'Heslo musí mít minimálně 8 znaků' })
      .regex(/[A-Z]/, {
        message: 'Heslo musí obsahovat alespoň jedno velké písmeno',
      })
      .regex(/[a-z]/, {
        message: 'Heslo musí obsahovat alespoň jedno malé písmeno',
      })
      .regex(/[0-9]/, { message: 'Heslo musí obsahovat alespoň jednu číslici' })
      .regex(/[!@#$%^&*()]/, {
        message: 'Heslo musí obsahovat alespoň jeden speciální znak',
      }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Hesla se neshodují',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
