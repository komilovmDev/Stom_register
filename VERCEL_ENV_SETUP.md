# Vercel Environment Variables Setup

## Qadammoq problemi: Authentication failed

Bu muammo `DATABASE_URL` da password encoding yoki format xatosi tufayli yuzaga keladi.

## To'g'ri Environment Variables

Vercel Dashboard > Settings > Environment Variables bo'limiga quyidagilarni qo'shing:

**⚠️ MUHIM:** Prisma schema yangilandi - endi 2 ta environment variable kerak:
- `DATABASE_URL` - pooler connection (oddiy querylar uchun)
- `DIRECT_URL` - direct connection (migration'lar uchun)

Paroldagi maxsus belgilarni URL-encode qiling:
- `@` → `%40`
- `/` → `%2F`

**Parol:** `MMMM@7654321/.m`
**URL-encoded parol:** `MMMM%407654321%2F.m`

### 1. DATABASE_URL (Pooler Connection - Regular Queries uchun)

```
DATABASE_URL=postgresql://postgres.gbrwmbyqzrfcgyneqzwc:MMMM%407654321%2F.m@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 2. DIRECT_URL (Direct Connection - Migration'lar uchun)

```
DIRECT_URL=postgresql://postgres.gbrwmbyqzrfcgyneqzwc:MMMM%407654321%2F.m@db.gbrwmbyqzrfcgyneqzwc.supabase.co:5432/postgres
```

**Eslatma:** 
- `DATABASE_URL` - pooler connection (port 6543) - production uchun tavsiya etiladi
- `DIRECT_URL` - direct connection (port 5432) - faqat migration'lar uchun ishlatiladi
- Prisma avtomatik ravishda migration'lar uchun `DIRECT_URL` ni ishlatadi

### 3. Supabase Authentication Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://gbrwmbyqzrfcgyneqzwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicndtYnlxenJmY2d5bmVxendjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTY1MTksImV4cCI6MjA3ODc3MjUxOX0.kXfj20u76hCt_b7obX4Qtfs3i9ONN1fC9KtYU2AzMb4
```

## Vercel'da Qo'shish Qadamlari

1. **Vercel Dashboard** > Project Settings > **Environment Variables**
2. Har bir variable uchun:
   - **Key**: Variable nomi (masalan: `DATABASE_URL`)
   - **Value**: Connection string (yuoqda berilgan)
   - ✅ **Production** - belgilang
   - ✅ **Preview** - belgilang
   - ✅ **Development** - belgilang (ixtiyoriy)
3. **Save** tugmasini bosing

## Muhim Eslatmalar

1. **Password Encoding**: Paroldagi maxsus belgilar URL-encode qilinishi **SHART**:
   - `@` → `%40`
   - `/` → `%2F`
   - `.` → `%2E` (odatda kerak emas)
   - `:` → `%3A` (odatda kerak emas)
   - `#` → `%23`
   - `?` → `%3F`
   - `&` → `%26`
   - `=` → `%3D`

2. **Connection String Format**: 
   - Pooler (port 6543) - Vercel uchun tavsiya etiladi
   - Direct (port 5432) - Agar pooler ishlamasa

3. **Environment Variables Update**: 
   - Environment variable o'zgartirgandan keyin **yangi deploy** qilish kerak
   - Yoki **Settings** > **Redeploy** tugmasini bosing

## Tekshirish

Deploy qilingandan keyin:

1. Vercel Dashboard > **Deployments**
2. Oxirgi deployment'ni oching
3. **Build Logs** ni tekshiring
4. Agar "Database connection successful" yoki "Prisma Client generated" ko'rsangiz - ✅ ishlayapti
5. Agar "Authentication failed" ko'rsangiz - password encoding'ni tekshiring

## Troubleshooting

### Muammo: "Authentication failed"

**Yechim 1:** Password URL-encoding tekshiring
```
❌ Xato: MMMM@7654321/.m
✅ To'g'ri: MMMM%407654321%2F.m
```

**Yechim 2:** To'g'ridan-to'g'ri connection sinab ko'ring (port 5432)

**Yechim 3:** Supabase Dashboard'da password'ni tekshiring:
- Project Settings > Database > Connection string
- Parol to'g'ri ekanligiga ishonch hosil qiling

### Muammo: "Connection timeout"

**Yechim:** Pooler connection (port 6543) ishlating

### Muammo: "ERROR: prepared statement 's0' already exists"

**Sababi:** PgBouncer pooler (port 6543) prepared statements'ni qo'llab-quvvatlamaydi.

**Yechim 1 (Tavsiya etiladi):** Direct connection (port 5432) ishlating:
```
DATABASE_URL=postgresql://postgres.gbrwmbyqzrfcgyneqzwc:MMMM%407654321%2F.m@db.gbrwmbyqzrfcgyneqzwc.supabase.co:5432/postgres
```

**Yechim 2:** Pooler connection'ga `?pgbouncer=true` parametrini qo'shing:
```
DATABASE_URL=postgresql://postgres.gbrwmbyqzrfcgyneqzwc:MMMM%407654321%2F.m@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### Muammo: "Migration failed"

**Yechim:** 
1. Build command'da `prisma migrate deploy` borligini tekshiring
2. Migration fayllari commit qilinganligini tekshiring
3. Agar migration'lar bo'lmasa, avval local'da yarating:
   ```bash
   npx prisma migrate dev --name init
   git add prisma/migrations
   git commit -m "Add migrations"
   git push
   ```
4. **"prepared statement" xatosi bo'lsa** - direct connection (port 5432) ishlating

## Qo'shimcha Linklar

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [URL Encoding Reference](https://www.urlencoder.org/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

