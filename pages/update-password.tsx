import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaLock, FaCheck } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event, session);
      console.log(event)
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSession) {
      setMessage('有効なセッションがありません。パスワードリセットのリンクを再度お試しください。');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('パスワードが一致しません。');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage('パスワードが正常に更新されました。');
      setIsSubmitted(true);
      setTimeout(() => router.push('/'), 3000); // 3秒後にログインページにリダイレクト
    } catch (error: any) {
      setMessage(`エラーが発生しました: ${error.message}`);
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
              パスワードを更新しました
            </>
          ) : 'パスワードを更新'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                新しいパスワード
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitted}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                パスワードの確認
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? '更新中...' : isSubmitted ? (
                  <>
                    <FaCheck className="mr-2" />
                    更新済み
                  </>
                ) : 'パスワードを更新'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-6 ${message.includes('エラー') ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'} px-4 py-3 rounded relative`} role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;