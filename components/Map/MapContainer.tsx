'use client'

import dynamic from 'next/dynamic'

// OBAVEZNO: dynamic import sa ssr:false
// Leaflet zahteva browser window objekat — ne može se renderovati na serveru
const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border">
      <div className="text-center text-gray-500">
        <p className="text-2xl mb-2">🗺️</p>
        <p>Učitavam mapu...</p>
      </div>
    </div>
  ),
})

interface Props {
  locations: any[]
  height?: string
}

export default function MapContainer({ locations, height = 'h-96' }: Props) {
  return (
    <div className={`w-full ${height} rounded-lg overflow-hidden shadow-md border`}>
      <MapInner locations={locations} />
    </div>
  )
}
