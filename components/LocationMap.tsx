'use client'
import { useEffect, useRef } from 'react'

interface Props { lat: number; lng: number; name: string; color: string }

export default function LocationMap({ lat, lng, name, color }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    const L = require('leaflet')
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
    const map = L.map(mapRef.current, { center: [lat, lng], zoom: 13, scrollWheelZoom: false })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap', maxZoom: 19,
    }).addTo(map)
    const icon = L.divIcon({
      html: '<div style="width:32px;height:32px;background:' + color + ';border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
      iconSize: [32, 32], iconAnchor: [16, 16], className: '',
    })
    L.marker([lat, lng], { icon }).addTo(map)
      .bindPopup('<strong>' + name + '</strong>').openPopup()
    mapInstanceRef.current = map
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } }
  }, [lat, lng, name, color])

  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0ede6' }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: '260px', width: '100%' }} />
    </div>
  )
}
