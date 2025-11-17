# Vercel'ga Deploy Qilish - To'liq Qo'llanma

## ✅ Oldingi Qadamlar (Bajarilgan)

1. ✅ Prisma schema yangilandi (`directUrl` qo'shildi)
2. ✅ Infinite loop'lar tuzatildi
3. ✅ Build blocking operation'lar olib tashlandi
4. ✅ Environment variables konfiguratsiyasi tayyor

## 📋 Deploy Qilish Tartibi

### 1-qadam: GitHub'ga Push Qilish

Loyihangizni GitHub'ga push qiling:

```bash
# O'zgarishlarni ko'rish
git status

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Fix infinite loops and add Vercel deployment config"

# GitHub'ga push qilish
git push origin main
```

**⚠️ Eslatma:** Agar Git ishlamasa, o'zingizning GitHub repository'ingizga manual ravishda push qiling.

---

### 2-qadam: Vercel Dashboard'ga Kirish

1. [Vercel Dashboard](https://vercel.com/dashboard) ga kiring
2. GitHub orqali login qiling (yoki yangi account yarating)
3. **Add New Project** tugmasini bosing

---

### 3-qadam: Project'ni Import Qilish

1. Repository listdan `Stom_register` ni tanlang
2. Yoki **Import Third-Party Git Repository** orqali repository URL'ni kiriting:
   ```
   https://github.com/komilovmDev/Stom_register
   ```
3. **Import** tugmasini bosing

---

### 4-qadam: Build Settings'ni Sozlash

Vercel avtomatik ravishda Next.js'ni aniqlaydi. Quyidagilarni tekshiring:

**Framework Preset:** Next.js ✅ (avtomatik)

**Build Command:**
```
npm run build
```
Yoki avtomatik (`prisma generate && prisma migrate deploy && next build` ishlaydi `package.json` dagi script bo'yicha)

**Output Directory:** `.next` ✅ (avtomatik)

**Install Command:** `npm install` ✅ (avtomatik)

---

### 5-qadam: Environment Variables Qo'shish

**⚠️ MUHIM:** Environment variables'ni **deploy qilishdan OLDIN** qo'shing!

**Vercel Dashboard > Project Settings > Environment Variables** ga o'ting:

#### 5.1. DATABASE_URL (Pooler Connection)

**Key:** `DATABASE_URL`

**Value:**
```
postgresql://postgres.gbrwmbyqzrfcgyneqzwc:MMMM%407654321%2F.m@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Environment'lar:**
- ✅ Production
- ✅ Preview
- ✅ Development

**Save** tugmasini bosing

---

#### 5.2. DIRECT_URL (Direct Connection - Migration uchun)

**Key:** `DIRECT_URL`

**Value:**
```
postgresql://postgres.gbrwmbyqzrfcgyneqzwc:MMMM%407654321%2F.m@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Yoki agar direct connection ishlasa:**
```
postgresql://postgres.gbrwmbyqzrfcgyneqzwc:MMMM%407654321%2F.m@db.gbrwmbyqzrfcgyneqzwc.supabase.co:5432/postgres
```

**Environment'lar:**
- ✅ Production
- ✅ Preview
- ✅ Development

**Save** tugmasini bosing

---

#### 5.3. NEXT_PUBLIC_SUPABASE_URL

**Key:** `NEXT_PUBLIC_SUPABASE_URL`

**Value:**
```
https://gbrwmbyqzrfcgyneqzwc.supabase.co
```

**Environment'lar:**
- ✅ Production
- ✅ Preview
- ✅ Development

**Save** tugmasini bosing

---

#### 5.4. NEXT_PUBLIC_SUPABASE_ANON_KEY

**Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicndtYnlxenJmY2d5bmVxendjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTY1MTksImV4cCI6MjA3ODc3MjUxOX0.kXfj20u76hCt_b7obX4Qtfs3i9ONN1fC9KtYU2AzMb4
```

**Environment'lar:**
- ✅ Production
- ✅ Preview
- ✅ Development

**Save** tugmasini bosing

---

### 6-qadam: Deploy Qilish

1. Environment variables'larni qo'shish tugagandan keyin
2. **Deploy** tugmasini bosing
3. Yoki **Settings** > **Redeploy** tugmasini bosing (agar avval deploy qilgan bo'lsangiz)

---

### 7-qadam: Build Logs'ni Kuzatish

Deploy jarayonida:

1. Build logs'ni kuzating
2. Quyidagilar ko'rinishi kerak:
   ```
   ✓ Prisma Client generated
   ✓ Prisma migrations deployed
   ✓ Next.js build completed
   ```

3. Agar xatolar bo'lsa:
   - **"Authentication failed"** → `DATABASE_URL` password encoding'ni tekshiring
   - **"Can't reach database server"** → `DIRECT_URL` ni tekshiring yoki pooler connection ishlating
   - **"prepared statement already exists"** → `DIRECT_URL` ni pooler connection qiling

---

### 8-qadam: Deploy Muvaffaqiyatli Tugagandan Keyin

1. **Deployment URL** ko'rsatiladi (masalan: `https://stom-register.vercel.app`)
2. URL ni browser'da oching
3. Sahifa yuklanishini tekshiring

---

### 9-qadam: Database Migration'larni Tekshirish

Deploy qilingandan keyin:

1. Vercel Dashboard > **Deployments** > Oxirgi deployment
2. **Build Logs** ni oching
3. Quyidagi xabarni qidiiring:
   ```
   ✓ Prisma migrations deployed successfully
   ```

Agar migration xatosi bo'lsa, Supabase Dashboard > SQL Editor orqali migration'larni manual bajarish kerak.

---

## 🔧 Troubleshooting

### Muammo: "Authentication failed"

**Yechim:**
1. `DATABASE_URL` va `DIRECT_URL` da password encoding'ni tekshiring
2. Paroldagi maxsus belgilar URL-encode qilinganligiga ishonch hosil qiling:
   - `@` → `%40`
   - `/` → `%2F`

---

### Muammo: "Can't reach database server"

**Yechim:**
1. `DIRECT_URL` ni pooler connection qiling:
   ```
   DIRECT_URL=postgresql://postgres.gbrwmbyqzrfcgyneqzwc:MMMM%407654321%2F.m@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

---

### Muammo: "prepared statement 's0' already exists"

**Yechim:**
1. `DIRECT_URL` ni yangilang (pooler connection ishlating)
2. Redeploy qiling

---

### Muammo: Build to'xtab qoladi

**Yechim:**
1. Build logs'ni tekshiring
2. Infinite loop yoki blocking operation'lar mavjud bo'lsa, `DEPLOY_STEPS.md` ni qayta o'qing
3. Local'da build sinab ko'ring:
   ```bash
   npm run build
   ```

---

### Muammo: Environment variables o'qilmayapti

**Yechim:**
1. Environment variables qo'shilganligini tekshiring
2. Barcha environment'lar uchun (Production, Preview, Development) belgilanganligini tekshiring
3. Redeploy qiling

---

## 📝 Keyingi Qadamlar

Deploy qilingandan keyin:

1. ✅ Sahifani browser'da oching va test qiling
2. ✅ Login sahifasiga o'ting va kirish sinab ko'ring
3. ✅ Dashboard ishlayotganligini tekshiring
4. ✅ Patients sahifasini sinab ko'ring

---

## 🔗 Foydali Linklar

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Dashboard](https://app.supabase.com)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

## ✅ Checklist

Deploy qilishdan oldin:

- [ ] Git'ga barcha o'zgarishlar push qilingan
- [ ] Vercel project yaratilgan
- [ ] `DATABASE_URL` environment variable qo'shilgan
- [ ] `DIRECT_URL` environment variable qo'shilgan
- [ ] `NEXT_PUBLIC_SUPABASE_URL` environment variable qo'shilgan
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable qo'shilgan
- [ ] Barcha environment variables Production, Preview, Development uchun belgilangan
- [ ] Build logs muvaffaqiyatli tugagan
- [ ] Sahifa browser'da ishlayapti

---

**Tayyor! Endi deploy qilishga tayyorsiz! 🚀**

