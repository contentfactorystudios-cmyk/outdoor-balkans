'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  itemType: 'location' | 'event'
  itemId: number
  size?: 'sm' | 'md'
}

export default function SaveButton({ itemType, itemId, size = 'md' }: Props) {
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [user,    setUser]    = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      setUser(u)
      if (!u) { setLoading(false); return }
      supabase.from('saved_items')
        .select('id')
        .eq('user_id', u.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .maybeSingle()
        .then(({ data: row }) => {
          setSaved(!!row)
          setLoading(false)
        })
    })
  }, [itemId, itemType])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { window.location.href = '/login'; return }
    setLoading(true)
    if (saved) {
      await supabase.from('saved_items')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
      setSaved(false)
    } else {
      await supabase.from('saved_items')
        .insert({ user_id: user.id, item_type: itemType, item_id: itemId })
      setSaved(true)
    }
    setLoading(false)
  }

  const sm = size === 'sm'

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? 'Ukloni iz sačuvanih' : 'Sačuvaj'}
      style={{
        background: saved ? '#fff0f0' : 'rgba(255,255,255,0.92)',
        border: saved ? '1.5px solid #fca5a5' : '1.5px solid rgba(255,255,255,0.6)',
        borderRadius: '50%',
        width: sm ? '32px' : '38px',
        height: sm ? '32px' : '38px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: loading ? 'default' : 'pointer',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        transition: 'all 0.2s',
        flexShrink: 0,
        fontSize: sm ? '0.9rem' : '1rem',
      }}
    >
      {loading ? '·' : saved ? '❤️' : '🤍'}
    </button>
  )
}
