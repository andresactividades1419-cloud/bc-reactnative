// src/schemas/eventSchema.ts
// Esquema de validación estricta con Zod para el dominio Productora de Eventos.
// El tipo TypeScript se infiere automáticamente para evitar duplicaciones.

import { z } from 'zod';

export const EVENT_CATEGORIES = [
  'Concierto',
  'Boda',
  'Conferencia',
  'Festival',
  'Corporativo',
] as const;

export const eventSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre de la producción debe tener al menos 3 caracteres')
    .max(80, 'El nombre no puede exceder 80 caracteres'),

  client: z
    .string()
    .min(2, 'El cliente o empresa contratante es obligatorio')
    .max(60, 'El cliente no puede exceder 60 caracteres'),

  category: z.enum(EVENT_CATEGORIES, {
    message: 'Selecciona una categoría válida (Concierto, Boda, Conferencia, Festival, Corporativo)',
  }),

  date: z
    .string()
    .min(5, 'La fecha del evento es obligatoria (ej: 2026-11-25)')
    .max(30, 'Formato de fecha inválido'),

  location: z
    .string()
    .min(3, 'La locación o recinto es obligatoria')
    .max(80, 'La locación no puede exceder 80 caracteres'),

  budget: z.coerce
    .number()
    .positive('El presupuesto debe ser mayor a $ 0 COP')
    .min(100000, 'El presupuesto mínimo para una producción es de $ 100.000 COP'),

  capacity: z.coerce
    .number()
    .int('El aforo debe ser un número entero')
    .min(1, 'El aforo debe ser de al menos 1 asistente'),

  description: z
    .string()
    .max(500, 'La descripción técnica no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

// Inferencia automática del tipo TypeScript — Garantiza sincronización de tipos y runtime
export type EventFormData = z.infer<typeof eventSchema>;
export type EventFormInput = z.input<typeof eventSchema>;
