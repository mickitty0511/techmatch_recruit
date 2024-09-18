import React from 'react'

interface JobSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  loading: boolean;
}

const JobSearch: React.FC<JobSearchProps> = ({ searchTerm, setSearchTerm, handleSearch, loading }) => {
  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex items-center bg-white shadow-md rounded-lg overflow-hidden">
        <input
          type="text"
          id="searchTerm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="スキル、職種、キーワードで検索"
          className="flex-grow px-4 py-3 focus:outline-none"
        />
        <button 
          type="submit" 
          className="bg-purple-600 text-white px-6 py-3 hover:bg-purple-700 transition duration-300"
          disabled={loading}
        >
          {loading ? '検索中...' : '検索'}
        </button>
      </div>
      <div className="text-sm text-gray-600">
        例: Python, Java, プロジェクトマネージャー, AI開発
      </div>
    </form>
  )
}

export default JobSearch