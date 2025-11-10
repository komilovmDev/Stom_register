import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load environment variables
config()

const prisma = new PrismaClient()

const patients = [
  {
    fullName: 'Ali Valiyev',
    birthDate: new Date('1985-03-15'),
    address: 'Toshkent shahri, Yunusobod tumani, Navoiy ko\'chasi 12-uy',
    visitCount: 5,
  },
  {
    fullName: 'Dilshoda Karimova',
    birthDate: new Date('1992-07-22'),
    address: 'Toshkent shahri, Chilonzor tumani, Bunyodkor ko\'chasi 45-uy',
    visitCount: 3,
  },
  {
    fullName: 'Otabek Toshmatov',
    birthDate: new Date('1988-11-08'),
    address: 'Toshkent shahri, Mirzo Ulug\'bek tumani, Amir Temur ko\'chasi 78-uy',
    visitCount: 8,
  },
  {
    fullName: 'Gulnora Rahimova',
    birthDate: new Date('1995-01-30'),
    address: 'Toshkent shahri, Shayxontohur tumani, Navbahor ko\'chasi 23-uy',
    visitCount: 2,
  },
  {
    fullName: 'Javohir Ismoilov',
    birthDate: new Date('1990-05-12'),
    address: 'Toshkent shahri, Sergeli tumani, Mustaqillik ko\'chasi 56-uy',
    visitCount: 6,
  },
  {
    fullName: 'Madina Yusupova',
    birthDate: new Date('1993-09-18'),
    address: 'Toshkent shahri, Olmazor tumani, Farobiy ko\'chasi 34-uy',
    visitCount: 4,
  },
  {
    fullName: 'Sardor Qodirov',
    birthDate: new Date('1987-12-25'),
    address: 'Toshkent shahri, Yakkasaroy tumani, Fidokor ko\'chasi 67-uy',
    visitCount: 7,
  },
  {
    fullName: 'Zarina Xasanova',
    birthDate: new Date('1994-04-05'),
    address: 'Toshkent shahri, Uchtepa tumani, Bobur ko\'chasi 89-uy',
    visitCount: 1,
  },
  {
    fullName: 'Farrux Abdullayev',
    birthDate: new Date('1989-08-14'),
    address: 'Toshkent shahri, Bektemir tumani, Alisher Navoiy ko\'chasi 12-uy',
    visitCount: 9,
  },
  {
    fullName: 'Nigora Tursunova',
    birthDate: new Date('1991-06-20'),
    address: 'Toshkent shahri, Yangihayot tumani, Mustaqillik ko\'chasi 45-uy',
    visitCount: 5,
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing patients (optional - comment out if you want to keep existing data)
  // await prisma.patient.deleteMany()
  // console.log('🗑️  Cleared existing patients')

  // Create patients
  for (const patient of patients) {
    const created = await prisma.patient.create({
      data: patient,
    })
    console.log(`✅ Created patient: ${created.fullName}`)
  }

  console.log('✨ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

