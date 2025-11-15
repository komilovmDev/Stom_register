# Supabase Quick Setup - Sizning Project'ingiz Uchun

## Sizning Ma'lumotlaringiz:
- **Project URL**: `https://gbrwmbyqzrfcgyneqzwc.supabase.co`
- **Project Reference**: `gbrwmbyqzrfcgyneqzwc`

## 1. PostgreSQL Connection String Olish

Supabase JS client kerak **EMAS** - biz Prisma ishlatamiz!

1. [Supabase Dashboard](https://app.supabase.com) ga kiring
2. Project'ingizni tanlang (`gbrwmbyqzrfcgyneqzwc`)
3. Chap menudan **"Project Settings"** (⚙️) ni bosing
4. **"Database"** bo'limiga o'ting
5. **"Connection string"** bo'limiga o'ting
6. **"URI"** tab'ni tanlang
7. Connection string'ni ko'rsating

Format quyidagicha bo'ladi:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

Yoki to'g'ridan-to'g'ri connection:
```
postgresql://postgres:[YOUR-PASSWORD]@db.gbrwmbyqzrfcgyneqzwc.supabase.co:5432/postgres
```

⚠️ **Muhim**: 
- `[YOUR-PASSWORD]` o'rniga project yaratishda yaratgan database parolni qo'ying
- Agar parolni unutgan bo'lsangiz, Project Settings > Database > Reset database password

## 2. .env Faylini Yaratish

Loyiha ildizida `.env` faylini yarating:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.gbrwmbyqzrfcgyneqzwc.supabase.co:5432/postgres"
```

Yoki pooler connection (tavsiya etiladi - Vercel uchun):
```env
DATABASE_URL="postgresql://postgres.gbrwmbyqzrfcgyneqzwc:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

⚠️ **Region'ni topish**: Supabase Dashboard > Project Settings > General > Region

## 3. Prisma Schema'ni O'zgartirish

`prisma/schema.prisma` faylida:

```prisma
datasource db {
  provider = "postgresql"  // "sqlite" dan o'zgartirish
  url      = env("DATABASE_URL")
}
```

## 4. Migration Qilish

```bash
# Prisma Client'ni yangilash
npm run db:generate

# Migration yaratish va bajarish
npx prisma migrate dev --name init
```

## 5. Tekshirish

```bash
# Database connection'ni tekshirish
npm run db:test

# Database'ni ko'rish
npm run db:studio
```

## 6. Ma'lumotlarni Import Qilish (Agar kerak bo'lsa)

Agar eski SQLite ma'lumotlarini ko'chirish kerak bo'lsa:

```bash
# Avval export qiling
npm run db:export

# Keyin import qiling
npm run db:import exports/patients-export-[timestamp].json
```

## 7. Vercel'da Deploy

1. Vercel Dashboard > Project Settings > Environment Variables
2. `DATABASE_URL` ni qo'shing (pooler connection string'ni ishlating)
3. Deploy qiling

---

**Eslatma**: Supabase JS client (`@supabase/supabase-js`) kerak emas, chunki biz Prisma orqali database bilan ishlaymiz!

