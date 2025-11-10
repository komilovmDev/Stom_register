// Date utility functions test examples

describe('Date Utilities', () => {
  describe('Date formatting', () => {
    it('should format date to YYYY-MM-DD format', () => {
      const date = new Date('2024-01-15')
      const formatted = date.toISOString().split('T')[0]
      expect(formatted).toBe('2024-01-15')
    })

    it('should parse valid date string', () => {
      const dateString = '1990-05-20'
      const date = new Date(dateString)
      expect(date).toBeInstanceOf(Date)
      expect(isNaN(date.getTime())).toBe(false)
    })

    it('should calculate age from birth date', () => {
      const birthDate = new Date('1990-01-15')
      const today = new Date('2024-01-15')
      const age = today.getFullYear() - birthDate.getFullYear()
      expect(age).toBe(34)
    })

    it('should handle invalid date strings', () => {
      const invalidDate = new Date('invalid-date')
      expect(isNaN(invalidDate.getTime())).toBe(true)
    })
  })

  describe('Date validation', () => {
    it('should validate date is in the past', () => {
      const pastDate = new Date('2020-01-01')
      const now = new Date()
      expect(pastDate < now).toBe(true)
    })

    it('should validate date is not in the future', () => {
      const futureDate = new Date('2050-01-01')
      const now = new Date()
      expect(futureDate > now).toBe(true)
    })

    it('should check if date is valid', () => {
      const validDate = new Date('2024-01-15')
      const invalidDate = new Date('invalid')
      
      expect(isNaN(validDate.getTime())).toBe(false)
      expect(isNaN(invalidDate.getTime())).toBe(true)
    })
  })

  describe('Date comparison', () => {
    it('should compare two dates correctly', () => {
      const date1 = new Date('2024-01-15')
      const date2 = new Date('2024-01-20')
      expect(date1 < date2).toBe(true)
      expect(date2 > date1).toBe(true)
    })

    it('should check if dates are equal', () => {
      const date1 = new Date('2024-01-15')
      const date2 = new Date('2024-01-15')
      expect(date1.getTime()).toBe(date2.getTime())
    })
  })
})

