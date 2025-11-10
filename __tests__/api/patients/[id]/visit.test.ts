import { POST } from '@/app/api/patients/[id]/visit/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    patient: {
      update: jest.fn(),
    },
  },
}))

describe('POST /api/patients/[id]/visit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should increment visit count for a valid patient', async () => {
    const mockPatient = {
      id: 'test-id',
      fullName: 'John Doe',
      birthDate: new Date('1990-01-01'),
      address: '123 Main St',
      visitCount: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prisma.patient.update as jest.Mock).mockResolvedValue({
      ...mockPatient,
      visitCount: 6,
    })

    const request = new NextRequest('http://localhost/api/patients/test-id/visit')
    const response = await POST(request, { params: { id: 'test-id' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.visitCount).toBe(6)
    expect(prisma.patient.update).toHaveBeenCalledWith({
      where: { id: 'test-id' },
      data: {
        visitCount: {
          increment: 1,
        },
      },
    })
  })

  it('should return 404 for non-existent patient', async () => {
    const prismaError = {
      code: 'P2025',
      meta: { cause: 'Record not found' },
    }

    ;(prisma.patient.update as jest.Mock).mockRejectedValue(prismaError)

    const request = new NextRequest('http://localhost/api/patients/non-existent/visit')
    const response = await POST(request, { params: { id: 'non-existent' } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Patient not found')
  })

  it('should return 500 for unexpected errors', async () => {
    ;(prisma.patient.update as jest.Mock).mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost/api/patients/test-id/visit')
    const response = await POST(request, { params: { id: 'test-id' } })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to register visit')
  })
})

