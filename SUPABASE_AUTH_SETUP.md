# Supabase Authentication Setup

Bu qo'llanma Supabase Authentication'ni sozlash va doctor account yaratish uchun.

## 1. Environment Variables

`.env.local` fayliga quyidagi o'zgaruvchilarni qo'shing:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gbrwmbyqzrfcgyneqzwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicndtYnlxenJmY2d5bmVxendjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTY1MTksImV4cCI6MjA3ODc3MjUxOX0.kXfj20u76hCt_b7obX4Qtfs3i9ONN1fC9KtYU2AzMb4
```

## 2. Doctor Account Yaratish

### Supabase Dashboard orqali:

1. Supabase Dashboard'ga kiring: https://supabase.com/dashboard
2. Project'ingizni tanlang
3. **Authentication** > **Users** bo'limiga o'ting
4. **Add user** tugmasini bosing
5. Quyidagi ma'lumotlarni kiriting:
   - **Email**: doctor@clinic.com (yoki o'zingizning email manzilingiz)
   - **Password**: Xavfsiz parol kiriting
   - **Auto Confirm User**: ✅ (belgilang)
6. **Create user** tugmasini bosing

### SQL orqali (ixtiyoriy):

Supabase SQL Editor'da quyidagi kodni ishlating:

```sql
-- Doctor account yaratish
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'doctor@clinic.com', -- O'zgartiring
  crypt('your_password_here', gen_salt('bf')), -- Parolni o'zgartiring
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Doctor"}',
  false,
  '',
  ''
);
```

**Eslatma**: SQL usuli murakkab, shuning uchun Dashboard orqali yaratish tavsiya etiladi.

## 3. Email Confirmation O'chirish (Development uchun)

Development muhitida email confirmation'ni o'chirish uchun:

1. Supabase Dashboard > **Authentication** > **Settings**
2. **Email Auth** bo'limida:
   - **Enable email confirmations**: O'chiring (development uchun)
   - Yoki **SMTP Settings**'ni sozlang (production uchun)

## 4. Test Qilish

1. Development server'ni ishga tushiring:
   ```bash
   npm run dev
   ```

2. Browser'da `/login` sahifasiga o'ting

3. Doctor account ma'lumotlari bilan kirish:
   - **Email**: doctor@clinic.com (yoki yaratgan email)
   - **Password**: Yaratgan parolingiz

4. Muvaffaqiyatli kirishdan keyin `/dashboard` sahifasiga o'tasiz

## 5. Production uchun

Production'da:

1. **Email confirmation**'ni yoqing
2. **SMTP Settings**'ni sozlang (email yuborish uchun)
3. **Password reset** funksiyasini yoqing
4. Xavfsiz parol siyosatini sozlang

## 6. Xavfsizlik

- Parolni xavfsiz saqlang
- Production'da environment variables'ni Vercel'da sozlang
- Supabase RLS (Row Level Security) policies'ni sozlang (agar kerak bo'lsa)

