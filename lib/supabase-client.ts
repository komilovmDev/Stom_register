'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only log errors in browser (not during build/SSR)
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please add the following to your .env.local file:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
}

// Create client with fallback values to prevent runtime errors
// In production, these should be set via environment variables
// Use lazy initialization to prevent blocking during build
let supabaseClient: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
  if (supabaseClient) return supabaseClient
  
  supabaseClient = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
      auth: {
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: typeof window !== 'undefined',
        detectSessionInUrl: typeof window !== 'undefined',
      },
    }
  )
  
  return supabaseClient
})()

