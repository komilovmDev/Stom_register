# Vercel Deployment Guide

Bu qo'llanma loyihani Vercel'ga deploy qilish uchun.

## 1. Vercel Account va Project Yaratish

1. Vercel'ga kiring: https://vercel.com
2. GitHub/GitLab/Bitbucket orqali login qiling
3. **Add New Project** tugmasini bosing
4. Repository'ni tanlang va import qiling

## 2. Environment Variables Sozlash

Vercel Dashboard'da project'ingizga o'ting va **Settings** > **Environment Variables** bo'limiga kiring.

Quyidagi environment variables'larni qo'shing:

### Database Connection
```
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.gbrwmbyqzrfcgyneqzwc.supabase.co:5432/postgres
```
**Eslatma**: `[YOUR_PASSWORD]` o'rniga Supabase database parolingizni kiriting.

### Supabase Authentication
```
NEXT_PUBLIC_SUPABASE_URL=https://gbrwmbyqzrfcgyneqzwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicndtYnlxenJmY2d5bmVxendjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTY1MTksImV4cCI6MjA3ODc3MjUxOX0.kXfj20u76hCt_b7obX4Qtfs3i9ONN1fC9KtYU2AzMb4
```

**Muhim**: Har bir environment variable uchun:
- ✅ **Production** environment'ni belgilang
- ✅ **Preview** environment'ni belgilang (ixtiyoriy)
- ✅ **Development** environment'ni belgilang (ixtiyoriy)

## 3. Build Settings

Vercel avtomatik ravishda quyidagilarni aniqlaydi:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (yoki `prisma generate && next build`)
- **Output Directory**: `.next`
- **Install Command**: `npm install`

Agar kerak bo'lsa, **Settings** > **General** > **Build & Development Settings** bo'limida tekshiring.

## 4. Prisma Migration

Vercel'da Prisma migration'ni ishga tushirish uchun:

### Variant 1: Build Command'da (Tavsiya etiladi)

**Settings** > **General** > **Build & Development Settings** bo'limida:

**Build Command**:
```bash
prisma generate && prisma migrate deploy && next build
```

Yoki `package.json`'da `build` script'ni yangilang:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### Variant 2: Vercel Postinstall Hook

`package.json`'da `postinstall` script mavjud:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Bu avtomatik ravishda Prisma Client'ni generate qiladi.

**Migration uchun**: Supabase Dashboard'da migration'larni qo'lda ishga tushirish yoki Vercel'da build command'da `prisma migrate deploy` qo'shish.

## 5. Database Migration (Supabase)

Agar database'da migration'lar bo'lmasa:

1. **Local'da migration yarating**:
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Migration fayllarini commit qiling**:
   ```bash
   git add prisma/migrations
   git commit -m "Add database migrations"
   git push
   ```

3. **Vercel'da build paytida migration ishga tushadi** (agar `prisma migrate deploy` qo'shilgan bo'lsa)

Yoki **Supabase Dashboard** orqali:
1. Supabase Dashboard > **SQL Editor**
2. Migration fayllaridagi SQL kodini ishlating

## 6. Deploy Qilish

### GitHub Integration orqali (Tavsiya etiladi):

1. Code'ni GitHub'ga push qiling:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Vercel avtomatik ravishda deploy qiladi

### Manual Deploy:

1. Vercel CLI o'rnating:
   ```bash
   npm i -g vercel
   ```

2. Login qiling:
   ```bash
   vercel login
   ```

3. Deploy qiling:
   ```bash
   vercel
   ```

4. Production'ga deploy qilish:
   ```bash
   vercel --prod
   ```

## 7. Deploy'dan Keyin Tekshirish

1. **Homepage**: `https://your-project.vercel.app`
2. **Login**: `/login` sahifasiga o'ting
3. **Database**: Bemorlar ro'yxatini tekshiring
4. **API**: API endpoint'larni tekshiring

## 8. Xatoliklar va Yechimlar

### Build Xatosi: "Prisma Client not generated"

**Yechim**: `package.json`'da `postinstall` script'ni tekshiring:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Xatosi

**Yechim**: 
1. `DATABASE_URL` to'g'ri sozlanganini tekshiring
2. Supabase database'ning public bo'lishini tekshiring
3. IP whitelist'ni tekshiring (agar kerak bo'lsa)

### Environment Variables Xatosi

**Yechim**:
1. Vercel Dashboard'da environment variables'ni tekshiring
2. Production environment'ni belgilanganini tekshiring
3. Redeploy qiling

## 9. Continuous Deployment

GitHub integration orqali:
- Har bir `main` branch'ga push qilinganda avtomatik deploy
- Pull Request'lar uchun preview deployment

## 10. Custom Domain (ixtiyoriy)

1. Vercel Dashboard > **Settings** > **Domains**
2. Domain'ni qo'shing
3. DNS sozlamalarini qiling

## 11. Monitoring va Logs

1. Vercel Dashboard > **Deployments** - barcha deployment'lar
2. **Functions** - API route'lar log'lari
3. **Analytics** - trafik va performance

## 12. Production Checklist

- [ ] Environment variables sozlangan
- [ ] Database migration ishga tushgan
- [ ] Build muvaffaqiyatli
- [ ] Login ishlayapti
- [ ] Database connection ishlayapti
- [ ] API endpoint'lar ishlayapti
- [ ] Frontend to'g'ri ishlayapti

## 13. Support

Agar muammo bo'lsa:
1. Vercel Dashboard > **Deployments** - build log'larni tekshiring
2. Vercel Dashboard > **Functions** - runtime log'larni tekshiring
3. Browser Console'da xatoliklarni tekshiring

