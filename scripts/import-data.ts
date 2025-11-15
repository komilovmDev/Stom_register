import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { config } from 'dotenv'

// Environment variables'ni yuklash
config()

// SQLite uchun default DATABASE_URL
if (!process.env.DATABASE_URL) {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  process.env.DATABASE_URL = `file:${dbPath}`
}

const prisma = new PrismaClient()

interface ImportData {
  exportDate: string
  totalPatients: number
  totalVisits: number
  patients: Array<{
    id: string
    fullName: string
    birthDate: string
    address: string
    phone: string | null
    visitCount: number
    createdAt: string
    updatedAt: string
    visits: Array<{
      id: string
      reason: string
      visitDate: string
      createdAt: string
    }>
  }>
}

async function importData(filePath?: string) {
  try {
    // Agar fayl yo'li berilmasa, exports papkasidan eng yangisini topish
    let importFilePath = filePath
    
    if (!importFilePath) {
      const exportDir = path.join(process.cwd(), 'exports')
      if (!fs.existsSync(exportDir)) {
        console.error('❌ Exports papkasi topilmadi')
        process.exit(1)
      }
      
      const files = fs
        .readdirSync(exportDir)
        .filter((f) => f.startsWith('patients-export-') && f.endsWith('.json'))
        .sort()
        .reverse()
      
      if (files.length === 0) {
        console.error('❌ Export fayllari topilmadi')
        process.exit(1)
      }
      
      importFilePath = path.join(exportDir, files[0])
      console.log(`📁 Topilgan fayl: ${files[0]}`)
    }
    
    if (!fs.existsSync(importFilePath!)) {
      console.error(`❌ Fayl topilmadi: ${importFilePath}`)
      process.exit(1)
    }
    
    // Ma'lumotlarni o'qish
    const fileContent = fs.readFileSync(importFilePath!, 'utf-8')
    const data: ImportData = JSON.parse(fileContent)
    
    console.log(`📤 Import qilinmoqda: ${importFilePath}`)
    console.log(`📊 ${data.totalPatients} ta bemor`)
    console.log(`📊 ${data.totalVisits} ta kelish`)
    console.log(`📅 Export sanasi: ${new Date(data.exportDate).toLocaleString()}`)
    
    // Tasdiqlash (non-interactive rejimda skip qilish)
    const isNonInteractive = process.env.CI === 'true' || !process.stdin.isTTY
    
    if (!isNonInteractive) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      
      const answer = await new Promise<string>((resolve) => {
        rl.question(
          '\n⚠️  Bu hozirgi ma\'lumotlarni o\'chirib, yangi ma\'lumotlarni import qiladi. Davom etasizmi? (ha/yoq): ',
          resolve
        )
      })
      
      rl.close()
      
      if (answer.toLowerCase() !== 'ha' && answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
        console.log('❌ Import bekor qilindi')
        await prisma.$disconnect()
        process.exit(0)
      }
    } else {
      console.log('⚠️  Non-interactive rejim: ma\'lumotlar avtomatik import qilinadi')
    }
    
    // Ma'lumotlarni import qilish
    console.log('\n🔄 Ma\'lumotlar import qilinmoqda...')
    
    // Eski ma'lumotlarni o'chirish (visits avtomatik o'chiladi cascade tufayli)
    await prisma.visit.deleteMany()
    await prisma.patient.deleteMany()
    
    // Yangi ma'lumotlarni qo'shish
    for (const patientData of data.patients) {
      await prisma.patient.create({
        data: {
          id: patientData.id,
          fullName: patientData.fullName,
          birthDate: new Date(patientData.birthDate),
          address: patientData.address,
          phone: patientData.phone,
          visitCount: patientData.visitCount,
          createdAt: new Date(patientData.createdAt),
          updatedAt: new Date(patientData.updatedAt),
          visits: {
            create: patientData.visits.map((visit) => ({
              id: visit.id,
              reason: visit.reason,
              visitDate: new Date(visit.visitDate),
              createdAt: new Date(visit.createdAt),
            })),
          },
        },
      })
    }
    
    console.log(`✅ ${data.patients.length} ta bemor import qilindi`)
    console.log(`✅ ${data.totalVisits} ta kelish import qilindi`)
    
    await prisma.$disconnect()
    console.log('✅ Import muvaffaqiyatli yakunlandi!')
  } catch (error: any) {
    console.error('❌ Import xatosi:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Command line argument'dan fayl yo'lini olish
const filePath = process.argv[2]
importData(filePath)

