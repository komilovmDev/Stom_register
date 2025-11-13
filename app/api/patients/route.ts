import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPatientSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPatientSchema.parse(body)

    // Create patient and initial visit in a transaction
    const [patient] = await Promise.all([
      prisma.patient.create({
        data: {
          fullName: validatedData.fullName,
          birthDate: new Date(validatedData.birthDate),
          address: validatedData.address,
          phone: validatedData.phone,
          visitCount: 1, // Set initial visit count
          visits: {
            create: {
              reason: 'Ro\'yxatdan o\'tish / Birinchi konsultatsiya',
              visitDate: new Date(),
            },
          },
        },
        include: {
          visits: {
            orderBy: {
              visitDate: 'desc',
            },
            take: 1,
          },
        },
      }),
    ])

    return NextResponse.json(patient, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating patient:', error)
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      return NextResponse.json(
        { 
          error: 'Database connection failed. Please check your DATABASE_URL in .env file',
          details: 'Make sure PostgreSQL is running and DATABASE_URL is correctly configured'
        },
        { status: 503 }
      )
    }
    
    if (error.code === 'P1017' || error.message?.includes('Connection closed')) {
      return NextResponse.json(
        { 
          error: 'Database connection closed',
          details: 'Please check your database connection settings'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create patient',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            {
              fullName: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
            {
              address: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {}

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          visits: {
            orderBy: {
              visitDate: 'desc',
            },
            take: 3, // Get last 3 visits for each patient
          },
        },
      }),
      prisma.patient.count({ where }),
    ])

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching patients:', error)
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      return NextResponse.json(
        { 
          error: 'Database connection failed. Please check your DATABASE_URL in .env file',
          details: 'Make sure PostgreSQL is running and DATABASE_URL is correctly configured'
        },
        { status: 503 }
      )
    }
    
    if (error.code === 'P1017' || error.message?.includes('Connection closed')) {
      return NextResponse.json(
        { 
          error: 'Database connection closed',
          details: 'Please check your database connection settings'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch patients',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

