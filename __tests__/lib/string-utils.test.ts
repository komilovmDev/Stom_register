// String utility functions test examples

describe('String Utilities', () => {
  describe('String validation', () => {
    it('should check if string is not empty', () => {
      const str = 'Hello World'
      expect(str.trim().length > 0).toBe(true)
    })

    it('should check if string is empty', () => {
      const str = '   '
      expect(str.trim().length).toBe(0)
    })

    it('should validate string length', () => {
      const str = 'Test'
      expect(str.length).toBe(4)
      expect(str.length >= 1).toBe(true)
      expect(str.length <= 255).toBe(true)
    })
  })

  describe('String manipulation', () => {
    it('should capitalize first letter', () => {
      const str = 'hello'
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1)
      expect(capitalized).toBe('Hello')
    })

    it('should trim whitespace', () => {
      const str = '  hello world  '
      expect(str.trim()).toBe('hello world')
    })

    it('should split string by delimiter', () => {
      const str = 'John,Doe,30'
      const parts = str.split(',')
      expect(parts).toEqual(['John', 'Doe', '30'])
      expect(parts.length).toBe(3)
    })

    it('should replace text in string', () => {
      const str = 'Hello World'
      const replaced = str.replace('World', 'Universe')
      expect(replaced).toBe('Hello Universe')
    })
  })

  describe('String formatting', () => {
    it('should format full name correctly', () => {
      const firstName = 'John'
      const lastName = 'Doe'
      const fullName = `${firstName} ${lastName}`.trim()
      expect(fullName).toBe('John Doe')
    })

    it('should handle multiple spaces in name', () => {
      const name = 'John    Doe'
      const normalized = name.replace(/\s+/g, ' ')
      expect(normalized).toBe('John Doe')
    })

    it('should extract initials from name', () => {
      const name = 'John Doe'
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
      expect(initials).toBe('JD')
    })
  })

  describe('String search', () => {
    it('should find substring in string', () => {
      const str = 'Hello World'
      expect(str.includes('World')).toBe(true)
      expect(str.includes('Universe')).toBe(false)
    })

    it('should check if string starts with prefix', () => {
      const str = 'Hello World'
      expect(str.startsWith('Hello')).toBe(true)
      expect(str.startsWith('World')).toBe(false)
    })

    it('should check if string ends with suffix', () => {
      const str = 'Hello World'
      expect(str.endsWith('World')).toBe(true)
      expect(str.endsWith('Hello')).toBe(false)
    })
  })
})

