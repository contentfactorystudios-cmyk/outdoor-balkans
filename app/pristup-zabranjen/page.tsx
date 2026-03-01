import Link from 'next/link'

export default function PristupZabranjen() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pristup zabranjen</h1>
        <p className="text-gray-500 mb-6">
          Ovaj deo sajta je dostupan samo administratorima.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/"
            className="bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-800">
            Početna stranica
          </Link>
          <Link href="/prijava"
            className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50">
            Odjavi se
          </Link>
        </div>
      </div>
    </main>
  )
}
