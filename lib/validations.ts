import { z } from 'zod'

export const createPatientSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255, 'Full name is too long'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
  address: z.string().min(1, 'Address is required').max(500, 'Address is too long'),
})

export const updatePatientSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255, 'Full name is too long').optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD').optional(),
  address: z.string().min(1, 'Address is required').max(500, 'Address is too long').optional(),
})

export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>

