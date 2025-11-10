import { createPatientSchema, updatePatientSchema } from '@/lib/validations'

describe('Patient Validation Schemas', () => {
  describe('createPatientSchema', () => {
    it('should validate a valid patient data', () => {
      const validData = {
        fullName: 'John Doe',
        birthDate: '1990-01-15',
        address: '123 Main Street, Tashkent',
      }

      const result = createPatientSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject empty full name', () => {
      const invalidData = {
        fullName: '',
        birthDate: '1990-01-15',
        address: '123 Main Street',
      }

      const result = createPatientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Full name is required')
      }
    })

    it('should reject invalid date format', () => {
      const invalidData = {
        fullName: 'John Doe',
        birthDate: '01-15-1990', // Wrong format
        address: '123 Main Street',
      }

      const result = createPatientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid date format')
      }
    })

    it('should reject too long full name', () => {
      const invalidData = {
        fullName: 'A'.repeat(256), // Too long
        birthDate: '1990-01-15',
        address: '123 Main Street',
      }

      const result = createPatientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Full name is too long')
      }
    })

    it('should reject empty address', () => {
      const invalidData = {
        fullName: 'John Doe',
        birthDate: '1990-01-15',
        address: '',
      }

      const result = createPatientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Address is required')
      }
    })
  })

  describe('updatePatientSchema', () => {
    it('should validate partial patient data', () => {
      const validData = {
        fullName: 'Jane Doe',
      }

      const result = updatePatientSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.fullName).toBe('Jane Doe')
      }
    })

    it('should validate empty object (all fields optional)', () => {
      const result = updatePatientSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should validate all fields together', () => {
      const validData = {
        fullName: 'John Smith',
        birthDate: '1985-05-20',
        address: '456 Oak Avenue',
      }

      const result = updatePatientSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid date format in update', () => {
      const invalidData = {
        birthDate: '20-05-1985', // Wrong format
      }

      const result = updatePatientSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})

