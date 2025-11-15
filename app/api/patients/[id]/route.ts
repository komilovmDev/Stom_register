import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updatePatientSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const patient = await prisma.patient.findUnique({
      where: { id },
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const body = await request.json()
    const validatedData = updatePatientSchema.parse(body)

    const updateData: any = {}
    if (validatedData.fullName) updateData.fullName = validatedData.fullName
    if (validatedData.birthDate) updateData.birthDate = new Date(validatedData.birthDate)
    if (validatedData.address) updateData.address = validatedData.address
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone

    const patient = await prisma.patient.update({
      where: { id },
      data: updateData,
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

    console.error('Error updating patient:', error)
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    await prisma.patient.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Patient deleted successfully' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    console.error('Error deleting patient:', error)
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    )
  }
}

