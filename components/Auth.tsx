import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { FaEnvelope, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import Link from 'next/link'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        if (error.message === 'email rate limit exceeded') {
          setError('メール発行数上限に達しました。恐れ入りますが時間を置いて\n再度お試しください。');
        } else {
          throw error;
        }
      } else {
        setLoginSuccess(true);
      }
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            TechMatch にログイン
          </h2>
        </div>
        {loginSuccess && (
          <div className="max-w-sm mx-auto bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center justify-center text-center" role="alert">
            <div className="flex items-center">
              <FaCheck className="flex-shrink-0 text-green-500 mr-3" />
              <div>
                <p className="font-medium">ログイン確認メールを送信しました！</p>
                <p className="text-sm">メールを確認してログインしてください。</p>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="max-w-sm mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-center text-center" role="alert">
            <div className="flex items-center">
              <FaExclamationTriangle className="flex-shrink-0 text-red-500 mr-3" />
              <div>
                {error.split(/(?<=。|！|？)|\n/).map((sentence, index) => (
                  <p key={index} className={index === 0 ? 'font-medium' : 'text-sm mt-1'}>
                    {sentence.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-t-md rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="メールアドレスを入力"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginSuccess}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`group relative flex justify-center items-center py-3 px-8 border border-transparent text-base font-medium rounded-md text-white ${
                loginSuccess
                  ? 'bg-green-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2'
              } ${loading ? 'cursor-not-allowed' : ''}`}
              disabled={loading || loginSuccess}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ユーザ情報確認中
                </>
              ) : loginSuccess ? (
                <>
                  <FaCheck className="mr-3" />
                  送信成功！
                </>
              ) : (
                <>
                  <FaEnvelope className="mr-3" />
                  ログインリンクを受け取る
                </>
              )}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            アカウントをお持ちでない方は
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              こちらからサインアップ
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}