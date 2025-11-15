import { z } from 'zod'

export const createPatientSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255, 'Full name is too long'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
  address: z.string().min(1, 'Address is required').max(500, 'Address is too long'),
  phone: z.string().regex(/^\+998\d{9}$/, 'Telefon raqami +998 bilan boshlanishi va 9 ta raqamdan iborat bo\'lishi kerak').optional(),
})

export const updatePatientSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255, 'Full name is too long').optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD').optional(),
  address: z.string().min(1, 'Address is required').max(500, 'Address is too long').optional(),
  phone: z.string().regex(/^\+998\d{9}$/, 'Telefon raqami +998 bilan boshlanishi va 9 ta raqamdan iborat bo\'lishi kerak').optional(),
})

export const createVisitSchema = z.object({
  reason: z.string().min(1, 'Kasallik nomi yoki kelish sababi kiritilishi kerak').max(500, 'Sabab juda uzun'),
  visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/, 'Sana kiritilishi kerak (YYYY-MM-DD yoki YYYY-MM-DDTHH:mm formatida)'),
})

export const updateVisitSchema = z.object({
  reason: z.string().min(1, 'Kasallik nomi yoki kelish sababi kiritilishi kerak').max(500, 'Sabab juda uzun').optional(),
  visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD').optional(),
})

export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>
export type CreateVisitInput = z.infer<typeof createVisitSchema>
export type UpdateVisitInput = z.infer<typeof updateVisitSchema>

