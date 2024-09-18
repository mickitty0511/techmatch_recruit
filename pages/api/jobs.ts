import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
    
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  } else if (req.method === 'POST') {
    const { title, description, requirements, company } = req.body
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ title, description, requirements, company }])
    
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}