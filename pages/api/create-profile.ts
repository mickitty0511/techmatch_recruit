import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // プロフィールが既に存在するか確認
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (existingProfile) {
    return res.status(200).json({ message: 'Profile already exists' })
  }

  // 新しいプロフィールを作成
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email,
      user_type: user.user_metadata.user_type,
    })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  return res.status(200).json({ message: 'Profile created successfully' })
}