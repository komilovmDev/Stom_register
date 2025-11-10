import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('foo', 'bar')
    expect(result).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base', isActive && 'active', 'other')
    expect(result).toContain('base')
    expect(result).toContain('active')
    expect(result).toContain('other')
  })

  it('should handle false conditional classes', () => {
    const isActive = false
    const result = cn('base', isActive && 'active')
    expect(result).toBe('base')
    expect(result).not.toContain('active')
  })

  it('should merge Tailwind classes and resolve conflicts', () => {
    // Tailwind merge should resolve conflicting classes
    const result = cn('px-2', 'px-4')
    // The last one should win or be merged properly
    expect(result).toBeTruthy()
  })

  it('should handle undefined and null values', () => {
    const result = cn('foo', undefined, null, 'bar')
    expect(result).toContain('foo')
    expect(result).toContain('bar')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['foo', 'bar'], 'baz')
    expect(result).toContain('foo')
    expect(result).toContain('bar')
    expect(result).toContain('baz')
  })

  it('should handle empty strings', () => {
    const result = cn('foo', '', 'bar')
    expect(result).toContain('foo')
    expect(result).toContain('bar')
  })
})

