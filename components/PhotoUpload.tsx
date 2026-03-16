'use client'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  locationId: number
  locationSlug: string
  onUploaded?: () => void
}

export default function PhotoUpload({ locationId, locationSlug, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setMsg('Fajl je prevelik. Maksimum 10MB.')
      return
    }

    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setMsg('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setMsg('Morate biti ulogovani.'); setUploading(false); return }

      const ext = file.name.split('.').pop()
      const path = locationSlug + '/' + Date.now() + '.' + ext

      const { error: uploadError } = await supabase.storage
        .from('location-images')
        .upload(path, file, { upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('location-images')
        .getPublicUrl(path)

      const { error: dbError } = await supabase
        .from('location_photos')
        .insert({
          location_id: locationId,
          user_id: user.id,
          url: publicUrl,
          is_approved: false,
        })

      if (dbError) throw dbError

      setMsg('Hvala! Fotografija je poslata na odobravanje.')
      onUploaded?.()
    } catch (err: any) {
      setMsg('Greska: ' + err.message)
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const SERIF = "'Fraunces','Playfair Display',Georgia,serif"

  return (
    <div style={{ background: '#f9f7f2', borderRadius: '16px', padding: '20px', border: '1px solid #f0ede6' }}>
      <h3 style={{ fontFamily: SERIF, fontSize: '1rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '12px' }}>
        📸 Dodaj fotografiju
      </h3>
      <p style={{ fontSize: '0.82rem', color: '#8fa68f', marginBottom: '14px' }}>
        Podelite svoju fotografiju sa zajednicom. Fotografije prolaze kroz odobravanje pre objavljivanja.
      </p>

      {preview && (
        <img src={preview} alt="preview"
          style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
      )}

      {msg && (
        <p style={{ fontSize: '0.82rem', padding: '10px 14px', borderRadius: '10px', marginBottom: '12px',
          background: msg.startsWith('Hvala') ? '#dcfce7' : '#fee2e2',
          color: msg.startsWith('Hvala') ? '#166534' : '#991b1b' }}>
          {msg}
        </p>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload}
        style={{ display: 'none' }} />

      <button onClick={() => fileRef.current?.click()} disabled={uploading}
        style={{ width: '100%', padding: '11px', borderRadius: '12px', border: '2px dashed #2d6a2d',
          background: 'transparent', color: '#2d6a2d', fontWeight: 600, fontSize: '0.88rem',
          cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
        {uploading ? '⏳ Uploadujem...' : '📷 Odaberi fotografiju'}
      </button>
    </div>
  )
}
