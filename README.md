# Dental Clinic Patient Registration System

A production-ready patient registration system built with Next.js (App Router), TypeScript, Prisma, and PostgreSQL.

## Features

- Patient registration with validation
- Patient listing with pagination and search
- Patient detail view and update
- Visit registration (increments visit count)
- Accessible UI with Tailwind CSS
- Type-safe API with Zod validation
- Comprehensive error handling

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/stom_register?schema=public"
   ```
   
   Replace `user`, `password`, `localhost`, `5432`, and `stom_register` with your actual PostgreSQL credentials and database name.

3. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## API Endpoints

### Create Patient
```bash
POST /api/patients
Content-Type: application/json

{
  "fullName": "John Doe",
  "birthDate": "1990-01-15",
  "address": "123 Main Street, City, Country"
}
```

### Get All Patients (with pagination and search)
```bash
GET /api/patients?page=1&limit=10&search=John
```

### Get Single Patient
```bash
GET /api/patients/:id
```

### Update Patient
```bash
PUT /api/patients/:id
Content-Type: application/json

{
  "fullName": "John Smith",
  "birthDate": "1990-01-15",
  "address": "456 Oak Avenue, City, Country"
}
```

### Register Visit
```bash
POST /api/patients/:id/visit
```

## Example cURL Commands

### Create a patient
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Doe",
    "birthDate": "1985-05-20",
    "address": "789 Elm Street, Springfield, IL"
  }'
```

### Get all patients
```bash
curl http://localhost:3000/api/patients?page=1&limit=10
```

### Get patients with search
```bash
curl "http://localhost:3000/api/patients?page=1&limit=10&search=Jane"
```

### Get single patient
```bash
curl http://localhost:3000/api/patients/{patient-id}
```

### Update patient
```bash
curl -X PUT http://localhost:3000/api/patients/{patient-id} \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "address": "789 Elm Street, Updated City, IL"
  }'
```

### Register visit
```bash
curl -X POST http://localhost:3000/api/patients/{patient-id}/visit
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Database Management

### Prisma Studio (Database GUI)
```bash
npm run db:studio
```

### Create a new migration
```bash
npm run db:migrate
```

### Generate Prisma Client
```bash
npm run db:generate
```

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── patients/
│   │       ├── route.ts              # POST, GET /api/patients
│   │       └── [id]/
│   │           ├── route.ts          # GET, PUT /api/patients/:id
│   │           └── visit/
│   │               └── route.ts      # POST /api/patients/:id/visit
│   ├── patients/
│   │   └── page.tsx                  # Patients page (frontend)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── prisma.ts                     # Prisma client instance
│   └── validations.ts                # Zod validation schemas
├── types/
│   └── api.ts                        # TypeScript type definitions
├── prisma/
│   └── schema.prisma                 # Prisma schema
└── __tests__/
    └── api/                          # Test files
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Zod** - Schema validation
- **SWR** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Jest** - Testing framework

## License

MIT
