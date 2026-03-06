'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// ─── ProposalCard — MORA biti prije AdminDashboard ───────────────
function ProposalCard({ prop, categories, countries, regions, onApprove, onReject }: any) {
  const [adminNote, setAdminNote] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiDone, setAiDone] = useState(!!prop.ai_short_description)
  const [editedProp, setEditedProp] = useState({ ...prop })
  const [editMode, setEditMode] = useState(false)

  const sc: Record<string,{bg:string,text:string}> = {
    pending:  { bg:'#fef3c7', text:'#92400e' },
    approved: { bg:'#d1fae5', text:'#065f46' },
    rejected: { bg:'#fee2e2', text:'#991b1b' },
  }
  const s = sc[prop.status] ?? sc.pending
  const isPending = prop.status === 'pending'

  async function runAI() {
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai-generate', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name: editedProp.geo_name || editedProp.name,
          category: editedProp.category_slug || editedProp.category,
          country: editedProp.geo_country || editedProp.country || 'Srbija',
          region: editedProp.geo_region || editedProp.region || '',
        })
      })
      const json = await res.json()
      if (json.data) {
        const d = json.data
        setEditedProp((prev: any) => ({
          ...prev,
          ai_name: d.name || prev.geo_name || prev.name,
          ai_short_description: d.short_description || '',
          ai_description: d.description || '',
          ai_best_season: d.best_season || '',
          ai_permit_required: d.permit_required ?? false,
          ai_category_data: d.category_data ?? {},
          ai_meta_title: d.meta_title || '',
          ai_quality_score: 85,
        }))
        setAiDone(true)
      }
    } catch {}
    setAiLoading(false)
  }

  function setField(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
      setEditedProp((prev: any) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #e5e7eb',
      overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1e3d1e,#2d6a2d)',
        padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.68rem', fontWeight:700,
            textTransform:'uppercase', marginBottom:'2px' }}>
            📍 {prop.email || 'Anonimno'} · {new Date(prop.created_at).toLocaleDateString('sr-RS')}
          </p>
          <p style={{ color:'#fff', fontWeight:800, fontSize:'0.95rem' }}>
            {editedProp.geo_name || editedProp.name || 'Nova lokacija'}
          </p>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <span style={{ background:s.bg, color:s.text, fontSize:'0.72rem',
            fontWeight:700, padding:'3px 10px', borderRadius:'999px' }}>{prop.status}</span>
          {isPending && (
            <button onClick={() => setEditMode(!editMode)}
              style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.35)',
                color:'#fff', borderRadius:'8px', padding:'5px 12px',
                cursor:'pointer', fontSize:'0.75rem', fontWeight:700 }}>
              {editMode ? '✓ Zatvori' : '✏️ Uredi'}
            </button>
          )}
        </div>
      </div>

      <div style={{ padding:'18px 20px' }}>
        {/* Slike */}
        {editedProp.photo_urls?.length > 0 && (
          <div style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
            {editedProp.photo_urls.map((url: string, i: number) => (
              <img key={i} src={url} alt=""
                style={{ width:'90px', height:'70px', objectFit:'cover',
                  borderRadius:'10px', border:'1px solid #e5e7eb' }} />
            ))}
          </div>
        )}

        {/* Info grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'14px' }}>
          {[
            { l:'Kategorija', v: editedProp.category || editedProp.category_slug },
            { l:'Region', v: editedProp.geo_region || editedProp.region },
            { l:'GPS', v: editedProp.lat ? `${Number(editedProp.lat).toFixed(4)}, ${Number(editedProp.lng).toFixed(4)}` : '—' },
          ].map(f => (
            <div key={f.l} style={{ background:'#f9fafb', borderRadius:'8px', padding:'8px 12px' }}>
              <p style={{ fontSize:'0.62rem', fontWeight:700, color:'#9ca3af',
                textTransform:'uppercase', marginBottom:'2px' }}>{f.l}</p>
              <p style={{ fontSize:'0.82rem', fontWeight:600, color:'#111827' }}>{f.v || '—'}</p>
            </div>
          ))}
        </div>

        {/* Nota korisnika */}
        {editedProp.note && (
          <div style={{ background:'#fffbeb', borderRadius:'10px', padding:'10px 14px',
            marginBottom:'12px', fontSize:'0.82rem', color:'#92400e' }}>
            💬 {editedProp.note}
          </div>
        )}

        {/* AI sekcija */}
        {!aiDone ? (
          <div style={{ background:'#eff6ff', borderRadius:'12px', padding:'16px',
            textAlign:'center', marginBottom:'14px', border:'1px solid #bfdbfe' }}>
            <p style={{ fontWeight:700, color:'#1e40af', marginBottom:'4px' }}>🤖 AI generisanje sadržaja</p>
            <p style={{ fontSize:'0.78rem', color:'#3b82f6', marginBottom:'12px' }}>
              Opis, SEO meta, sezona — automatski za 2 sekunde
            </p>
            <button onClick={runAI} disabled={aiLoading}
              style={{ background:aiLoading?'#bfdbfe':'#2563eb', color:'#fff', border:'none',
                borderRadius:'8px', padding:'8px 20px', fontWeight:700,
                fontSize:'0.82rem', cursor:aiLoading?'default':'pointer' }}>
              {aiLoading ? '⟳ Generišem...' : '⚡ Pokreni AI'}
            </button>
          </div>
        ) : editMode ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'14px' }}>
            {[
              { key:'ai_name', label:'Naziv', multi:false },
              { key:'ai_short_description', label:'Kratki opis', multi:true },
              { key:'ai_best_season', label:'Sezona', multi:false },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize:'0.68rem', fontWeight:700, color:'#6b7280',
                  textTransform:'uppercase', display:'block', marginBottom:'3px' }}>
                  🤖 {f.label}
                </label>
                {f.multi ? (
                  <textarea value={editedProp[f.key] || ''} onChange={setField(f.key)}
                    style={{ width:'100%', border:'1.5px solid #2d6a2d', borderRadius:'8px',
                      padding:'8px 10px', fontSize:'0.82rem', resize:'vertical',
                      minHeight:'60px', outline:'none', boxSizing:'border-box' as any }} />
                ) : (
                  <input value={editedProp[f.key] || ''} onChange={setField(f.key)}
                    style={{ width:'100%', border:'1.5px solid #2d6a2d', borderRadius:'8px',
                      padding:'8px 10px', fontSize:'0.82rem', outline:'none', boxSizing:'border-box' as any }} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background:'#f0fdf4', borderRadius:'10px', padding:'12px 14px',
            marginBottom:'14px', border:'1px solid #bbf7d0', fontSize:'0.82rem',
            color:'#166534', lineHeight:1.7 }}>
            <p>✅ <strong>AI opis:</strong> {editedProp.ai_short_description?.slice(0,120)}...</p>
            {editedProp.ai_best_season && <p>🗓️ <strong>Sezona:</strong> {editedProp.ai_best_season}</p>}
          </div>
        )}

        {/* GPS link */}
        {editedProp.lat && (
          <a href={`https://maps.google.com/?q=${editedProp.lat},${editedProp.lng}`}
            target="_blank" rel="noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'0.78rem',
              color:'#1d4ed8', fontWeight:600, marginBottom:'14px', textDecoration:'none' }}>
            🗺️ Otvori na Google Maps ↗
          </a>
        )}

        {/* Admin nota */}
        {isPending && (
          <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
            placeholder="Admin napomena (opciono — razlog odbijanja...)"
            style={{ width:'100%', border:'1.5px solid #e5e7eb', borderRadius:'10px',
              padding:'10px 12px', fontSize:'0.82rem', resize:'vertical',
              minHeight:'56px', outline:'none', marginBottom:'12px',
              boxSizing:'border-box' as any, background:'#fafaf9' }} />
        )}

        {/* Buttons */}
        {isPending && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            <button onClick={() => onReject(prop.id, adminNote)}
              style={{ padding:'11px', borderRadius:'10px', border:'2px solid #fca5a5',
                background:'#fff5f5', color:'#dc2626', fontWeight:700, fontSize:'0.85rem',
                cursor:'pointer' }}>
              ✕ Odbij
            </button>
            <button onClick={() => onApprove({ ...editedProp, id: prop.id })} disabled={!aiDone}
              style={{ padding:'11px', borderRadius:'10px', border:'none',
                background: aiDone ? 'linear-gradient(135deg,#1e3d1e,#2d6a2d)' : '#e5e7eb',
                color: aiDone ? '#fff' : '#9ca3af', fontWeight:700, fontSize:'0.85rem',
                cursor: aiDone ? 'pointer' : 'default',
                boxShadow: aiDone ? '0 4px 12px rgba(45,106,45,0.3)' : 'none' }}>
              {aiDone ? '✓ Odobri i objavi' : 'Pokreni AI prvo'}
            </button>
          </div>
        )}
        {!isPending && (
          <div style={{ background: prop.status==='approved' ? '#d1fae5' : '#fee2e2',
            borderRadius:'10px', padding:'12px', textAlign:'center', fontWeight:700,
            color: prop.status==='approved' ? '#065f46' : '#991b1b', fontSize:'0.88rem' }}>
            {prop.status==='approved' ? '✅ Odobreno i objavljeno' : '✕ Odbijeno'}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────
interface Props {
  user: any; countries: any[]; categories: any[]; regions: any[]; locations: any[]
}

function nameToSlug(name: string) {
  return name.toLowerCase()
    .replace(/[čć]/g, 'c').replace(/[šđ]/g, 's').replace(/ž/g, 'z')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return []
  const sep = lines[0].includes(';') ? ';' : ','
  const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).map(line => {
    const vals = line.split(sep).map(v => v.trim().replace(/^"|"$/g, ''))
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
  })
}

const EMPTY = {
  name: '', slug: '', short_description: '', description: '',
  country_id: '', region_id: '', category_id: '', lat: '', lng: '',
  meta_title: '', meta_description: '', best_season: '', category_data: {} as Record<string, any>,
  permit_required: false, permit_info: '', access_notes: '', is_published: true,
}

// ─── AdminDashboard ───────────────────────────────────────────────
export default function AdminDashboard({ user, countries, categories, regions, locations }: Props) {
  const router = useRouter()
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      if (!session) window.location.href = '/admin/login'
    })
  }, [])

  type Tab = 'locations' | 'add' | 'edit' | 'csv' | 'proposals'
  const [tab, setTab] = useState<Tab>('locations')
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMsg, setAiMsg] = useState('')
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([])
  const [csvMsg, setCsvMsg] = useState('')
  const [csvImporting, setCsvImporting] = useState(false)
  const [csvErrors, setCsvErrors] = useState<string[]>([])
  const [proposals, setProposals] = useState<any[]>([])
  const [proposalsLoading, setProposalsLoading] = useState(false)
  const [proposalMsg, setProposalMsg] = useState('')
  const [editLoc, setEditLoc] = useState<any>(null)
  const [editMsg, setEditMsg] = useState('')
  const [editAiLoading, setEditAiLoading] = useState(false)
  const [editAiMsg, setEditAiMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const ic = `w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500`
  const lc = `block text-sm font-medium text-gray-700 mb-1`

  async function handleAIGenerate() {
    if (!form.name.trim()) { setAiMsg('❌ Upiši naziv lokacije prvo!'); return }
    const cat = categories.find(c => c.id === parseInt(form.category_id))
    const ctr = countries.find(c => c.id === parseInt(form.country_id))
    const reg = regions.find(r => r.id === parseInt(form.region_id))
    setAiLoading(true); setAiMsg('🤖 AI generiše sadržaj...')
    try {
      const res = await fetch('/api/ai-generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, category: cat?.slug ?? 'ribolov', country: ctr?.name ?? 'Srbija', region: reg?.name ?? '' })
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error ?? 'Greška')
      const d = json.data
      setForm(f => ({ ...f,
        short_description: d.short_description ?? f.short_description,
        description: d.description ?? f.description,
        meta_title: d.meta_title ?? f.meta_title,
        meta_description: d.meta_description ?? f.meta_description,
        best_season: d.best_season ?? f.best_season,
        permit_required: d.permit_required ?? f.permit_required,
        permit_info: d.permit_info ?? f.permit_info,
        category_data: d.category_data ?? f.category_data,
      }))
      setAiMsg('✅ AI popunio polja! Proveri i izmeni po potrebi.')
    } catch (err: any) {
      setAiMsg(`❌ ${err.message}`)
    } finally { setAiLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg('')
    if (!form.lat || !form.lng) { setMsg('❌ GPS koordinate su obavezne!'); setSaving(false); return }
    const { error } = await supabase.rpc('insert_location_with_coords', {
      p_name: form.name, p_slug: form.slug || nameToSlug(form.name),
      p_short_description: form.short_description, p_description: form.description,
      p_country_id: parseInt(form.country_id), p_region_id: form.region_id ? parseInt(form.region_id) : null,
      p_category_id: parseInt(form.category_id), p_lng: parseFloat(form.lng), p_lat: parseFloat(form.lat),
      p_meta_title: form.meta_title || `${form.name} | OutdoorBalkans`,
      p_meta_description: form.meta_description || form.short_description,
      p_best_season: form.best_season || null, p_permit_required: form.permit_required,
      p_category_data: form.category_data || {},
      p_permit_info: form.permit_info || null, p_access_notes: form.access_notes || null, p_is_published: form.is_published,
    })
    if (error) { setMsg(`❌ Greška: ${error.message}`) }
    else { setMsg('✅ Lokacija uspešno dodata!'); setForm({ ...EMPTY }); setAiMsg(''); router.refresh() }
    setSaving(false)
  }

  function handleCSVFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const rows = parseCSV(ev.target?.result as string)
      setCsvRows(rows)
      setCsvMsg(rows.length > 0 ? `✅ Učitano ${rows.length} redova. Proveri preview pa klikni Import.` : '❌ Problem sa CSV formatom.')
      setCsvErrors([])
    }
    reader.readAsText(file)
  }

  async function handleCSVImport() {
    if (!csvRows.length) return
    setCsvImporting(true); setCsvMsg('⏳ Importujem...'); setCsvErrors([])
    const res = await fetch('/api/csv-import', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locations: csvRows }),
    })
    const data = await res.json()
    setCsvMsg(`✅ ${data.success} lokacija importovano. ${data.failed > 0 ? `❌ ${data.failed} grešaka.` : ''}`)
    if (data.errors?.length) setCsvErrors(data.errors)
    if (data.success > 0) { setCsvRows([]); router.refresh() }
    setCsvImporting(false)
  }

  function downloadTemplate() {
    const header = 'name;slug;lat;lng;category_slug;country_slug;region_name;short_description;best_season;permit_required'
    const rows = [
      'Uvac Kanjon;uvac-kanjon;43.4512;19.8934;ribolov;srbija;Zlatibor;Spektakularni kanjon sa bogatim ribolovom;April — Oktobar;false',
    ].join('\n')
    const blob = new Blob([header + '\n' + rows], { type: 'text/csv;charset=utf-8;' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'outdoorbalkans-template.csv' })
    a.click()
  }

  async function togglePublish(id: number, current: boolean) {
    await supabase.from('locations').update({ is_published: !current }).eq('id', id)
    router.refresh()
  }

  async function loadProposals() {
    setProposalsLoading(true)
    const { data } = await supabase
      .from('location_proposals')
      .select('*')
      .order('created_at', { ascending: false })
    setProposals(data ?? [])
    setProposalsLoading(false)
  }

  async function approveProposal(prop: any) {
    setProposalMsg('⏳ Odobravam...')
    const cat = categories.find(c => c.slug === prop.category_slug || c.name === prop.category)
    const country = countries.find(c => c.name === prop.country || c.slug === 'srbija')
    const region = regions.find(r => r.name === prop.region) ?? regions[0]
    const slug = (prop.ai_name || prop.geo_name || prop.name || 'lokacija')
      .toLowerCase()
      .replace(/[čć]/g,'c').replace(/[šđ]/g,'s').replace(/ž/g,'z')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
      + '-' + prop.id
    const { error } = await supabase.from('locations').insert({
      name: prop.ai_name || prop.geo_name || prop.name,
      slug,
      short_description: prop.ai_short_description || prop.description || '',
      description: prop.ai_description || prop.description || '',
      lat: prop.lat, lng: prop.lng,
      category_id: cat?.id ?? null,
      country_id: country?.id ?? null,
      region_id: region?.id ?? null,
      is_published: true, is_featured: false,
      best_season: prop.ai_best_season || '',
      permit_required: prop.ai_permit_required ?? false,
      image_url: prop.photo_urls?.[0] ?? null,
      category_data: prop.ai_category_data ?? {},
    })
    if (error) { setProposalMsg('❌ Greška: ' + error.message); return }
    await supabase.from('location_proposals')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', prop.id)
    setProposalMsg('✅ Lokacija objavljena na sajtu!')
    loadProposals()
  }

  async function rejectProposal(id: number, adminNote: string) {
    await supabase.from('location_proposals')
      .update({ status: 'rejected', admin_note: adminNote, reviewed_at: new Date().toISOString() })
      .eq('id', id)
    setProposalMsg('Predlog odbijen.')
    loadProposals()
  }

  const pendingCount = proposals.filter(p => p.status === 'pending').length

  const TABS: { id: Tab; label: string }[] = [
    { id: 'locations', label: `📋 Lokacije (${locations.length})` },
    { id: 'add', label: '✨ Dodaj + AI' },
    { id: 'csv', label: '📥 CSV Import' },
    { id: 'edit', label: editLoc ? `✏️ ${editLoc.name?.substring(0,20)}` : '✏️ Uredi' },
    { id: 'proposals', label: `🔔 Predlozi${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="text-xl">🏔️</span>
          <span className="font-bold">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-300 text-sm hidden sm:block">{user.email}</span>
          <a href="/" target="_blank" className="text-green-300 text-sm hover:text-white hidden sm:block">Vidi sajt →</a>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/admin/login') }}
            className="bg-green-800 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-lg">
            Odjavi se
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(t => (
            <button key={t.id}
              onClick={() => { setTab(t.id); if (t.id === 'proposals') loadProposals() }}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors
                ${tab === t.id ? 'bg-green-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'locations' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Naziv</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Kat.</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Država</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {locations.map((loc: any) => (
                    <tr key={loc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{loc.name}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{loc.categories?.icon} {loc.categories?.name}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{loc.countries?.name}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => togglePublish(loc.id, loc.is_published)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                            ${loc.is_published ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {loc.is_published ? '✅ Objavljeno' : '⏸️ Skriveno'}
                        </button>
                      </td>
                      <td className="px-4 py-3 flex gap-3 items-center">
                        {loc.countries?.slug && loc.categories?.slug && (
                          <a href={`/${loc.countries.slug}/${loc.categories.slug}/${loc.slug}`} target="_blank"
                            className="text-green-600 hover:text-green-800 text-xs font-medium">Vidi →</a>
                        )}
                        <button onClick={() => {
                          setEditLoc(loc)
                          setTab('edit')
                        }} className="text-blue-600 hover:text-blue-800 text-xs font-medium">✏️ Uredi</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!locations.length && <div className="text-center py-12 text-gray-400">Još nema lokacija.</div>}
            </div>
          </div>
        )}

        {tab === 'add' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Dodaj Novu Lokaciju</h2>
            <p className="text-gray-500 text-sm mb-6">Upiši naziv + odaberi kategoriju i državu → klikni AI dugme za automatsko popunjavanje.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={lc}>Naziv lokacije *</label>
                <input value={form.name} required className={ic} placeholder="npr. Uvac Kanjon"
                  onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: nameToSlug(e.target.value) }))} />
              </div>
              <div>
                <label className={lc}>Kategorija *</label>
                <select value={form.category_id} required className={ic} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                  <option value="">— Odaberi —</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={lc}>Država *</label>
                <select value={form.country_id} required className={ic} onChange={e => setForm(f => ({ ...f, country_id: e.target.value }))}>
                  <option value="">— Odaberi —</option>
                  {countries.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={lc}>Region</label>
                <select value={form.region_id} className={ic} onChange={e => setForm(f => ({ ...f, region_id: e.target.value }))}>
                  <option value="">— Odaberi —</option>
                  {regions.filter((r: any) => !form.country_id || r.country_id === parseInt(form.country_id))
                    .map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className={lc}>URL Slug</label>
                <input value={form.slug} className={ic} placeholder="auto-generisan"
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
              </div>
              <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-blue-900 mb-3">🗺️ GPS Koordinate * — Google Maps → desni klik → kopiraj</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lc}>Latitude (prva)</label>
                    <input value={form.lat} required type="number" step="any" className={ic} placeholder="44.9333"
                      onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} />
                  </div>
                  <div>
                    <label className={lc}>Longitude (druga)</label>
                    <input value={form.lng} required type="number" step="any" className={ic} placeholder="19.5667"
                      onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900">🤖 AI Asistent</p>
                    <p className="text-xs text-purple-600 mt-0.5">Automatski popunjava opis, SEO, sezonu i dozvole</p>
                  </div>
                  <button type="button" onClick={handleAIGenerate} disabled={aiLoading}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                    {aiLoading ? '⏳ Generiše...' : '✨ AI Generiši'}
                  </button>
                </div>
                {aiMsg && <p className={`text-sm mt-2 px-3 py-2 rounded-lg ${aiMsg.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{aiMsg}</p>}
              </div>
              <div className="md:col-span-2">
                <label className={lc}>Kratki opis * (max 200 znakova)</label>
                <textarea value={form.short_description} required rows={2} maxLength={200} className={ic} placeholder="AI će popuniti..."
                  onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} />
                <p className="text-xs text-gray-400 mt-1">{form.short_description.length}/200</p>
              </div>
              <div className="md:col-span-2">
                <label className={lc}>Pun opis</label>
                <textarea value={form.description} rows={4} className={ic} placeholder="AI će popuniti..."
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className={lc}>Sezona</label>
                <input value={form.best_season} className={ic} placeholder="April — Oktobar"
                  onChange={e => setForm(f => ({ ...f, best_season: e.target.value }))} />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input type="checkbox" id="permit" checked={form.permit_required} className="w-4 h-4 accent-green-600"
                  onChange={e => setForm(f => ({ ...f, permit_required: e.target.checked }))} />
                <label htmlFor="permit" className="text-sm font-medium text-gray-700 cursor-pointer">Dozvola je obavezna</label>
              </div>
              {form.permit_required && (
                <div className="md:col-span-2">
                  <label className={lc}>Info o dozvoli</label>
                  <input value={form.permit_info} className={ic} placeholder="Gde se nabavlja..."
                    onChange={e => setForm(f => ({ ...f, permit_info: e.target.value }))} />
                </div>
              )}
              <div className="md:col-span-2">
                <label className={lc}>Pristup</label>
                <input value={form.access_notes} className={ic} placeholder="Kako se dolazi do lokacije..."
                  onChange={e => setForm(f => ({ ...f, access_notes: e.target.value }))} />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input type="checkbox" id="pub" checked={form.is_published} className="w-4 h-4 accent-green-600"
                  onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} />
                <label htmlFor="pub" className="text-sm font-medium text-gray-700 cursor-pointer">Odmah objavi</label>
              </div>
            </div>
            {msg && <div className={`mt-4 p-3 rounded-xl text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{msg}</div>}
            <div className="flex gap-3 mt-6">
              <button type="submit" disabled={saving}
                className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50">
                {saving ? '⏳ Čuvam...' : '💾 Sačuvaj Lokaciju'}
              </button>
              <button type="button" onClick={() => { setForm({ ...EMPTY }); setMsg(''); setAiMsg('') }}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200">
                Resetuj
              </button>
            </div>
          </form>
        )}

        {tab === 'edit' && editLoc && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">✏️ Uredi: {editLoc.name}</h2>
              <a href={`/${editLoc.countries?.slug}/${editLoc.categories?.slug}/${editLoc.slug}`}
                target="_blank" className="text-sm text-green-600 hover:text-green-800">Vidi stranicu →</a>
            </div>

            {editAiMsg && <p className={`mb-4 p-3 rounded-xl text-sm ${editAiMsg.startsWith('✅') ? 'bg-green-50 text-green-800' : editAiMsg.startsWith('⏳') ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800'}`}>{editAiMsg}</p>}
            {editMsg && <p className={`mb-4 p-3 rounded-xl text-sm ${editMsg.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{editMsg}</p>}

            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Naziv</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={editLoc.name ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Kratki opis</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={editLoc.short_description ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, short_description: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Opis</label>
                <textarea rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={editLoc.description ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Sezona</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                    value={editLoc.best_season ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, best_season: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Dozvola info</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                    value={editLoc.permit_info ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, permit_info: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">SEO Title</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={editLoc.meta_title ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, meta_title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">SEO Description</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={editLoc.meta_description ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, meta_description: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="edit_pub" className="w-4 h-4 accent-green-600"
                  checked={editLoc.is_published ?? false}
                  onChange={e => setEditLoc((p: any) => ({ ...p, is_published: e.target.checked }))} />
                <label htmlFor="edit_pub" className="text-sm font-medium text-gray-700">Objavljeno</label>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button onClick={async () => {
                setEditAiLoading(true)
                setEditAiMsg('⏳ AI generise podatke...')
                try {
                  const res = await fetch('/api/ai-generate', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: editLoc.name,
                      category: editLoc.categories?.slug ?? '',
                      country: editLoc.countries?.name ?? 'Srbija',
                      region: editLoc.regions?.name ?? '',
                    })
                  })
                  const json = await res.json()
                  if (!res.ok || json.error) throw new Error(json.error ?? 'Greska')
                  const d = json.data
                  setEditLoc((p: any) => ({
                    ...p,
                    short_description: d.short_description ?? p.short_description,
                    description: d.description ?? p.description,
                    meta_title: d.meta_title ?? p.meta_title,
                    meta_description: d.meta_description ?? p.meta_description,
                    best_season: d.best_season ?? p.best_season,
                    permit_required: d.permit_required ?? p.permit_required,
                    permit_info: d.permit_info ?? p.permit_info,
                    category_data: d.category_data ?? p.category_data,
                  }))
                  setEditAiMsg('✅ AI popunio polja! Provjeri i sacuvaj.')
                } catch (err: any) {
                  setEditAiMsg('❌ ' + err.message)
                } finally {
                  setEditAiLoading(false)
                }
              }} disabled={editAiLoading}
                className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-50">
                {editAiLoading ? '⏳ Generisem...' : '✨ AI Regenerisi'}
              </button>

              <button onClick={async () => {
                setEditMsg('')
                const { error } = await supabase.from('locations').update({
                  name: editLoc.name,
                  short_description: editLoc.short_description,
                  description: editLoc.description,
                  best_season: editLoc.best_season,
                  permit_info: editLoc.permit_info,
                  permit_required: editLoc.permit_required,
                  meta_title: editLoc.meta_title,
                  meta_description: editLoc.meta_description,
                  is_published: editLoc.is_published,
                  category_data: editLoc.category_data ?? {},
                }).eq('id', editLoc.id)
                if (error) setEditMsg('❌ ' + error.message)
                else { setEditMsg('✅ Sacuvano!'); router.refresh() }
              }} className="bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800">
                💾 Sacuvaj izmene
              </button>

              <button onClick={() => { setEditLoc(null); setTab('locations') }}
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200">
                ← Nazad
              </button>
            </div>
          </div>
        )}

        {tab === 'edit' && editLoc && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">✏️ Uredi: {editLoc.name}</h2>
              <a href={`/${editLoc.countries?.slug}/${editLoc.categories?.slug}/${editLoc.slug}`}
                target="_blank" className="text-sm text-green-600 hover:text-green-800">Vidi stranicu →</a>
            </div>

            {editAiMsg && <p className={`mb-4 p-3 rounded-xl text-sm ${editAiMsg.startsWith('✅') ? 'bg-green-50 text-green-800' : editAiMsg.startsWith('⏳') ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800'}`}>{editAiMsg}</p>}
            {editMsg && <p className={`mb-4 p-3 rounded-xl text-sm ${editMsg.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{editMsg}</p>}

            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Naziv</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={editLoc.name ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Kratki opis</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={editLoc.short_description ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, short_description: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Opis</label>
                <textarea rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={editLoc.description ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Sezona</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                    value={editLoc.best_season ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, best_season: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Dozvola info</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                    value={editLoc.permit_info ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, permit_info: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">SEO Title</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={editLoc.meta_title ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, meta_title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">SEO Description</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={editLoc.meta_description ?? ''} onChange={e => setEditLoc((p: any) => ({ ...p, meta_description: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="edit_pub" className="w-4 h-4 accent-green-600"
                  checked={editLoc.is_published ?? false}
                  onChange={e => setEditLoc((p: any) => ({ ...p, is_published: e.target.checked }))} />
                <label htmlFor="edit_pub" className="text-sm font-medium text-gray-700">Objavljeno</label>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button onClick={async () => {
                setEditAiLoading(true)
                setEditAiMsg('⏳ AI generise podatke...')
                try {
                  const res = await fetch('/api/ai-generate', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: editLoc.name,
                      category: editLoc.categories?.slug ?? '',
                      country: editLoc.countries?.name ?? 'Srbija',
                      region: editLoc.regions?.name ?? '',
                    })
                  })
                  const json = await res.json()
                  if (!res.ok || json.error) throw new Error(json.error ?? 'Greska')
                  const d = json.data
                  setEditLoc((p: any) => ({
                    ...p,
                    short_description: d.short_description ?? p.short_description,
                    description: d.description ?? p.description,
                    meta_title: d.meta_title ?? p.meta_title,
                    meta_description: d.meta_description ?? p.meta_description,
                    best_season: d.best_season ?? p.best_season,
                    permit_required: d.permit_required ?? p.permit_required,
                    permit_info: d.permit_info ?? p.permit_info,
                    category_data: d.category_data ?? p.category_data,
                  }))
                  setEditAiMsg('✅ AI popunio polja! Provjeri i sacuvaj.')
                } catch (err: any) {
                  setEditAiMsg('❌ ' + err.message)
                } finally {
                  setEditAiLoading(false)
                }
              }} disabled={editAiLoading}
                className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-50">
                {editAiLoading ? '⏳ Generisem...' : '✨ AI Regenerisi'}
              </button>

              <button onClick={async () => {
                setEditMsg('')
                const { error } = await supabase.from('locations').update({
                  name: editLoc.name,
                  short_description: editLoc.short_description,
                  description: editLoc.description,
                  best_season: editLoc.best_season,
                  permit_info: editLoc.permit_info,
                  permit_required: editLoc.permit_required,
                  meta_title: editLoc.meta_title,
                  meta_description: editLoc.meta_description,
                  is_published: editLoc.is_published,
                  category_data: editLoc.category_data ?? {},
                }).eq('id', editLoc.id)
                if (error) setEditMsg('❌ ' + error.message)
                else { setEditMsg('✅ Sacuvano!'); router.refresh() }
              }} className="bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800">
                💾 Sacuvaj izmene
              </button>

              <button onClick={() => { setEditLoc(null); setTab('locations') }}
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200">
                ← Nazad
              </button>
            </div>
          </div>
        )}

        {tab === 'csv' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📥 CSV Import</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <p className="text-sm font-semibold text-amber-800 mb-2">Kako funkcioniše:</p>
                <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                  <li>Preuzmi CSV template ispod</li>
                  <li>Otvori u Excelu ili Google Sheets</li>
                  <li>Popuni lokacije (GPS sa Google Maps)</li>
                  <li>Sačuvaj kao CSV sa ; separatorom</li>
                  <li>Uploaduj i klikni Import</li>
                </ol>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={downloadTemplate}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700">
                  ⬇️ Preuzmi Template
                </button>
                <label className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer hover:bg-green-800">
                  📂 Učitaj CSV
                  <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleCSVFile} className="hidden" />
                </label>
              </div>
              {csvMsg && <p className={`mt-4 p-3 rounded-xl text-sm ${csvMsg.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{csvMsg}</p>}
              {csvErrors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <ul className="text-xs text-red-600 space-y-1">{csvErrors.map((e, i) => <li key={i}>• {e}</li>)}</ul>
                </div>
              )}
            </div>
            {csvRows.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Preview — {csvRows.length} lokacija</h3>
                  <button onClick={handleCSVImport} disabled={csvImporting}
                    className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-800 disabled:opacity-50">
                    {csvImporting ? '⏳ Importujem...' : `🚀 Importuj ${csvRows.length} lokacija`}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>{Object.keys(csvRows[0]).map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-gray-600">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {csvRows.slice(0, 10).map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          {Object.values(row).map((val, j) => <td key={j} className="px-3 py-2 text-gray-700 max-w-xs truncate">{val as string}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvRows.length > 10 && <p className="text-xs text-gray-400 text-center py-3">+{csvRows.length - 10} više redova</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'proposals' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">🔔 Predlozi lokacija</h2>
              <button onClick={loadProposals}
                style={{ border:'1px solid #e5e7eb', background:'#fff', borderRadius:'8px',
                  padding:'6px 14px', fontSize:'0.82rem', cursor:'pointer', fontWeight:600 }}>
                ↻ Osvježi
              </button>
            </div>
            {proposalMsg && (
              <div style={{ background: proposalMsg.startsWith('✅') ? '#d1fae5' : proposalMsg.startsWith('❌') ? '#fee2e2' : '#fef3c7',
                borderRadius:'10px', padding:'10px 16px', marginBottom:'16px', fontWeight:600, fontSize:'0.88rem',
                color: proposalMsg.startsWith('✅') ? '#065f46' : proposalMsg.startsWith('❌') ? '#991b1b' : '#92400e' }}>
                {proposalMsg}
              </div>
            )}
            {proposalsLoading ? (
              <div style={{ textAlign:'center', padding:'60px', color:'#9ca3af' }}>⏳ Učitavam...</div>
            ) : proposals.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px', color:'#9ca3af' }}>
                <div style={{ fontSize:'3rem', marginBottom:'12px' }}>📭</div>
                <p style={{ fontWeight:600, fontSize:'1rem' }}>Nema predloga</p>
                <p style={{ fontSize:'0.85rem', marginTop:'4px' }}>Novi predlozi će se pojaviti ovdje automatski</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {proposals.map((prop: any) => (
                  <ProposalCard key={prop.id} prop={prop}
                    categories={categories} countries={countries} regions={regions}
                    onApprove={approveProposal} onReject={rejectProposal} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
