import React from 'react'

interface JobCardProps {
  title: string
  company: string
  score: number
}

const JobCard: React.FC<JobCardProps> = React.memo(({ title, company, score }) => {
  return (
    <div className="bg-white p-4 mb-4 rounded shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">{company}</p>
      <p className="mt-2">マッチ度: {score}</p>
    </div>
  )
})

JobCard.displayName = 'JobCard'

export default JobCard