import { supabase } from './supabase'

export async function findMatchingJobs(technicianSkills: string[]) {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')

  if (error) {
    throw new Error('求人情報の取得に失敗しました')
  }

  // 単純なスキルマッチングロジック
  const matchedJobs = jobs.filter(job => {
    const jobSkills = job.requirements.toLowerCase().split(',').map(s => s.trim())
    return technicianSkills.some(skill => jobSkills.includes(skill.toLowerCase()))
  })

  // スコアリングとソート
  const scoredJobs = matchedJobs.map(job => {
    const score = technicianSkills.filter(skill => 
      job.requirements.toLowerCase().includes(skill.toLowerCase())
    ).length
    return { ...job, score }
  }).sort((a, b) => b.score - a.score)

  return scoredJobs
}