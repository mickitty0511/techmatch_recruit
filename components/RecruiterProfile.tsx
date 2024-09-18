import { useState } from 'react'
import { supabase } from '../lib/supabase'

const RecruiterProfile = ({ profile, onUpdate }) => {
  const [companyName, setCompanyName] = useState(profile.company_name || '')
  const [position, setPosition] = useState(profile.position || '')
  const [email, setEmail] = useState(profile.email || '')
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onUpdate({
      company_name: companyName,
      position,
      email,
      phone_number: phoneNumber,
    })
    alert('プロフィールが更新されました')
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-blue-600 text-white">
        <h2 className="text-2xl font-bold">リクルータープロフィール</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">会社名</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">役職</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">電話番号</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            プロフィールを更新
          </button>
        </div>
      </form>
    </div>
  )
}

export default RecruiterProfile