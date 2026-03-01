import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title:       'Kontakt — OutdoorBalkans',
  description: 'Kontaktiraj OutdoorBalkans tim. Predloži lokaciju, prijavi grešku ili uspostavi saradnju.',
}

export default function KontaktPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Kontakt</h1>
        <p className="text-gray-500 text-lg">Tu smo za svako pitanje, predlog ili saradnju</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        {/* Predlog lokacije */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
          <div className="text-3xl mb-3">📍</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Predloži lokaciju</h2>
          <p className="text-gray-600 text-sm mb-4">
            Znaš dobro mesto za ribolov ili lov? Podeli ga sa zajednicom i pomozi drugima!
          </p>
          <Link href="/predlozi-lokaciju"
            className="inline-block bg-green-700 text-white px-4 py-2.5 rounded-xl
                       text-sm font-semibold hover:bg-green-800 transition-colors">
            Predloži lokaciju →
          </Link>
        </div>

        {/* Email */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <div className="text-3xl mb-3">📧</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Email</h2>
          <p className="text-gray-600 text-sm mb-4">
            Za poslovne upite, saradnju i reklame kontaktiraj nas direktno.
          </p>
          <a href="mailto:info@outdoorbalkans.com"
            className="inline-block bg-blue-600 text-white px-4 py-2.5 rounded-xl
                       text-sm font-semibold hover:bg-blue-700 transition-colors">
            info@outdoorbalkans.com →
          </a>
        </div>

        {/* Prijavi grešku */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <div className="text-3xl mb-3">🐛</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Prijavi grešku</h2>
          <p className="text-gray-600 text-sm mb-4">
            Pronašao si netačnu informaciju ili tehnički problem? Javi nam!
          </p>
          <a href="mailto:info@outdoorbalkans.com?subject=Prijava greške"
            className="inline-block bg-orange-500 text-white px-4 py-2.5 rounded-xl
                       text-sm font-semibold hover:bg-orange-600 transition-colors">
            Prijavi grešku →
          </a>
        </div>

        {/* Zajednica */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
          <div className="text-3xl mb-3">👥</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Zajednica</h2>
          <p className="text-gray-600 text-sm mb-4">
            Registruj se, komentariši lokacije i budi deo rastuće outdoor zajednice Balkana.
          </p>
          <Link href="/prijava"
            className="inline-block bg-purple-600 text-white px-4 py-2.5 rounded-xl
                       text-sm font-semibold hover:bg-purple-700 transition-colors">
            Pridruži se →
          </Link>
        </div>
      </div>

      {/* O nama */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">O OutdoorBalkans</h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          OutdoorBalkans je open-source community platforma za sve ljubitelje lova, ribolova
          i planinarenja na Balkanu. Naš cilj je da sakupimo sve lokacije na jednom mestu i
          pomognemo outdoor zajednici da deli znanje i iskustva.
        </p>
        <p className="text-gray-400 text-sm mt-4">
          © 2025 OutdoorBalkans.com · Sva prava zadržana
        </p>
      </div>
    </main>
  )
}
