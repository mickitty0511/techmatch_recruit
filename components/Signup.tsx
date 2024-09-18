import { useState } from 'react'
import { supabase, getSignUpRedirectTo } from '../lib/supabase'
import { FaEnvelope, FaUser, FaBuilding, FaLock } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('engineer')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getSignUpRedirectTo(),
          data: {
            user_type: userType,
          },
        },
      });

      if (error) {
        if (error.message === 'User already registered') {
          throw new Error('このメールアドレスは既に登録されています。')
        }
        throw error;
      }

      if (data.user) {
        setMessage('登録が完了しました。確認メールをご確認ください。メール内のリンクをクリックすると、ダッシュボードにリダイレクトされます。')
      }

    } catch (error: any) {
      console.error('Signup error:', error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUserTypeChange = (type: string) => {
    console.log('User type changed to:', type)
    setUserType(type)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            TechMatch に新規登録しよう！
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="パスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500">ユーザタイプを選択</p>
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              className={`${
                userType === 'engineer'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } group relative flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => handleUserTypeChange('engineer')}
            >
              <FaUser className={`h-5 w-5 ${userType === 'engineer' ? 'text-white' : 'text-gray-400'} group-hover:text-indigo-400 mr-2`} />
              エンジニア
            </button>
            <button
              type="button"
              className={`${
                userType === 'recruiter'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } group relative flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              onClick={() => handleUserTypeChange('recruiter')}
            >
              <FaBuilding className={`h-5 w-5 ${userType === 'recruiter' ? 'text-white' : 'text-gray-400'} group-hover:text-green-400 mr-2`} />
              リクルーター
            </button>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                userType === 'engineer' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                userType === 'engineer' ? 'focus:ring-indigo-500' : 'focus:ring-green-500'
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登録中...
                </div>
              ) : '登録する'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            既にアカウントをお持ちの方は
            <Link href="/auth" className="font-medium text-indigo-600 hover:text-indigo-500">
              こちらからログイン
            </Link>
          </p>
        </div>
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">エラー：</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}