import { useState, KeyboardEvent, ChangeEvent } from 'react'
import PageHeader from './PageHeader'

const TechnicianProfile = ({ profile, onUpdate }) => {
  const [lastName, setLastName] = useState(profile.lastName || '')
  const [firstName, setFirstName] = useState(profile.firstName || '')
  const [emailLocalPart, setEmailLocalPart] = useState(profile.email ? profile.email.split('@')[0] : '')
  const [emailDomain, setEmailDomain] = useState(profile.email ? profile.email.split('@')[1] : '')
  const [emailError, setEmailError] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || '')
  const [phoneNumberError, setPhoneNumberError] = useState('')
  const [skills, setSkills] = useState(profile.skills || []) // 初期値を空の配列に設定
  const [newSkill, setNewSkill] = useState('')
  const [certifications, setCertifications] = useState(profile.certifications || []) // 初期値を空の配列に設定
  const [newCertification, setNewCertification] = useState('')
  const [customDomain, setCustomDomain] = useState('')

  const emailDomains = ['gmail.com', 'yahoo.co.jp', 'outlook.com', 'icloud.com', 'docomo.ne.jp', 'ezweb.ne.jp', 'softbank.ne.jp', 'その他']

  const handleAddItem = (items: string[], setItems: React.Dispatch<React.SetStateAction<string[]>>, newItem: string, setNewItem: React.Dispatch<React.SetStateAction<string>>) => {
    if (newItem.trim() !== '' && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()])
      setNewItem('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, items: string[], setItems: React.Dispatch<React.SetStateAction<string[]>>, newItem: string, setNewItem: React.Dispatch<React.SetStateAction<string>>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddItem(items, setItems, newItem, setNewItem)
    }
  }

  const handleRemoveItem = (items: string[], setItems: React.Dispatch<React.SetStateAction<string[]>>, itemToRemove: string) => {
    setItems(items.filter(item => item !== itemToRemove))
  }

  const validatePhoneNumber = (number: string): boolean => {
    // Allow only numbers, remove regex for hyphenated format
    const phoneRegex = /^(0\d{9,10})$/
    return phoneRegex.test(number)
  }

  const validateEmail = (localPart: string, domain: string): boolean => {
    const email = `${localPart}@${domain}`
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailLocalPartChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (input.includes('@')) {
      const [localPart, domainPart] = input.split('@')
      setEmailLocalPart(localPart)
      
      if (domainPart) {
        const matchedDomain = emailDomains.find(domain => 
          domain.toLowerCase().startsWith(domainPart.toLowerCase()) && domain !== 'その他'
        )
        if (matchedDomain) {
          setEmailDomain(matchedDomain)
          setCustomDomain('')
        } else {
          setEmailDomain('その他')
          setCustomDomain(domainPart)
        }
      } else {
        setEmailDomain('')
        setCustomDomain('')
      }
    } else {
      setEmailLocalPart(input)
    }
    
    validateAndSetEmailError(input.split('@')[0], emailDomain === 'その他' ? customDomain : emailDomain)
  }

  const handleEmailDomainChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const input = e.target.value
    setEmailDomain(input)
    if (input === 'その他') {
      setCustomDomain('')
    } else {
      setCustomDomain('')
    }
    validateAndSetEmailError(emailLocalPart, input === 'その他' ? customDomain : input)
  }

  const handleCustomDomainChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setCustomDomain(input)
    validateAndSetEmailError(emailLocalPart, input)
  }

  const validateAndSetEmailError = (localPart: string, domain: string) => {
    if (localPart.length > 0 && domain.length > 0 && !validateEmail(localPart, domain)) {
      setEmailError('有効なメールアドレスを入力してください')
    } else {
      setEmailError('')
    }
  }

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '') // Remove all non-digit characters
    setPhoneNumber(input)

    if (input.length > 0 && !validatePhoneNumber(input)) {
      setPhoneNumberError('有効な日本の電話番号を入力してください')
    } else {
      setPhoneNumberError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumberError || emailError) {
      alert('電話番号とメールアドレスを正しく入力してください')
      return
    }
    const email = `${emailLocalPart}@${emailDomain === 'その他' ? customDomain : emailDomain}`
    onUpdate({
      lastName,
      firstName,
      email,
      phoneNumber,
      skills,
      certifications,
      portfolio: profile.portfolio
    })
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <PageHeader
        title="エンジニアプロフィール登録"
        description="エンジニアのプロフィールを作成してください。"
        bgColor="bg-blue-50"
        textColor="text-blue-800"
        borderColor="border-blue-100"
      />
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="p-6 space-y-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">姓</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 山田"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">名</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 太郎"
              />
            </div>
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">スキル</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                  {skill}
                  <button type="button" onClick={() => handleRemoveItem(skills, setSkills, skill)} className="ml-1 text-blue-600 hover:text-blue-800">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, skills, setSkills, newSkill, setNewSkill)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="培ったスキルを入力し、Enterキーで追加"
            />
          </div>
          <div>
            <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">資格</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {certifications.map((cert, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
                  {cert}
                  <button type="button" onClick={() => handleRemoveItem(certifications, setCertifications, cert)} className="ml-1 text-green-600 hover:text-green-800">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              id="newCertification"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, certifications, setCertifications, newCertification, setNewCertification)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="取得済み資格を入力し、Enterキーで追加"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <div className="flex flex-wrap">
              <input
                type="text"
                id="emailLocalPart"
                value={emailLocalPart}
                onChange={handleEmailLocalPartChange}
                className={`flex-grow px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="@以前のメールアドレスを入力"
              />
              <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 border-r-gray-400 bg-gray-100 text-gray-500">
                @
              </span>
              <select
                id="emailDomain"
                value={emailDomain}
                onChange={handleEmailDomainChange}
                className={`px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} ${emailDomain === 'その他' ? 'rounded-r-none bg-gray-100 border-l-gray-400' : 'rounded-r-md'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">ドメインを選択</option>
                {emailDomains.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
              {emailDomain === 'その他' && (
                <input
                  type="text"
                  value={customDomain}
                  onChange={handleCustomDomainChange}
                  className={`flex-grow px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${customDomain ? 'bg-white' : ''}`}
                  placeholder="カスタムドメイン"
                />
              )}
            </div>
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className={`w-full px-3 py-2 border ${phoneNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="例: 09012345678"
              pattern="\d*" // This attribute ensures only numeric input on mobile devices
              inputMode="numeric" // This suggests a numeric keyboard on mobile devices
            />
            {phoneNumberError && (
              <p className="mt-1 text-sm text-red-600">{phoneNumberError}</p>
            )}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t">
          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            プロフィールを更新
          </button>
        </div>
      </form>
    </div>
  )
}

export default TechnicianProfile