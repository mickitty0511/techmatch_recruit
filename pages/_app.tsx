import { AuthProvider } from '../contexts/AuthContext'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <link rel="icon" href="/favicon/home_favicon.svg" />
      </Head>
      <div className="select-none"> {/* この行を追加 */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </AuthProvider>
  )
}

export default MyApp