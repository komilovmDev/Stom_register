import { PrismaClient as SQLitePrisma } from '@prisma/client'
import { PrismaClient as PostgresPrisma } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

config()

// SQLite connection
const sqliteDbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const sqliteUrl = `file:${sqliteDbPath}`

// PostgreSQL connection (Supabase)
const postgresUrl = process.env.DATABASE_URL

if (!postgresUrl) {
  console.error('❌ DATABASE_URL topilmadi')
  process.exit(1)
}

async function migrate() {
  const sqlitePrisma = new SQLitePrisma({
    datasources: {
      db: {
        url: sqliteUrl,
      },
    },
  })

  const postgresPrisma = new PostgresPrisma({
    datasources: {
      db: {
        url: postgresUrl,
      },
    },
  })

  try {
    console.log('🔄 SQLite\'dan ma\'lumotlarni o\'qish...')
    
    // SQLite'dan ma'lumotlarni olish
    const patients = await sqlitePrisma.patient.findMany({
      include: {
        visits: {
          orderBy: {
            visitDate: 'desc',
          },
        },
      },
    })

    if (patients.length === 0) {
      console.log('⚠️  SQLite database\'da ma\'lumotlar topilmadi')
      await sqlitePrisma.$disconnect()
      await postgresPrisma.$disconnect()
      return
    }

    console.log(`📊 ${patients.length} ta bemor topildi`)
    const totalVisits = patients.reduce((sum, p) => sum + p.visits.length, 0)
    console.log(`📊 ${totalVisits} ta kelish topildi`)

    console.log('\n🔄 Supabase\'ga ko\'chirish...')

    // Supabase'dagi eski ma'lumotlarni o'chirish
    await postgresPrisma.visit.deleteMany()
    await postgresPrisma.patient.deleteMany()

    // Ma'lumotlarni ko'chirish
    for (const patient of patients) {
      await postgresPrisma.patient.create({
        data: {
          id: patient.id,
          fullName: patient.fullName,
          birthDate: patient.birthDate,
          address: patient.address,
          phone: patient.phone,
          visitCount: patient.visitCount,
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt,
          visits: {
            create: patient.visits.map((visit) => ({
              id: visit.id,
              reason: visit.reason,
              visitDate: visit.visitDate,
              createdAt: visit.createdAt,
              updatedAt: visit.updatedAt,
            })),
          },
        },
      })
    }

    console.log(`✅ ${patients.length} ta bemor ko'chirildi`)
    console.log(`✅ ${totalVisits} ta kelish ko'chirildi`)
    console.log('✅ Migration muvaffaqiyatli yakunlandi!')

    await sqlitePrisma.$disconnect()
    await postgresPrisma.$disconnect()
  } catch (error: any) {
    console.error('❌ Migration xatosi:', error.message)
    await sqlitePrisma.$disconnect()
    await postgresPrisma.$disconnect()
    process.exit(1)
  }
}

migrate()

