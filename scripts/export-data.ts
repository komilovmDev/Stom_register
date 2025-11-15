import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Environment variables'ni yuklash
config()

// SQLite uchun default DATABASE_URL
if (!process.env.DATABASE_URL) {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  process.env.DATABASE_URL = `file:${dbPath}`
}

const prisma = new PrismaClient()

async function exportData() {
  try {
    console.log('📤 Ma\'lumotlarni export qilish boshlandi...')
    
    // Barcha bemorlarni olish
    const patients = await prisma.patient.findMany({
      include: {
        visits: {
          orderBy: {
            visitDate: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // Export papkasini yaratish
    const exportDir = path.join(process.cwd(), 'exports')
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true })
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const exportPath = path.join(exportDir, `patients-export-${timestamp}.json`)
    
    // Ma'lumotlarni JSON formatida saqlash
    const exportData = {
      exportDate: new Date().toISOString(),
      totalPatients: patients.length,
      totalVisits: patients.reduce((sum, p) => sum + p.visits.length, 0),
      patients: patients.map((patient) => ({
        id: patient.id,
        fullName: patient.fullName,
        birthDate: patient.birthDate.toISOString(),
        address: patient.address,
        phone: patient.phone,
        visitCount: patient.visitCount,
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
        visits: patient.visits.map((visit) => ({
          id: visit.id,
          reason: visit.reason,
          visitDate: visit.visitDate.toISOString(),
          createdAt: visit.createdAt.toISOString(),
        })),
      })),
    }
    
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2), 'utf-8')
    
    console.log(`✅ Ma'lumotlar export qilindi: ${exportPath}`)
    console.log(`📊 Jami ${patients.length} ta bemor`)
    console.log(`📊 Jami ${exportData.totalVisits} ta kelish`)
    
    await prisma.$disconnect()
    console.log('✅ Export muvaffaqiyatli yakunlandi!')
  } catch (error: any) {
    console.error('❌ Export xatosi:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

exportData()

