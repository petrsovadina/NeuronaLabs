import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>NeuronaLabs</title>
        <meta name="description" content="Správa a zobrazování zdravotnických dat pacientů" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-20">
        <h1 className="text-4xl font-bold mb-8">
          Vítejte v NeuronaLabs
        </h1>
        <p className="mb-8">
          Systém pro správu a zobrazování zdravotnických dat pacientů
        </p>
        <Link href="/patients">
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Zobrazit seznam pacientů
          </a>
        </Link>
      </main>
    </div>
  )
}

