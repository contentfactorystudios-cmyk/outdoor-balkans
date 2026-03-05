'use client'

interface Props {
  category: string
  data: Record<string, any>
}

const ICONS: Record<string, string> = {
  vrste_ribe: '🐟', tip_vode: '💧', tehnika: '🎣', prosecna_dubina_m: '📏',
  dozvola_tip: '📋', dozvola_cena_rsd: '💰', dozvola_kontakt: '📞',
  pristup_vozilom: '🚗', ugostiteljstvo_blizina: '🍽️', rekordni_ulov: '🏆',
  divljac: '🦌', tip_terena: '🌲', sezona_od: '📅', sezona_do: '📅',
  lovcko_udruzenje: '🏛️', smestaj_blizina: '🏠',
  duzina_km: '📏', visinska_razlika_m: '⛰️', tezina: '💪',
  tip_staze: '🔄', markacije: '🚩', voda_na_stazi: '💧',
  preporucena_oprema: '🎒', pogled: '🌄', najvisa_tacka_mnm: '🏔️',
  duzina_rute_km: '📏', tezina_brzaka: '🌊', trajanje_h: '⏱️',
  iznajmljivanje_opreme: '🛶', vodic_obavezan: '👤', pristaniste: '⚓',
  tip_kampa: '⛺', kapacitet_mesta: '👥', struja: '⚡', wc: '🚻',
  cena_po_noci_rsd: '💰', rezervacija: '📱', dozvoljena_vatra: '🔥',
  blizina_prodavnice_km: '🛒', povrsina_ha: '🗺️', osnovne_aktivnosti: '🥾',
  ulaznica_rsd: '🎫', radno_vreme: '🕐', visitor_centar: '🏛️',
  endemske_vrste: '🦅', UNESCO: '🌍', parking: '🅿️',
}

const LABELS: Record<string, string> = {
  vrste_ribe: 'Vrste ribe', tip_vode: 'Tip vode', tehnika: 'Tehnika ribolova',
  prosecna_dubina_m: 'Prosecna dubina', dozvola_tip: 'Tip dozvole',
  dozvola_cena_rsd: 'Cena dozvole', dozvola_kontakt: 'Kontakt za dozvolu',
  pristup_vozilom: 'Pristup vozilom', ugostiteljstvo_blizina: 'Ugostiteljstvo u blizini',
  rekordni_ulov: 'Rekordni ulov', divljac: 'Divljac', tip_terena: 'Tip terena',
  sezona_od: 'Sezona od', sezona_do: 'Sezona do', lovcko_udruzenje: 'Lovacko udruzenje',
  smestaj_blizina: 'Smestaj u blizini', duzina_km: 'Duzina staze',
  visinska_razlika_m: 'Visinska razlika', tezina: 'Tezina',
  tip_staze: 'Tip staze', markacije: 'Markacije', voda_na_stazi: 'Voda na stazi',
  preporucena_oprema: 'Preporucena oprema', pogled: 'Pogled', najvisa_tacka_mnm: 'Najvisa tacka',
  duzina_rute_km: 'Duzina rute', tezina_brzaka: 'Tezina brzaka', trajanje_h: 'Trajanje',
  iznajmljivanje_opreme: 'Iznajmljivanje opreme', vodic_obavezan: 'Vodic obavezan',
  pristaniste: 'Pristaniste', tip_kampa: 'Tip kampa', kapacitet_mesta: 'Kapacitet',
  struja: 'Struja', wc: 'WC', cena_po_noci_rsd: 'Cena po noci', rezervacija: 'Rezervacija',
  dozvoljena_vatra: 'Vatra dozvoljena', blizina_prodavnice_km: 'Prodavnica (km)',
  povrsina_ha: 'Povrsina (ha)', osnovne_aktivnosti: 'Aktivnosti', ulaznica_rsd: 'Ulaznica',
  radno_vreme: 'Radno vreme', visitor_centar: 'Visitor centar',
  endemske_vrste: 'Endemske vrste', UNESCO: 'UNESCO zastita', parking: 'Parking',
}

function formatValue(key: string, value: any): string {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'boolean') return value ? 'Da' : 'Ne'
  if (Array.isArray(value)) return value.join(', ')
  if (key.includes('rsd') && typeof value === 'number' && value > 0) return value.toLocaleString() + ' RSD'
  if (key.includes('_km') && typeof value === 'number' && value > 0) return value + ' km'
  if (key.endsWith('_m') && typeof value === 'number' && value > 0) return value + ' m'
  if (key.includes('_h') && typeof value === 'number' && value > 0) return value + 'h'
  if (key.includes('_ha') && typeof value === 'number' && value > 0) return value.toLocaleString() + ' ha'
  if (key.endsWith('mnm') && typeof value === 'number' && value > 0) return value + ' mnm'
  return String(value)
}

const CATEGORY_TITLES: Record<string, string> = {
  ribolov: '🎣 Ribolovacke informacije',
  lov: '🦌 Lovacke informacije',
  planinarenje: '🥾 Informacije o stazi',
  kajak: '🛶 Kajakacke informacije',
  kampovanje: '⛺ Informacije o kampu',
  'nacionalni-parkovi': '🌿 O nacionalnom parku',
}

export default function CategoryDetails({ category, data }: Props) {
  if (!data || Object.keys(data).length === 0) return null

  const entries = Object.entries(data).filter(([_, v]) => {
    if (v === null || v === undefined || v === '' || v === 0) return false
    if (Array.isArray(v) && v.length === 0) return false
    return true
  })

  if (entries.length === 0) return null

  const SERIF = "'Fraunces','Playfair Display',Georgia,serif"

  return (
    <div style={{
      background: '#f9f7f2', borderRadius: '16px', padding: '24px',
      border: '1px solid #f0ede6', marginTop: '24px'
    }}>
      <h2 style={{
        fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 700,
        color: '#0e1a0e', marginBottom: '20px'
      }}>
        {CATEGORY_TITLES[category] ?? '📋 Detalji lokacije'}
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {entries.map(([key, value]) => {
          const formatted = formatValue(key, value)
          if (!formatted) return null
          return (
            <div key={key} style={{
              background: '#fff', borderRadius: '12px', padding: '14px 16px',
              border: '1px solid #f0ede6'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#8fa68f', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                {ICONS[key] ?? '•'} {LABELS[key] ?? key}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0e1a0e', lineHeight: 1.4 }}>
                {formatted}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
