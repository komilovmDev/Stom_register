import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateVisitSchema } from '@/lib/validations'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; visitId: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateVisitSchema.parse(body)

    const updateData: any = {}
    if (validatedData.reason) updateData.reason = validatedData.reason
    if (validatedData.visitDate) updateData.visitDate = new Date(validatedData.visitDate)

    const visit = await prisma.visit.update({
      where: { id: params.visitId },
      data: updateData,
    })

    return NextResponse.json(visit)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      )
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating visit:', error)
    return NextResponse.json(
      { error: 'Failed to update visit' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; visitId: string } }
) {
  try {
    // Get visit to check if it exists
    const visit = await prisma.visit.findUnique({
      where: { id: params.visitId },
    })

    if (!visit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      )
    }

    // Delete visit and decrement visit count
    await Promise.all([
      prisma.visit.delete({
        where: { id: params.visitId },
      }),
      prisma.patient.update({
        where: { id: params.id },
        data: {
          visitCount: {
            decrement: 1,
          },
        },
      }),
    ])

    return NextResponse.json({ message: 'Visit deleted successfully' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      )
    }

    console.error('Error deleting visit:', error)
    return NextResponse.json(
      { error: 'Failed to delete visit' },
      { status: 500 }
    )
  }
}

