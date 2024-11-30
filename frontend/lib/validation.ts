import { z } from 'zod';

// Validační schéma pro pacienta
export const PatientSchema = z.object({
  firstName: z.string()
    .min(2, { message: "Jméno musí mít alespoň 2 znaky" })
    .max(50, { message: "Jméno nesmí být delší než 50 znaků" })
    .regex(/^[A-Za-zÁ-Žá-ž\s-]+$/, { message: "Jméno obsahuje nepovolené znaky" }),
  lastName: z.string()
    .min(2, { message: "Příjmení musí mít alespoň 2 znaky" })
    .max(50, { message: "Příjmení nesmí být delší než 50 znaků" })
    .regex(/^[A-Za-zÁ-Žá-ž\s-]+$/, { message: "Příjmení obsahuje nepovolené znaky" }),
  email: z.string()
    .email({ message: "Neplatný formát emailu" })
    .max(100, { message: "Email je příliš dlouhý" }),
  birthDate: z.date()
    .max(new Date(), { message: "Datum narození nesmí být v budoucnosti" })
    .optional(),
  gender: z.enum(['male', 'female', 'other'], { 
    message: "Neplatná hodnota pohlaví" 
  }).optional(),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Neplatný formát telefonu" })
    .optional(),
  address: z.string()
    .max(200, { message: "Adresa je příliš dlouhá" })
    .optional(),
  insuranceNumber: z.string()
    .regex(/^\d{9,10}$/, { message: "Neplatné číslo pojištěnce" }),
  insuranceCompany: z.enum([
    'VZP', 'ČPZP', 'OZP', 'ZPMV', 'RBP', 'Ostatní'
  ], { message: "Neplatná zdravotní pojišťovna" }),
  medicalHistory: z.string()
    .max(1000, { message: "Zdravotní historie je příliš dlouhá" })
    .optional(),
  notes: z.string()
    .max(500, { message: "Poznámky jsou příliš dlouhé" })
    .optional()
});

// Validační schéma pro přihlašovací formulář
export const LoginSchema = z.object({
  email: z.string()
    .email({ message: "Neplatný formát emailu" })
    .max(100, { message: "Email je příliš dlouhý" }),
  password: z.string()
    .min(1, { message: "Heslo je povinné" })
});

// Validační schéma pro registraci
export const RegisterSchema = z.object({
  firstName: z.string()
    .min(2, { message: "Jméno musí mít alespoň 2 znaky" })
    .max(50, { message: "Jméno nesmí být delší než 50 znaků" })
    .regex(/^[A-Za-zÁ-Žá-ž\s-]+$/, { message: "Jméno obsahuje nepovolené znaky" }),
  lastName: z.string()
    .min(2, { message: "Příjmení musí mít alespoň 2 znaky" })
    .max(50, { message: "Příjmení nesmí být delší než 50 znaků" })
    .regex(/^[A-Za-zÁ-Žá-ž\s-]+$/, { message: "Příjmení obsahuje nepovolené znaky" }),
  email: z.string()
    .email({ message: "Neplatný formát emailu" })
    .max(100, { message: "Email je příliš dlouhý" }),
  password: z.string()
    .min(1, { message: "Heslo je povinné" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hesla se neshodují",
  path: ["confirmPassword"]
});

// Validační schéma pro reset hesla
export const ResetPasswordSchema = z.object({
  email: z.string()
    .email({ message: "Neplatný formát emailu" })
    .max(100, { message: "Email je příliš dlouhý" })
});

// Validační schéma pro vyšetření/studii
export const StudySchema = z.object({
  patientId: z.string().uuid({ message: "Neplatné ID pacienta" }),
  studyType: z.enum([
    'CT', 'MRI', 'RTG', 'Ultrazvuk', 
    'Laboratorní test', 'Jiné'
  ], { message: "Neplatný typ vyšetření" }),
  description: z.string()
    .max(1000, { message: "Popis vyšetření je příliš dlouhý" })
    .optional(),
  date: z.date()
    .max(new Date(), { message: "Datum vyšetření nesmí být v budoucnosti" }),
  results: z.string()
    .max(2000, { message: "Výsledky vyšetření jsou příliš dlouhé" })
    .optional()
});

// Exportujeme typy pro TypeScript
export type Patient = z.infer<typeof PatientSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Study = z.infer<typeof StudySchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;

// Přidáme helper funkce pro validaci
export const validateData = {
  patient: (data: unknown) => PatientSchema.safeParse(data),
  login: (data: unknown) => LoginSchema.safeParse(data),
  register: (data: unknown) => RegisterSchema.safeParse(data),
  study: (data: unknown) => StudySchema.safeParse(data),
  resetPassword: (data: unknown) => ResetPasswordSchema.safeParse(data)
};
