import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from './supabase'

export function generateCSRFToken() {
  return Math.random().toString(36).substring(2, 15)
}

export async function setCSRFToken(req: NextApiRequest, res: NextApiResponse) {
  const token = generateCSRFToken()
  await supabase.from('csrf_tokens').insert({ token })
  res.setHeader('Set-Cookie', `csrfToken=${token}; HttpOnly; Secure; SameSite=Strict`)
}

export async function validateCSRFToken(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.csrfToken
  const { data, error } = await supabase
    .from('csrf_tokens')
    .select()
    .eq('token', token)
    .single()

  if (error || !data) {
    res.status(403).json({ error: 'Invalid CSRF token' })
    return false
  }

  await supabase.from('csrf_tokens').delete().eq('token', token)
  return true
}