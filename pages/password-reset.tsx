import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEnvelope, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { supabase } from '../lib/supabase'; // Supabaseクライアントをインポート

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setMessage('パスワードリセットのリンクをメールで送信しました。');
      setIsSubmitted(true);
    } catch (error: any) {
      setMessage(`メールの送信に失敗しました。\n${error.message}`);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
          {isSubmitted ? (
            <>
              <FaCheck className="inline-block mr-2 text-green-500" />
              メールを送信しました
            </>
          ) : 'パスワードをリセットしましょう！'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              {!isSubmitted && (
                <p className="text-md text-gray-500 mb-2 text-center mb-10">
                  パスワードリセットリンクを送信する<br />
                  メールアドレスを入力してください。
                </p>
              )}
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 pl-10 sm:text-sm border-gray-300 rounded-md ${
                    isFocused ? 'bg-blue-100' : ''
                  }`}
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={isSubmitted}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitted ? 'bg-green-600 cursor-default' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
                disabled={isLoading || isSubmitted}
              >
                {isLoading ? '送信中...' : isSubmitted ? (
                  <>
                    <FaCheck className="mr-2" />
                    送信済み
                  </>
                ) : 'リンクを送信'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-6 ${isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'} px-4 py-3 rounded relative text-center`} role="alert">
              <span className="block sm:inline whitespace-pre-line">{message}</span>
            </div>
          )}

          <div className="mt-6">
            <Link href="/" className="flex items-center justify-center font-medium text-indigo-600 hover:text-indigo-500">
              <FaArrowLeft className="mr-2" />
              ログインページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;