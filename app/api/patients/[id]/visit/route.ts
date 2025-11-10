import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        visitCount: {
          increment: 1,
        },
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

    console.error('Error incrementing visit count:', error)
    return NextResponse.json(
      { error: 'Failed to register visit' },
      { status: 500 }
    )
  }
}

