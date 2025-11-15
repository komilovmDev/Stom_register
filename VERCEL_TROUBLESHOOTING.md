# Vercel Deployment Troubleshooting

## Muammo: Faqat Frontend Ishlayapti, Database Ishlamayapti

Agar loyiha Vercel'da deploy qilingan, lekin database connection ishlamayapti, quyidagilarni tekshiring:

## 1. Environment Variables Tekshirish

### Vercel Dashboard'da:

1. **Settings** > **Environment Variables** bo'limiga o'ting
2. Quyidagi variables'lar mavjudligini tekshiring:

#### ✅ Majburiy Variables:

```
DATABASE_URL=postgresql://postgres:MMMM@7654321/.m@db.gbrwmbyqzrfcgyneqzwc.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://gbrwmbyqzrfcgyneqzwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicndtYnlxenJmY2d5bmVxendjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTY1MTksImV4cCI6MjA3ODc3MjUxOX0.kXfj20u76hCt_b7obX4Qtfs3i9ONN1fC9KtYU2AzMb4
```

### ⚠️ Muhim:

- Har bir variable uchun **Production** environment belgilangan bo'lishi kerak
- Variable nomlari to'g'ri bo'lishi kerak (katta-kichik harflarga e'tibor bering)
- Qiymatlar to'g'ri bo'lishi kerak (oraliq bo'shliqlar bo'lmasligi kerak)

## 2. Database Connection Tekshirish

### Browser Console'da:

1. Vercel'da deploy qilingan saytga o'ting
2. Browser Console'ni oching (F12)
3. Network tab'ni oching
4. `/api/patients` endpoint'ini chaqiring
5. Xatolikni tekshiring

### Vercel Function Logs:

1. Vercel Dashboard > **Deployments**
2. Eng so'nggi deployment'ni tanlang
3. **Functions** tab'ni oching
4. API route log'larini tekshiring

## 3. Build Log Tekshirish

1. Vercel Dashboard > **Deployments**
2. Eng so'nggi deployment'ni tanlang
3. **Build Logs** ni oching
4. Quyidagi xatoliklarni qidiring:
   - `DATABASE_URL is not defined`
   - `Prisma Client not generated`
   - `Database connection failed`

## 4. Database Migration Tekshirish

Agar database'da jadval'lar bo'lmasa:

### Variant 1: Supabase Dashboard orqali

1. Supabase Dashboard > **SQL Editor**
2. Quyidagi SQL kodini ishlating:

```sql
-- Patients table
CREATE TABLE IF NOT EXISTS "patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Visits table
CREATE TABLE IF NOT EXISTS "visits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "visits_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS "visits_patientId_idx" ON "visits"("patientId");
```

### Variant 2: Prisma Migration

Local'da migration yarating va Supabase'ga qo'llang:

```bash
npx prisma migrate dev --name init
```

Keyin `prisma/migrations` papkasidagi SQL fayllarni Supabase SQL Editor'da ishlating.

## 5. API Route Test Qilish

Vercel'da deploy qilingan saytda:

1. Browser Console'da:
```javascript
fetch('/api/patients')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

2. Yoki Postman/curl orqali:
```bash
curl https://your-project.vercel.app/api/patients
```

## 6. Redeploy Qilish

Environment variables o'zgartirilgandan keyin:

1. Vercel Dashboard > **Deployments**
2. Eng so'nggi deployment'ni tanlang
3. **...** (three dots) > **Redeploy**
4. Yoki yangi commit push qiling

## 7. Common Xatoliklar va Yechimlar

### Xatolik: "DATABASE_URL is not defined"

**Yechim**: 
- Vercel Dashboard > Settings > Environment Variables
- `DATABASE_URL` qo'shing va Production environment'ni belgilang
- Redeploy qiling

### Xatolik: "Prisma Client not generated"

**Yechim**:
- `package.json`'da `postinstall` script mavjudligini tekshiring
- Build log'larda Prisma generate ishlaganini tekshiring

### Xatolik: "Database connection failed"

**Yechim**:
- `DATABASE_URL` to'g'ri sozlanganini tekshiring
- Supabase database public ekanligini tekshiring
- Database paroli to'g'ri ekanligini tekshiring

### Xatolik: "Table does not exist"

**Yechim**:
- Database migration'ni ishlating (yuqoridagi SQL kod)
- Yoki Prisma migration'ni Supabase'ga qo'llang

## 8. Test Qilish

Deploy'dan keyin:

1. ✅ Homepage ochiladi
2. ✅ Login sahifasi ishlaydi
3. ✅ Doctor account bilan kirish mumkin
4. ✅ `/patients` sahifasi ochiladi
5. ✅ Bemorlar ro'yxati ko'rsatiladi (agar database'da ma'lumot bo'lsa)
6. ✅ Yangi bemor qo'shish mumkin

## 9. Debug Mode

Development'da test qilish:

1. Local'da `.env.local` faylida environment variables'lar borligini tekshiring
2. `npm run dev` ishlayaptimi?
3. Local'da database connection ishlayaptimi?

## 10. Support

Agar muammo davom etsa:

1. Vercel Dashboard > Deployments > Build Logs
2. Vercel Dashboard > Functions > Runtime Logs
3. Browser Console > Network tab
4. Browser Console > Console tab

Barcha xatoliklarni yozib oling va tekshiring.

