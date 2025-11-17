# 🔧 Deploy Muammosi - Yechim

## ❌ Muammo

Build to'xtab qolayapti chunki:
1. `prisma migrate deploy` migration fayllarini qidirayapti
2. `prisma/migrations` papkasi yo'q
3. Migration'larsiz `prisma migrate deploy` cheksiz kutadi

## ✅ Yechim 1: Build Command'ni O'zgartirish (TAVSIYA ETILADI)

Build command'dan `prisma migrate deploy` ni olib tashladim. Endi:

**Oldingi:**
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

**Yangi:**
```json
"build": "prisma generate && next build"
```

Bu o'zgarish `package.json` da qilingan.

---

## 📋 Qadamlar

### 1. O'zgarishlarni Commit va Push Qiling

```bash
git add package.json
git commit -m "Fix: Remove prisma migrate deploy from build command"
git push origin main
```

### 2. Vercel'da Redeploy Qiling

1. Vercel Dashboard > Project Settings
2. **Redeploy** tugmasini bosing
3. Yoki yangi commit push qilgandan keyin avtomatik deploy qilinadi

---

## 🗄️ Database Migration'lari (Agar Kerak Bo'lsa)

Agar database migration'lari kerak bo'lsa, 2 ta variant:

### Variant A: Supabase Dashboard orqali (Tavsiya etiladi)

1. Supabase Dashboard > SQL Editor
2. Quyidagi SQL kodlarni bajarish:

```sql
-- Patients jadvalini yaratish
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

-- Visits jadvalini yaratish
CREATE TABLE IF NOT EXISTS "visits" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "patientId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "visits_patientId_fkey" FOREIGN KEY ("patientId") 
    REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index yaratish
CREATE INDEX IF NOT EXISTS "visits_patientId_idx" ON "visits"("patientId");
```

### Variant B: Local'da Migration Yaratish

```bash
# Local'da migration yaratish
npx prisma migrate dev --name init

# Migration fayllarini Git'ga qo'shish
git add prisma/migrations
git commit -m "Add database migrations"
git push origin main

# Keyin package.json'ga qaytaring:
# "build": "prisma generate && prisma migrate deploy && next build"
```

---

## ✅ Build Endi Ishlamayapti

Agar build hali ham to'xtab qolsa:

### 1. Vercel Build Logs'ni Tekshiring

Vercel Dashboard > Deployments > Oxirgi deployment > Build Logs

### 2. Muammolarni Qidiring:

- **"Prisma Client generated"** - ✅ ishlayapti
- **"Next.js build completed"** - ✅ ishlayapti
- **Timeout errors** - ⚠️ Build vaqti ko'p ketmoqda
- **Memory errors** - ⚠️ Memory yetmayapti
- **Database connection errors** - ⚠️ Environment variables xato

---

## 🔍 Debugging

### Local'da Build Sinab Ko'ring

```bash
# Environment variables'ni tekshiring
echo $DATABASE_URL
echo $DIRECT_URL

# Build sinab ko'ring
npm run build
```

### Agar Local'da Build Ishlamasa:

```bash
# Clean build
rm -rf .next
rm -rf node_modules/.cache
npm run build
```

---

## 📝 Checklist

- [ ] `package.json` da build command yangilangan (`prisma migrate deploy` olib tashlangan)
- [ ] O'zgarishlar Git'ga commit qilingan
- [ ] GitHub'ga push qilingan
- [ ] Vercel'da redeploy qilingan
- [ ] Build logs'da xatolar yo'q
- [ ] Database jadvallari yaratilgan (agar kerak bo'lsa)

---

## 🚀 Keyingi Qadamlar

1. ✅ `package.json` o'zgartirildi - build command yangilandi
2. ⏭️ Git'ga push qiling
3. ⏭️ Vercel'da redeploy qiling
4. ⏭️ Build logs'ni kuzating
5. ⏭️ Agar database migration kerak bo'lsa, SQL Editor orqali qiling

---

**Build endi tezroq va ishonchli ishlashi kerak! 🎉**

