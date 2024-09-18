import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import TechnicianProfile from '../components/TechnicianProfile'
import RecruiterProfile from '../components/RecruiterProfile'

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState('')
  const [profileData, setProfileData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    skills: [],
    certifications: [],
    // 他の必要なフィールド
  })
  const router = useRouter()

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth')
        return
      }

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUserType(data.user_type)
        setProfileData(data)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(updates) {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('No user')
      }

      const updatedData = {
        ...updates,
        id: user.id,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updatedData, {
        returning: 'minimal',
      })

      if (error) {
        throw error
      }

      setProfileData({ ...profileData, ...updates })
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {userType === 'engineer' && (
        <TechnicianProfile profile={profileData} onUpdate={updateProfile} />
      )}
      {userType === 'recruiter' && (
        <RecruiterProfile profile={profileData} onUpdate={updateProfile} />
      )}
    </div>
  )
}