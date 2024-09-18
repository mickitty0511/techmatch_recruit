import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { FaUser, FaSpinner } from 'react-icons/fa'

const Navbar = () => {
  const { user, setUser, isLoggingOut, setIsLoggingOut } = useAuth()
  const router = useRouter()
  const [userType, setUserType] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserType(session.user.id)
      }
    })

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      authListener.subscription.unsubscribe()
    }
  }, [setUser]) // Add setUser to the dependency array

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    setIsLoggingOut(false)
    router.push('/')
  }

  const fetchUserType = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single()

      if (profile) {
        setUserType(profile.user_type)
      }
    } catch (error) {
      console.error('Error fetching user type:', error)
    }
  }

  const navItems = [
    userType === 'engineer' && { href: '/technician/job-search', label: '求人検索', color: 'purple' },
    userType === 'recruiter' && { href: '/company/post-job', label: '求人掲載', color: 'green' },
  ].filter(Boolean) as { href: string; label: string; color: string }[]

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img src="/tech_match_icon.svg" alt="TechMatch Logo" className="w-10 h-10 mr-2" />
            <Link href={user ? "/dashboard" : "/"} className="text-xl font-bold">
              TechMatch
            </Link>
          </div>
          <div className="space-x-4 flex items-center">
            {isLoggingOut ? (
              <div className="flex items-center text-gray-600">
                <FaSpinner className="animate-spin mr-2" />
                ログアウト中...
              </div>
            ) : user ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-gray-600 hover:text-gray-900 relative group`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-${item.color}-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-in-out`}></span>
                    {router.pathname === item.href && (
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-${item.color}-500`}></span>
                    )}
                  </Link>
                ))}
                <div className="relative" ref={menuRef}>
                  <FaUser
                    className="text-gray-600 hover:text-gray-900 cursor-pointer"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  />
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        ユーザー情報
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        ログアウト
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  無料で始める
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar