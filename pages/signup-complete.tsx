import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { FaEnvelope } from 'react-icons/fa' // 他のアイコンを一時的に削除

const SignupComplete: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>登録完了 - TechMatch</title>
        <meta name="description" content="TechMatchの登録が完了しました" />
      </Head>

      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登録が完了しました！
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            メールアプリで確認メールをご確認ください。
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div className="flex items-center justify-center text-5xl text-indigo-600">
                <FaEnvelope />
              </div>
              <p className="text-sm text-gray-500">
                登録したメールアドレスに確認メールを送信しました。<br />
                メール内のリンクをクリックして、<br />
                アカウントを有効化してください。
              </p>
              <a href="mailto:" className="text-indigo-600 underline">
                メールアプリを開く
              </a>
              {/* メールアプリ選択セクションを一時的に削除 */}
            </div>
          </div>

          <div>
            <Link href="/auth" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              ログインページへ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupComplete