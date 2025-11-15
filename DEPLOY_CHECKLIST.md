# Vercel Deploy Checklist

## ✅ Deploy Oldidan Tekshirish

### 1. Code Tayyor
- [x] Barcha o'zgarishlar commit qilingan
- [x] GitHub'ga push qilingan
- [ ] Build local'da test qilingan (ixtiyoriy)

### 2. Environment Variables

Vercel Dashboard > Settings > Environment Variables'da quyidagilarni qo'shing:

#### Database
```
DATABASE_URL=postgresql://postgres:MMMM@7654321/.m@db.gbrwmbyqzrfcgyneqzwc.supabase.co:5432/postgres
```

#### Supabase Auth
```
NEXT_PUBLIC_SUPABASE_URL=https://gbrwmbyqzrfcgyneqzwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicndtYnlxenJmY2d5bmVxendjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTY1MTksImV4cCI6MjA3ODc3MjUxOX0.kXfj20u76hCt_b7obX4Qtfs3i9ONN1fC9KtYU2AzMb4
```

**Muhim**: Har bir variable uchun **Production** environment'ni belgilang!

### 3. Build Settings

Vercel avtomatik aniqlaydi, lekin tekshirib ko'ring:

**Settings > General > Build & Development Settings**:
- Framework Preset: Next.js ✅
- Build Command: `npm run build` ✅
- Output Directory: `.next` ✅

### 4. Database Migration

Agar database'da migration'lar bo'lmasa:

**Variant 1**: Supabase Dashboard orqali
1. Supabase Dashboard > SQL Editor
2. `prisma/migrations` papkasidagi SQL fayllarni ishlating

**Variant 2**: Vercel Build Command'da
`package.json`'da build script'ni yangilang:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

### 5. Deploy Qilish

#### GitHub Integration (Tavsiya):
1. GitHub'ga push qiling
2. Vercel avtomatik deploy qiladi

#### Manual:
```bash
npm i -g vercel
vercel login
vercel --prod
```

## 🚀 Deploy'dan Keyin

1. **Homepage**: `https://your-project.vercel.app` - ochilishini tekshiring
2. **Login**: `/login` - doctor account bilan kirish
3. **Patients**: `/patients` - bemorlar ro'yxati
4. **Database**: Bemor qo'shib, database ishlashini tekshiring

## ❌ Xatoliklar

### Build Xatosi
- Vercel Dashboard > Deployments > Build Log'larni tekshiring
- Environment variables to'g'ri sozlanganini tekshiring

### Database Connection Xatosi
- `DATABASE_URL` to'g'ri sozlanganini tekshiring
- Supabase database public ekanligini tekshiring

### Login Xatosi
- `NEXT_PUBLIC_SUPABASE_URL` va `NEXT_PUBLIC_SUPABASE_ANON_KEY` to'g'ri sozlanganini tekshiring
- Doctor account yaratilganini tekshiring

## 📝 Qo'shimcha Ma'lumot

Batafsil qo'llanma: `VERCEL_DEPLOY.md`

