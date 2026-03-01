'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { extractCoordinates } from '@/lib/queries'

// Kreiranje obojenih pinova za svaku kategoriju
function createPin(color: string) {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize:    [24, 24],
    iconAnchor:  [12, 24],
    popupAnchor: [0, -26],
    className:   '',
  })
}

export default function MapInner({ locations }: { locations: any[] }) {
  return (
    <MapContainer
      center={[44.0, 20.5]}  // Centar Balkana
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
      />

      {locations.map((loc) => {
        // Koristi sigurnu ekstrakciju — hvata sve formate
        const coords =
          (loc.lat && loc.lng)
            ? { lat: loc.lat, lng: loc.lng }
            : extractCoordinates(loc.coordinates)

        if (!coords) return null

        const countrySlug = loc.country_slug_out ?? loc.countries?.slug ?? ''
        const catSlug     = loc.category_slug    ?? loc.categories?.slug ?? ''
        const color       = loc.category_color   ?? loc.categories?.color ?? '#1E90FF'
        const regionName  = loc.region_name      ?? loc.regions?.name ?? ''

        return (
          <Marker
            key={loc.id}
            position={[coords.lat, coords.lng]}
            icon={createPin(color)}
          >
            <Popup>
              <div style={{ minWidth: '160px' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>
                  {loc.name}
                </strong>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {loc.category_name ?? loc.categories?.name} · {regionName}
                </span>
                <br />
                <a
                  href={`/${countrySlug}/${catSlug}/${loc.slug}`}
                  style={{ fontSize: '12px', color: '#16a34a' }}
                >
                  Vidi detalje →
                </a>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
