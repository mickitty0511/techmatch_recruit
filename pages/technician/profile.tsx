import { useState } from 'react'
import TechnicianProfile from '../../components/TechnicianProfile'
import Layout from '../../components/Layout'

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    skills: [],
    certifications: [],
    portfolio: []
  })

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile)
    // Here you would typically send the updated profile to your backend
    console.log('Updated profile:', updatedProfile)
  }

  return (
    // <Layout>
    <div>
      <TechnicianProfile profile={profile} onUpdate={handleProfileUpdate} />
    </div>
    // {/* </Layout> */}
  )
}

export default ProfilePage