# Vercel Database Muammosini Tuzatish

## Muammo: Faqat Frontend Ishlayapti, Database Ishlamayapti

## ✅ Tezkor Yechim (3 qadam):

### 1. Environment Variables Tekshirish va Qo'shish

Vercel Dashboard > **Settings** > **Environment Variables**:

Quyidagi 3 ta variable qo'shing yoki tekshiring:

#### 1. DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres:MMMM@7654321/.m@db.gbrwmbyqzrfcgyneqzwc.supabase.co:5432/postgres
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 2. NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://gbrwmbyqzrfcgyneqzwc.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 3. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicndtYnlxenJmY2d5bmVxendjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTY1MTksImV4cCI6MjA3ODc3MjUxOX0.kXfj20u76hCt_b7obX4Qtfs3i9ONN1fC9KtYU2AzMb4
Environment: ✅ Production ✅ Preview ✅ Development
```

**⚠️ MUHIM**: Har bir variable uchun **Production** environment'ni belgilang!

### 2. Database Migration (Jadval'lar Yaratish)

Agar database'da jadval'lar bo'lmasa, Supabase Dashboard'da quyidagi SQL kodni ishlating:

1. Supabase Dashboard > **SQL Editor** ga o'ting
2. Quyidagi SQL kodni copy qiling va ishlating:

```sql
-- Patients jadvali
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

-- Visits jadvali
CREATE TABLE IF NOT EXISTS "visits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "visits_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index yaratish
CREATE INDEX IF NOT EXISTS "visits_patientId_idx" ON "visits"("patientId");
```

3. **RUN** tugmasini bosing

### 3. Redeploy Qilish

Environment variables o'zgartirilgandan keyin:

1. Vercel Dashboard > **Deployments**
2. Eng so'nggi deployment'ni tanlang
3. **...** (uch nuqta) > **Redeploy**
4. Yoki yangi commit push qiling

## 🔍 Tekshirish

Deploy'dan keyin:

1. **Homepage**: `https://your-project.vercel.app` - ochilishini tekshiring
2. **Login**: `/login` - doctor account bilan kirish
3. **Patients**: `/patients` - bemorlar ro'yxati (bo'sh bo'lishi mumkin)
4. **Test**: Yangi bemor qo'shib ko'ring

## ❌ Agar Hali Ham Ishlamasa

### Browser Console'da Tekshirish:

1. Vercel'da deploy qilingan saytga o'ting
2. Browser Console'ni oching (F12)
3. Quyidagi kodni ishlating:

```javascript
// API test
fetch('/api/patients')
  .then(r => r.json())
  .then(data => {
    console.log('✅ API ishlayapti:', data)
  })
  .catch(error => {
    console.error('❌ API xatosi:', error)
  })
```

### Vercel Logs'da Tekshirish:

1. Vercel Dashboard > **Deployments**
2. Eng so'nggi deployment'ni tanlang
3. **Functions** tab'ni oching
4. `/api/patients` function log'larini tekshiring

### Build Log Tekshirish:

1. Vercel Dashboard > **Deployments**
2. Eng so'nggi deployment'ni tanlang
3. **Build Logs** ni oching
4. Quyidagi xatoliklarni qidiring:
   - `DATABASE_URL is not defined`
   - `Prisma Client not generated`
   - `Database connection failed`

## 📝 Qo'shimcha Ma'lumot

Batafsil troubleshooting: `VERCEL_TROUBLESHOOTING.md`

