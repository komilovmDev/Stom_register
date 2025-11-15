# 🚀 Tezkor Deploy Qo'llanmasi

## 1. GitHub'ga Push Qiling

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## 2. Vercel'ga Project Qo'shing

1. https://vercel.com ga kiring
2. **Add New Project** tugmasini bosing
3. GitHub repository'ni tanlang va import qiling

## 3. Environment Variables Qo'shing

Vercel Dashboard > **Settings** > **Environment Variables**:

### Database
```
Name: DATABASE_URL
Value: postgresql://postgres:MMMM@7654321/.m@db.gbrwmbyqzrfcgyneqzwc.supabase.co:5432/postgres
Environment: ✅ Production, ✅ Preview, ✅ Development
```

### Supabase Auth
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://gbrwmbyqzrfcgyneqzwc.supabase.co
Environment: ✅ Production, ✅ Preview, ✅ Development
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicndtYnlxenJmY2d5bmVxendjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTY1MTksImV4cCI6MjA3ODc3MjUxOX0.kXfj20u76hCt_b7obX4Qtfs3i9ONN1fC9KtYU2AzMb4
Environment: ✅ Production, ✅ Preview, ✅ Development
```

## 4. Deploy!

Vercel avtomatik deploy qiladi. Yoki **Deployments** bo'limida **Redeploy** tugmasini bosing.

## 5. Tekshirish

1. `https://your-project.vercel.app` - ochilishini tekshiring
2. `/login` - doctor account bilan kirish
3. `/patients` - bemorlar ro'yxati

## ⚠️ Muhim Eslatmalar

- **Database migration**: Agar database'da jadval'lar bo'lmasa, Supabase Dashboard > SQL Editor orqali migration'ni ishlating
- **Doctor account**: Supabase Dashboard > Authentication > Users orqali doctor account yarating
- **Build xatosi**: Vercel Dashboard > Deployments > Build Log'larni tekshiring

## 📚 Batafsil Qo'llanma

- `DEPLOY_CHECKLIST.md` - To'liq checklist
- `VERCEL_DEPLOY.md` - Batafsil qo'llanma

