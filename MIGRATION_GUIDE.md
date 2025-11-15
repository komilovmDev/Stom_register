# Database Migration Guide - PostgreSQL'ga O'tkazish

Bu qo'llanma SQLite'dan PostgreSQL'ga o'tkazish uchun yordam beradi. Bu Vercel yoki boshqa cloud platformalarda deploy qilish uchun zarur.

## 1. Ma'lumotlarni Backup Qilish

Avval hozirgi ma'lumotlarni backup qiling:

```bash
# Database faylini va ma'lumotlarni backup qilish
npm run db:backup

# Yoki faqat ma'lumotlarni JSON formatida export qilish
npm run db:export
```

Bu quyidagilarni yaratadi:
- `backups/backup-[timestamp].db` - SQLite database nusxasi
- `backups/data-[timestamp].json` - JSON formatida ma'lumotlar
- `exports/patients-export-[timestamp].json` - To'liq export fayli

## 2. PostgreSQL Database Olish

### Vercel Postgres (Tavsiya etiladi)
1. Vercel dashboard'ga kiring
2. Project Settings > Storage > Create Database
3. Postgres'ni tanlang
4. Database yaratilgandan keyin `DATABASE_URL` ni oling

### Boshqa variantlar:
- **Supabase**: https://supabase.com (Bepul tier mavjud) - [Batafsil qo'llanma](./SUPABASE_SETUP.md)
- **Neon**: https://neon.tech (Bepul tier mavjud)
- **Railway**: https://railway.app
- **Render**: https://render.com

> 📖 **Supabase uchun batafsil qo'llanma**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) faylini ko'ring

## 3. Prisma Schema'ni O'zgartirish

`prisma/schema.prisma` faylida:

```prisma
datasource db {
  provider = "postgresql"  // "sqlite" dan o'zgartirish
  url      = env("DATABASE_URL")
}
```

## 4. Environment Variable'ni O'rnatish

`.env` faylida yoki Vercel'da:

```
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

## 5. Migration Qilish

```bash
# Prisma Client'ni yangilash
npm run db:generate

# Migration yaratish va bajarish
npm run db:migrate
```

## 6. Ma'lumotlarni Import Qilish

Agar eski ma'lumotlarni yangi database'ga ko'chirish kerak bo'lsa:

```bash
# Export qilingan faylni import qilish
npm run db:import exports/patients-export-[timestamp].json
```

Yoki aniq fayl yo'lini ko'rsatish:

```bash
npm run db:import path/to/export-file.json
```

## 7. Vercel'da Deploy Qilish

1. GitHub'ga push qiling
2. Vercel'da project yarating
3. Environment Variables'da `DATABASE_URL` ni qo'shing
4. Deploy qiling

Vercel avtomatik ravishda:
- `postinstall` script'ni ishga tushiradi (Prisma generate)
- `build` script'ni ishga tushiradi

## 8. Tekshirish

```bash
# Database connection'ni tekshirish
npm run db:test
```

## Xavfsizlik

⚠️ **Muhim**: 
- `.env` faylini git'ga commit qilmang
- Production database URL'ini hech kimga ko'rsatmang
- Backup'larni xavfsiz joyda saqlang

## Foydali Buyruqlar

```bash
# Backup yaratish
npm run db:backup

# Ma'lumotlarni export qilish
npm run db:export

# Ma'lumotlarni import qilish
npm run db:import

# Database'ni ko'rish (Prisma Studio)
npm run db:studio

# Migration yaratish
npm run db:migrate
```

