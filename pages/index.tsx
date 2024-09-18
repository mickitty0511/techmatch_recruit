import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRocket, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Head>
        <title>TechMatch - エンジニアと企業を繋ぐAIマッチングプラットフォーム</title>
        <meta name="description" content="TechMatchは、最先端AIを駆使してエンジニアと企業の最適なマッチングを実現します。キャリアアップと採用効率化を同時に叶える、次世代型プラットフォームです。" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-blue-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              TechMatch
            </span>
          </h1>
          <p className="text-2xl text-gray-700 mb-8">エンジニアと企業を繋ぐAIマッチングプラットフォーム</p>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
            無料で始める
          </Link>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">TechMatchが選ばれる理由</h2>
          <div className="space-y-16">
            <div>
              <div className="flex items-center mb-8 bg-blue-100 py-4 px-6 rounded-lg shadow-md">
                <FontAwesomeIcon icon={faRocket} className="text-blue-700 mr-4" size="lg" />
                <h3 className="text-2xl font-bold text-blue-700">
                  エンジニアの皆様へ：キャリアの可能性を最大化
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureCard
                  title="あなたに合った仕事が見つかる"
                  description="独自の技術であなたのスキルと企業の求める人物像を徹底的に分析し、最適なマッチングを実現します。"
                  imageSrc="/imgs/suggest_matching_job_desc.jpg"
                />
                <FeatureCard
                  title="キャリア分析と提案"
                  description="あなたのスキルセットを分析し、市場価値を可視化。次のステップアップに向けたアドバイスを提供します。"
                  imageSrc="/imgs/skill-based matching.jpg"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center mb-8 bg-teal-100 py-4 px-6 rounded-lg shadow-md">
                <FontAwesomeIcon icon={faChartLine} className="text-teal-700 mr-4" size="lg" />
                <h3 className="text-2xl font-bold text-teal-700">
                  リクルーターの皆様へ：採用革命を起こす最先端ツール
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureCard
                  title="効率的な採用プロセス"
                  description="膨大な候補者の中から、企業様の求める条件に最適な人材をスピーディーにご紹介します。採用活動の効率化を強力にサポートします。"
                  imageSrc="/imgs/efficient_recruting_support.jpg"
                />
                <FeatureCard
                  title="豊富なネットワーク"
                  description="トップのテック企業から急成長中のスタートアップまで、幅広い求人情報と優秀な技術者プロフィールにアクセスできます。"
                  imageSrc="/imgs/variety_jobs_profiles.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">あなたのキャリアを次のステージへ</h2>
          <p className="text-xl text-gray-700 mb-8">TechMatchで、理想の仕事と出会いましょう</p>
          <Link href="/signup" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
            今すぐ登録する
          </Link>
        </div>
      </main>
    </div>
  )
}

const FeatureCard = ({ title, description, imageSrc }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
    <div className="relative h-48">
      <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
)

export default Home