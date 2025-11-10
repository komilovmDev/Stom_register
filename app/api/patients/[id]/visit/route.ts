import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createVisitSchema, updateVisitSchema } from '@/lib/validations'
import { z } from 'zod'

const updateVisitCountSchema = z.object({
  visitCount: z.number().int().min(0),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const [visits, total] = await Promise.all([
      prisma.visit.findMany({
        where: { patientId: params.id },
        skip,
        take: limit,
        orderBy: {
          visitDate: 'desc',
        },
      }),
      prisma.visit.count({ where: { patientId: params.id } }),
    ])

    return NextResponse.json({
      visits,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching visits:', error)
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: 'Make sure database is running'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch visits',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = createVisitSchema.parse(body)

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Create visit and increment visit count in a transaction
    const [visit] = await Promise.all([
      prisma.visit.create({
        data: {
          patientId: params.id,
          reason: validatedData.reason,
          visitDate: validatedData.visitDate ? new Date(validatedData.visitDate) : new Date(),
        },
      }),
      prisma.patient.update({
        where: { id: params.id },
        data: {
          visitCount: {
            increment: 1,
          },
        },
      }),
    ])

    return NextResponse.json(visit, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating visit:', error)
    return NextResponse.json(
      { error: 'Failed to register visit' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateVisitCountSchema.parse(body)

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        visitCount: validatedData.visitCount,
      },
    })

    return NextResponse.json(patient)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating visit count:', error)
    return NextResponse.json(
      { error: 'Failed to update visit count' },
      { status: 500 }
    )
  }
}

