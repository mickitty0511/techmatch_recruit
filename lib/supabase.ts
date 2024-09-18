import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// サインアップ時のリダイレクトURLを取得する関数
export const getSignUpRedirectTo = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/dashboard`
  }
  return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`
}