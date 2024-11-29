import Head from 'next/head'
import LoginForm from '../components/LoginForm'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Přihlášení | NeuronaLabs</title>
      </Head>

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Přihlášení do NeuronaLabs
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

