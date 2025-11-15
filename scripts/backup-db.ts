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

async function backupDatabase() {
  try {
    console.log('📦 Database backup boshlandi...')
    
    // Backup SQLite fayl
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const backupDir = path.join(process.cwd(), 'backups')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(backupDir, `backup-${timestamp}.db`)
    
    // Backup papkasini yaratish
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    // Database faylini nusxalash
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath)
      console.log(`✅ Database backup yaratildi: ${backupPath}`)
    } else {
      console.log('⚠️  Database fayli topilmadi')
    }
    
    // Ma'lumotlarni JSON formatida export qilish
    try {
      const patients = await prisma.patient.findMany({
        include: {
          visits: true,
        },
      })
      
      const jsonBackupPath = path.join(backupDir, `data-${timestamp}.json`)
      fs.writeFileSync(
        jsonBackupPath,
        JSON.stringify(patients, null, 2),
        'utf-8'
      )
      
      console.log(`✅ Ma'lumotlar JSON formatida saqlandi: ${jsonBackupPath}`)
      console.log(`📊 Jami ${patients.length} ta bemor ma'lumotlari saqlandi`)
    } catch (dbError: any) {
      console.log(`⚠️  JSON export xatosi: ${dbError.message}`)
      console.log('⚠️  Faqat database fayli backup qilindi')
    }
    
    // Eski backup'larni o'chirish (30 kundan eski)
    const files = fs.readdirSync(backupDir)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    
    files.forEach((file) => {
      const filePath = path.join(backupDir, file)
      const stats = fs.statSync(filePath)
      if (stats.mtimeMs < thirtyDaysAgo) {
        fs.unlinkSync(filePath)
        console.log(`🗑️  Eski backup o'chirildi: ${file}`)
      }
    })
    
    await prisma.$disconnect()
    console.log('✅ Backup muvaffaqiyatli yakunlandi!')
  } catch (error: any) {
    console.error('❌ Backup xatosi:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

backupDatabase()

