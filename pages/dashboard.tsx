import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

const Dashboard: NextPage = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState('')
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single()

        if (profile) {
          setUserType(profile.user_type)
        } else {
          // プロフィールが存在しない場合、作成を試みる
          await createProfile(user)
        }
      }
      setLoading(false)
    }

    getUser()
  }, [])

  const createProfile = async (user: any) => {
    try {
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) {
        throw new Error('プロフィールの作成に失敗しました')
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      if (profile) {
        setUserType(profile.user_type)
      }
    } catch (error) {
      console.error('プロフィール作成エラー:', error)
      // エラーハンドリング（例：ユーザーに通知する）
    }
  }

  if (loading) return <div>Loading...</div>
  if (!user) {
    router.push('/auth')
    return null
  }

  return (
    <div>
      <Head>
        <title>TechMatch - ダッシュボード</title>
        <meta name="description" content="TechMatchのユーザーダッシュボード" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">ホーム</h1>
        <div className="flex flex-wrap gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userType && (
              <div className="relative group overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105">
                <a href={userType === 'engineer' ? "/technician/profile" : "/recruiter/profile"} className="block">
                  <img 
                    src={userType === 'engineer' ? "/imgs/engineer_user_update.jpg" : "/imgs/recruiter_user_update.jpg"} 
                    alt="プロフィールを更新" 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <span className="text-white text-sm font-medium group-hover:hidden">プロフィールを更新</span>
                    <span className="text-white text-sm font-medium hidden group-hover:block">
                      {userType === 'engineer' ? "スキルや経験を最新に" : "求人者から信頼を"}
                    </span>
                  </div>
                </a>
              </div>
            )}
            {userType === 'recruiter' && (
              <div className="relative group overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105">
                <a href="/company/post-job" className="block">
                  <img
                    src="/imgs/job_posting.jpg"
                    alt="求人掲載"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <span className="text-white text-sm font-medium group-hover:hidden">求人掲載</span>
                    <span className="text-white text-sm font-medium hidden group-hover:block">
                      求める人物像を掲載しよう
                    </span>
                  </div>
                </a>
              </div>
            )}
            {userType === 'engineer' && (
              <div className="relative group overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105">
                <a href="/technician/job-search" className="block">
                  <img
                    src="/imgs/search_jobs.jpg"
                    alt="求人検索"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <span className="text-white text-sm font-medium group-hover:hidden">求人検索</span>
                    <span className="text-white text-sm font-medium hidden group-hover:block">
                      希望の条件で仕事を探そう
                    </span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard