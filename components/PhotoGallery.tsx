'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  locationId: number
  locationSlug: string
}

export default function PhotoGallery({ locationId, locationSlug }: Props) {
  const [photos, setPhotos] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadPhotos() }, [locationId])

  async function loadPhotos() {
    const { data } = await supabase
      .from('location_photos')
      .select('id, url, caption, uploaded_at')
      .eq('location_id', locationId)
      .eq('is_approved', true)
      .order('uploaded_at', { ascending: false })
    setPhotos(data ?? [])
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setMsg('Maksimum 10MB.'); return }
    setUploading(true)
    setMsg('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setMsg('Morate biti ulogovani.'); setUploading(false); return }
      const ext = file.name.split('.').pop()
      const path = locationSlug + '/' + Date.now() + '.' + ext
      const { error: uploadError } = await supabase.storage
        .from('location-images').upload(path, file, { upsert: false })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage
        .from('location-images').getPublicUrl(path)
      const { error: dbError } = await supabase.from('location_photos').insert({
        location_id: locationId, user_id: user.id,
        url: publicUrl, is_approved: false,
      })
      if (dbError) throw dbError
      setMsg('Hvala! Fotografija ceka odobravanje.')
      setShowUpload(false)
    } catch (err: any) {
      setMsg('Greska: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const SERIF = "'Fraunces','Playfair Display',Georgia,serif"

  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 700, color: '#0e1a0e', margin: 0 }}>
          📸 Fotografije ({photos.length})
        </h2>
        <button onClick={() => setShowUpload(!showUpload)}
          style={{ background: '#2d6a2d', color: '#fff', border: 'none', borderRadius: '10px',
            padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
          + Dodaj foto
        </button>
      </div>

      {msg && (
        <p style={{ fontSize: '0.82rem', padding: '10px 14px', borderRadius: '10px', marginBottom: '12px',
          background: msg.startsWith('Hvala') ? '#dcfce7' : '#fee2e2',
          color: msg.startsWith('Hvala') ? '#166534' : '#991b1b' }}>
          {msg}
        </p>
      )}

      {showUpload && (
        <div style={{ background: '#f9f7f2', borderRadius: '14px', padding: '16px',
          border: '2px dashed #2d6a2d', marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.82rem', color: '#8fa68f', marginBottom: '10px' }}>
            Fotografije prolaze kroz odobravanje pre objavljivanja.
          </p>
          <label style={{ background: '#2d6a2d', color: '#fff', padding: '10px 20px',
            borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}>
            {uploading ? 'Uploadujem...' : '📷 Odaberi fotografiju'}
            <input type="file" accept="image/*" onChange={handleUpload}
              style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>
      )}

      {photos.length === 0 && !showUpload && (
        <div style={{ background: '#f9f7f2', borderRadius: '14px', padding: '32px',
          textAlign: 'center', border: '1px solid #f0ede6' }}>
          <p style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</p>
          <p style={{ fontSize: '0.9rem', color: '#8fa68f', marginBottom: '12px' }}>
            Budite prvi koji ce podeliti fotografiju ove lokacije!
          </p>
          <button onClick={() => setShowUpload(true)}
            style={{ background: '#2d6a2d', color: '#fff', border: 'none', borderRadius: '10px',
              padding: '10px 20px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
            + Dodaj prvu fotografiju
          </button>
        </div>
      )}

      {photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {photos.map(p => (
            <div key={p.id} onClick={() => setSelected(p.url)}
              style={{ borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                aspectRatio: '4/3', background: '#f0ede6' }}>
              <img src={p.url} alt="foto"
                style={{ width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.2s' }} />
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, cursor: 'pointer', padding: '20px' }}>
          <img src={selected} alt="foto"
            style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px',
              objectFit: 'contain' }} />
          <button onClick={() => setSelected(null)}
            style={{ position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
              borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem',
              cursor: 'pointer', fontWeight: 700 }}>×</button>
        </div>
      )}
    </div>
  )
}
