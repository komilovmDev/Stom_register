import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load environment variables
config()

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set')
    
    // Try to connect
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Try a simple query
    const count = await prisma.patient.count()
    console.log(`✅ Database is accessible. Current patients count: ${count}`)
    
    await prisma.$disconnect()
    console.log('✅ Connection closed successfully')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Database connection failed!')
    console.error('Error:', error.message)
    
    if (error.code === 'P1001') {
      console.error('\n💡 Solution:')
      console.error('   - Make sure PostgreSQL is running')
      console.error('   - Check your DATABASE_URL in .env file')
      console.error('   - Verify database credentials are correct')
    } else if (error.code === 'P1017') {
      console.error('\n💡 Solution:')
      console.error('   - Database connection was closed')
      console.error('   - Check your database server status')
    } else if (!process.env.DATABASE_URL) {
      console.error('\n💡 Solution:')
      console.error('   - Create a .env file in the root directory')
      console.error('   - Add: DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"')
    }
    
    await prisma.$disconnect()
    process.exit(1)
  }
}

testConnection()

