import { getCountries, getCategories } from '@/lib/queries'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

interface Props {
  params: Promise<{ country: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params
  const countries = await getCountries()
  const c = countries.find((c: any) => c.slug === country)
  if (!c) return {}
  return {
    title: `Lov i Ribolov u ${c.name}`,
    description: `Pronađi sve lokacije za lov i ribolov u ${c.name}.`,
  }
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params
  const countries  = await getCountries()
  const countryObj = countries.find((c: any) => c.slug === country)
  if (!countryObj) notFound()

  const categories = await getCategories(1)

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-green-600">Početna</Link>
        {' / '}
        <span className="text-gray-700">{countryObj.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Outdoor aktivnosti u {countryObj.name}
      </h1>
      <p className="text-gray-500 mb-10">Izaberi aktivnost da vidiš sve lokacije</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat: any) => (
          <Link key={cat.id} href={`/${country}/${cat.slug}`}
            className="bg-white border-2 rounded-2xl p-8 text-center
                       hover:shadow-xl hover:border-green-400 transition-all">
            <div className="text-5xl mb-3">{cat.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800">{cat.name}</h2>
          </Link>
        ))}
      </div>
    </main>
  )
}
