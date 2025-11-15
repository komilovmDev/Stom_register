# Supabase'ga O'tkazish Qo'llanmasi

Bu qo'llanma SQLite'dan Supabase PostgreSQL'ga o'tkazish uchun batafsil ko'rsatmalar beradi.

## 1. Supabase Account Yaratish

1. [Supabase.com](https://supabase.com) ga kiring
2. "Start your project" tugmasini bosing
3. GitHub yoki Email orqali ro'yxatdan o'ting
4. "New Project" tugmasini bosing

## 2. Yangi Project Yaratish

1. **Organization**: Organization tanlang yoki yangisini yarating
2. **Name**: Project nomini kiriting (masalan: `stom-register`)
3. **Database Password**: Kuchli parol yarating va saqlab qo'ying ⚠️
4. **Region**: Eng yaqin regionni tanlang
5. **Pricing Plan**: Free tier'ni tanlang (bepul)
6. "Create new project" tugmasini bosing

⏳ Project yaratilishini kutish (2-3 daqiqa)

## 3. Database Connection String Olish

1. Project yaratilgandan keyin, Project Settings'ga kiring
2. Chap menudan **"Database"** ni tanlang
3. **"Connection string"** bo'limiga o'ting
4. **"URI"** tab'ni tanlang
5. Connection string'ni ko'rsating va nusxalang

Format quyidagicha bo'ladi:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

⚠️ **Muhim**: `[YOUR-PASSWORD]` o'rniga o'zingiz yaratgan parolni qo'ying!

## 4. Environment Variable O'rnatish

### Local Development (.env faylida)

`.env` faylini yarating yoki yangilang:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
```

Yoki pooler connection (tavsiya etiladi):
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

### Vercel'da

1. Vercel Dashboard > Project Settings > Environment Variables
2. `DATABASE_URL` ni qo'shing
3. Supabase'dan olgan connection string'ni qo'ying
4. Barcha environment'lar uchun (Production, Preview, Development) qo'shing

## 5. Prisma Schema'ni O'zgartirish

`prisma/schema.prisma` faylini oching va quyidagicha o'zgartiring:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // "sqlite" dan o'zgartirish
  url      = env("DATABASE_URL")
}

model Patient {
  id         String   @id @default(uuid())
  fullName   String
  birthDate  DateTime
  address    String
  phone      String?
  visitCount Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  visits     Visit[]

  @@map("patients")
}

model Visit {
  id          String   @id @default(uuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  reason      String
  visitDate   DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("visits")
  @@index([patientId])
}
```

## 6. Eski Ma'lumotlarni Backup Qilish

Avval hozirgi ma'lumotlarni backup qiling:

```bash
# Database faylini backup qilish
npm run db:backup

# Ma'lumotlarni JSON formatida export qilish
npm run db:export
```

Bu quyidagilarni yaratadi:
- `backups/backup-[timestamp].db` - SQLite database nusxasi
- `exports/patients-export-[timestamp].json` - JSON formatida ma'lumotlar

## 7. Prisma Client'ni Yangilash

```bash
# Prisma Client'ni yangilash
npm run db:generate
```

## 8. Migration Yaratish va Bajarish

```bash
# Migration yaratish
npx prisma migrate dev --name init
```

Bu quyidagilarni qiladi:
- Migration fayllarini yaratadi
- Supabase database'da jadvallarni yaratadi
- Migration tarixini saqlaydi

## 9. Ma'lumotlarni Import Qilish

Agar eski ma'lumotlarni yangi database'ga ko'chirish kerak bo'lsa:

```bash
# Export qilingan faylni import qilish
npm run db:import exports/patients-export-[timestamp].json
```

Yoki aniq fayl yo'lini ko'rsatish:
```bash
npm run db:import path/to/export-file.json
```

⚠️ **Diqqat**: Bu hozirgi ma'lumotlarni o'chirib, yangi ma'lumotlarni qo'shadi!

## 10. Tekshirish

### Database Connection'ni Tekshirish

```bash
npm run db:test
```

### Prisma Studio orqali Ko'rish

```bash
npm run db:studio
```

Bu browser'da database'ni ko'rish imkonini beradi.

## 11. Vercel'da Deploy Qilish

### GitHub'ga Push Qilish

```bash
git add .
git commit -m "Migrate to Supabase PostgreSQL"
git push
```

### Vercel'da Deploy

1. Vercel Dashboard'ga kiring
2. Project'ni tanlang yoki yangisini yarating
3. GitHub repository'ni ulang
4. **Environment Variables** bo'limida:
   - `DATABASE_URL` ni qo'shing (Supabase connection string)
5. **Build Settings**:
   - Build Command: `npm run build` (avtomatik)
   - Output Directory: `.next` (avtomatik)
6. "Deploy" tugmasini bosing

Vercel avtomatik ravishda:
- `postinstall` script'ni ishga tushiradi (Prisma generate)
- `build` script'ni ishga tushiradi

## 12. Supabase Dashboard'da Tekshirish

1. Supabase Dashboard'ga kiring
2. **Table Editor** bo'limiga o'ting
3. `patients` va `visits` jadvallarini ko'rishingiz mumkin
4. Ma'lumotlarni to'g'ridan-to'g'ri ko'rish va tahrirlash mumkin

## 13. Xavfsizlik Sozlamalari

### Row Level Security (RLS) - Ixtiyoriy

Agar ma'lumotlarni himoya qilish kerak bo'lsa:

1. Supabase Dashboard > Authentication > Policies
2. Har bir jadval uchun policy yarating
3. Yoki SQL Editor'da:

```sql
-- RLS'ni yoqish
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Barcha foydalanuvchilar uchun o'qish ruxsati
CREATE POLICY "Allow read access" ON patients FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON visits FOR SELECT USING (true);
```

⚠️ **Eslatma**: Agar RLS yoqsangiz, Prisma orqali ma'lumotlarga kirish uchun service role key ishlatishingiz kerak bo'ladi.

## 14. Troubleshooting

### Connection Error

Agar connection xatosi bo'lsa:
1. Password to'g'ri ekanligini tekshiring
2. Connection string'da `[YOUR-PASSWORD]` o'rniga haqiqiy parol qo'yilganini tekshiring
3. Supabase project faol ekanligini tekshiring

### Migration Error

Agar migration xatosi bo'lsa:
```bash
# Migration'ni qayta bajarish
npx prisma migrate reset
npx prisma migrate dev
```

⚠️ **Diqqat**: Bu barcha ma'lumotlarni o'chiradi!

### Pool Connection Error

Agar connection pool xatosi bo'lsa, connection string'da `?pgbouncer=true&connection_limit=1` qo'shing.

## 15. Foydali Linklar

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma + Supabase Guide](https://supabase.com/docs/guides/integrations/prisma)
- [Supabase Dashboard](https://app.supabase.com)

## 16. Qo'shimcha Imkoniyatlar

Supabase quyidagi qo'shimcha imkoniyatlarni beradi:

- **Authentication**: Foydalanuvchilarni autentifikatsiya qilish
- **Storage**: Fayllarni saqlash
- **Realtime**: Real-time ma'lumotlar yangilanishi
- **Edge Functions**: Serverless funksiyalar

Bu imkoniyatlardan kelajakda foydalanish mumkin!

