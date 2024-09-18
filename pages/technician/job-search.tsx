import React, { useState } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import JobSearch from '../../components/JobSearch';
import { findMatchingJobs } from '../../lib/matching';
import JobCard from '../../components/JobCard';

const JobSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!searchTerm.trim()) {
        throw new Error('検索語を入力してください')
      }

      const skills = searchTerm.split(',').map(s => s.trim())
      const matchedJobs = await findMatchingJobs(skills)
      setJobs(matchedJobs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <PageHeader
        title="求人検索"
        description="あなたのスキルにマッチする求人を見つけましょう"
        bgColor="bg-purple-500"
        textColor="text-white"
        descriptionColor="text-white"
        borderColor="border-purple-700"
      />
      <div className="container mx-auto px-4 py-8">
        <JobSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          loading={loading}
        />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="mt-8 space-y-4">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <JobCard key={job.id} title={job.title} company={job.company} score={job.score} />
            ))
          ) : (
            <p className="text-center text-gray-600">
              {searchTerm ? '該当する求人が見つかりませんでした。' : '求人を検索してください。'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;