import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import * as site from '../data/siteData.js'
import '../admin.css'

const KEYS = ['doctor', 'contact', 'specialInterests', 'locations', 'diagnosticsFacility', 'videoConsultation', 'services', 'conditionGroups', 'faqs', 'videos', 'gallery', 'posts']
const clone = (o) => JSON.parse(JSON.stringify(o))
const snapshot = () => Object.fromEntries(KEYS.map((k) => [k, clone(site[k])]))

let TOKEN = ''
async function api(path, method = 'GET', body) {
  const r = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (r.status === 401 && path !== '/api/login') window.dispatchEvent(new Event('adm-logout'))
  return r
}

function resize(file, max = 1600) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * s)
      c.height = Math.round(img.height * s)
      const ctx = c.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = reject
    img.src = url
  })
}

/* ---------- reusable fields ---------- */
function Text({ label, value, onChange, type = 'text', area, hint }) {
  const props = { className: 'input', value: value ?? '', onChange: (e) => onChange(e.target.value) }
  return (
    <label className="ad-field">
      <span>{label}</span>
      {area ? <textarea rows="4" {...props} /> : <input type={type} {...props} />}
      {hint && <small>{hint}</small>}
    </label>
  )
}

function Num({ label, value, onChange, hint, empty = null }) {
  return (
    <Text label={label} type="number" hint={hint} value={value ?? ''} onChange={(v) => onChange(v === '' ? empty : Number(v))} />
  )
}

function Img({ label, value, onChange }) {
  const [busy, setBusy] = useState(false)
  const pick = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBusy(true)
    try {
      const data = await resize(file)
      const r = await api('/api/upload', 'POST', { data })
      if (!r.ok) throw new Error('fail')
      const j = await r.json()
      onChange(j.url)
    } catch {
      alert('Image upload failed. Make sure the server is running.')
    }
    setBusy(false)
    e.target.value = ''
  }
  return (
    <div className="ad-img">
      {value ? <img src={value} alt="" /> : <div className="ad-noimg">No image</div>}
      <div className="ad-img-ctrl">
        <span>{label}</span>
        <input type="file" accept="image/*" onChange={pick} disabled={busy} />
        {busy && <small>Uploading...</small>}
        {value && <button type="button" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '.85rem' }} onClick={() => onChange('')}>Remove image</button>}
      </div>
    </div>
  )
}

function List({ items, onChange, make, render, addLabel }) {
  const upd = (i, item) => onChange(items.map((x, j) => (j === i ? item : x)))
  const del = (i) => { if (window.confirm('Delete this item?')) onChange(items.filter((_, j) => j !== i)) }
  const mv = (i, d) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const a = [...items]
    ;[a[i], a[j]] = [a[j], a[i]]
    onChange(a)
  }
  return (
    <div className="ad-list">
      {items.map((it, i) => (
        <div className="ad-item" key={i}>
          <div className="ad-item-tools">
            <button type="button" onClick={() => mv(i, -1)}>↑</button>
            <button type="button" onClick={() => mv(i, 1)}>↓</button>
            <button type="button" className="del" onClick={() => del(i)}>Delete</button>
          </div>
          {render(it, (patch) => upd(i, { ...it, ...patch }), (whole) => upd(i, whole))}
        </div>
      ))}
      <div><button type="button" className="btn btn-outline" onClick={() => onChange([...items, make()])}>+ {addLabel}</button></div>
    </div>
  )
}

const ytId = (v) => {
  const m = /(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/.exec(v)
  return m ? m[1] : v.trim()
}

/* ---------- login ---------- */
function Login({ onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const r = await api('/api/login', 'POST', { password: pw })
      if (!r.ok) return setErr('Wrong password.')
      const j = await r.json()
      onLogin(j.token)
    } catch {
      setErr('Cannot reach the server. Run: npm run server')
    }
  }
  return (
    <div className="ad-login">
      <form onSubmit={submit}>
        <h1>Admin Login</h1>
        <input className="input" type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        <button className="btn btn-primary" type="submit">Login</button>
        {err && <p className="ad-err">{err}</p>}
      </form>
    </div>
  )
}

/* ---------- main panel ---------- */
const TABS = ['General', 'Contact', 'Locations', 'Tests & Video', 'Services', 'Special Interests', 'Conditions', 'FAQs', 'Videos', 'Gallery', 'Blog', 'Settings']

function Panel({ onLogout }) {
  const [data, setData] = useState(snapshot)
  const [tab, setTab] = useState('General')
  const [dirty, setDirty] = useState(false)
  const [msg, setMsg] = useState('')
  const [newPw, setNewPw] = useState('')

  const up = (k) => (v) => { setData((d) => ({ ...d, [k]: v })); setDirty(true); setMsg('') }

  const save = async () => {
    const out = clone(data)
    out.posts = out.posts.map((p) => ({ ...p, content: (p.content || []).filter((x) => x.trim()) }))
    try {
      const r = await api('/api/content', 'PUT', out)
      if (r.ok) { setDirty(false); setMsg('Saved successfully. Open the website (refresh) to see the changes.') }
      else setMsg('Save failed.')
    } catch { setMsg('Save failed. Is the server running?') }
  }

  const changePw = async () => {
    const r = await api('/api/password', 'POST', { password: newPw })
    if (r.ok) { setNewPw(''); setMsg('Password changed.') }
    else { const j = await r.json().catch(() => ({})); setMsg(j.error || 'Could not change password.') }
  }

  const d = data.doctor
  const setD = (patch) => up('doctor')({ ...d, ...patch })
  const c = data.contact
  const setC = (patch) => up('contact')({ ...c, ...patch })
  const df = data.diagnosticsFacility
  const setDf = (patch) => up('diagnosticsFacility')({ ...df, ...patch })
  const vc = data.videoConsultation
  const setVc = (patch) => up('videoConsultation')({ ...vc, ...patch })

  return (
    <>
      <div className="ad-top">
        <strong>Admin Panel</strong>
        <div className="ad-actions">
          {dirty && <span className="ad-dirty">Unsaved changes</span>}
          <a href="/" target="_blank" rel="noreferrer">View website</a>
          <button className="btn btn-primary" onClick={save} disabled={!dirty}>Save All Changes</button>
          <button className="btn btn-light" onClick={onLogout}>Logout</button>
        </div>
      </div>
      {msg && <div className="ad-msg">{msg}</div>}

      <div className="ad-wrap">
        <nav className="ad-tabs">
          {TABS.map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}
        </nav>

        <div className="ad-panel">
          {tab === 'General' && (
            <>
              <h2>Doctor Profile</h2>
              <Img label="Doctor photo" value={d.photo} onChange={(v) => setD({ photo: v })} />
              <Text label="Name" value={d.name} onChange={(v) => setD({ name: v })} />
              <Text label="Title" value={d.title} onChange={(v) => setD({ title: v })} />
              <Text label="Tagline (shown on home page)" value={d.tagline} onChange={(v) => setD({ tagline: v })} />
              <Text label="About" area value={d.about} onChange={(v) => setD({ about: v })} />
              <h4>Qualifications</h4>
              <List items={d.qualifications} onChange={(v) => setD({ qualifications: v })} make={() => ''} addLabel="Add qualification"
                render={(q, _p, set) => <Text label="Qualification" value={q} onChange={set} />} />
            </>
          )}

          {tab === 'Contact' && (
            <>
              <h2>Contact Information</h2>
              <Text label="Phone" value={c.phone} onChange={(v) => setC({ phone: v })} />
              <Text label="WhatsApp number" value={c.whatsapp} onChange={(v) => setC({ whatsapp: v.replace(/\D/g, '') })} hint="With country code, digits only. Example: 923001234567. Adding it activates the WhatsApp button and booking form." />
              <Text label="Email" value={c.email} onChange={(v) => setC({ email: v })} />
              <Text label="Facebook link" value={c.social.facebook} onChange={(v) => setC({ social: { ...c.social, facebook: v } })} />
              <Text label="YouTube link" value={c.social.youtube} onChange={(v) => setC({ social: { ...c.social, youtube: v } })} />
              <Text label="Instagram link" value={c.social.instagram} onChange={(v) => setC({ social: { ...c.social, instagram: v } })} />
            </>
          )}

          {tab === 'Locations' && (
            <>
              <h2>Clinic Locations, Timings & Fees</h2>
              <p className="muted small">Keep at least one location. Add the word NCS / EMG / EEG in a timing's service name to show it on the tests page.</p>
              <List items={data.locations} onChange={up('locations')} addLabel="Add location"
                make={() => ({ id: 'loc-' + Date.now(), name: '', address: '', schedule: [], priorityFee: 0 })}
                render={(l, ch) => (
                  <>
                    <Text label="Location name" value={l.name} onChange={(v) => ch({ name: v })} />
                    <Text label="Address" value={l.address} onChange={(v) => ch({ address: v })} />
                    <Num label="Priority / Online booking fee (PKR)" value={l.priorityFee} empty={0} onChange={(v) => ch({ priorityFee: v })} />
                    <h4>Timings</h4>
                    <List items={l.schedule} onChange={(s) => ch({ schedule: s })} addLabel="Add timing"
                      make={() => ({ service: 'Neurology Consultation', days: '', time: '' })}
                      render={(s, c2) => (
                        <div className="ad-row">
                          <Text label="Service" value={s.service} onChange={(v) => c2({ service: v })} />
                          <Text label="Days" value={s.days} onChange={(v) => c2({ days: v })} />
                          <Text label="Time" value={s.time} onChange={(v) => c2({ time: v })} />
                        </div>
                      )} />
                  </>
                )} />
            </>
          )}

          {tab === 'Tests & Video' && (
            <>
              <h2>NCS / EMG / EEG Facility</h2>
              <Text label="Facility name" value={df.name} onChange={(v) => setDf({ name: v })} />
              <Text label="Address / Location" value={df.address} onChange={(v) => setDf({ address: v })} />
              <h4>Timings</h4>
              <List items={df.schedule} onChange={(s) => setDf({ schedule: s })} addLabel="Add timing"
                make={() => ({ days: '', time: '' })}
                render={(s, c2) => (
                  <div className="ad-row">
                    <Text label="Days" value={s.days} onChange={(v) => c2({ days: v })} />
                    <Text label="Time" value={s.time} onChange={(v) => c2({ time: v })} />
                  </div>
                )} />
              <h4>Fees (PKR) - leave empty to show "Coming soon"</h4>
              <div className="ad-row">
                {['NCS', 'EMG', 'EEG'].map((k) => (
                  <Num key={k} label={k} value={df.fees[k]} onChange={(v) => setDf({ fees: { ...df.fees, [k]: v } })} />
                ))}
              </div>
              <h2 style={{ marginTop: '2rem' }}>Online Video Consultation</h2>
              <Text label="Timing" value={vc.time} onChange={(v) => setVc({ time: v })} />
              <Num label="Fee (PKR)" value={vc.fee} empty={0} onChange={(v) => setVc({ fee: v })} />
            </>
          )}

          {tab === 'Services' && (
            <>
              <h2>Services</h2>
              <List items={data.services} onChange={up('services')} addLabel="Add service" make={() => ({ title: '', text: '' })}
                render={(s, ch) => (
                  <>
                    <Text label="Title" value={s.title} onChange={(v) => ch({ title: v })} />
                    <Text label="Description" area value={s.text} onChange={(v) => ch({ text: v })} />
                  </>
                )} />
            </>
          )}

          {tab === 'Special Interests' && (
            <>
              <h2>Special Interests</h2>
              <List items={data.specialInterests} onChange={up('specialInterests')} addLabel="Add special interest"
                make={() => ({ id: 'si-' + Date.now(), title: '', icon: '🧠', text: '' })}
                render={(s, ch) => (
                  <>
                    <div className="ad-row">
                      <Text label="Icon (emoji)" value={s.icon} onChange={(v) => ch({ icon: v })} />
                      <Text label="Title" value={s.title} onChange={(v) => ch({ title: v })} />
                    </div>
                    <Text label="Description" area value={s.text} onChange={(v) => ch({ text: v })} />
                  </>
                )} />
            </>
          )}

          {tab === 'Conditions' && (
            <>
              <h2>Neurological Conditions</h2>
              <List items={data.conditionGroups} onChange={up('conditionGroups')} addLabel="Add group" make={() => ({ group: '', items: [] })}
                render={(g, ch) => (
                  <>
                    <Text label="Group name" value={g.group} onChange={(v) => ch({ group: v })} />
                    <h4>Conditions in this group</h4>
                    <List items={g.items} onChange={(it) => ch({ items: it })} addLabel="Add condition" make={() => ({ name: '', text: '' })}
                      render={(i, c2) => (
                        <>
                          <Text label="Condition name" value={i.name} onChange={(v) => c2({ name: v })} />
                          <Text label="Description" area value={i.text} onChange={(v) => c2({ text: v })} />
                        </>
                      )} />
                  </>
                )} />
            </>
          )}

          {tab === 'FAQs' && (
            <>
              <h2>FAQs</h2>
              <List items={data.faqs} onChange={up('faqs')} addLabel="Add FAQ" make={() => ({ q: '', a: '' })}
                render={(f, ch) => (
                  <>
                    <Text label="Question" value={f.q} onChange={(v) => ch({ q: v })} />
                    <Text label="Answer" area value={f.a} onChange={(v) => ch({ a: v })} />
                  </>
                )} />
            </>
          )}

          {tab === 'Videos' && (
            <>
              <h2>YouTube Videos</h2>
              <List items={data.videos} onChange={up('videos')} addLabel="Add video" make={() => ({ title: '', youtubeId: '' })}
                render={(v, ch) => (
                  <>
                    <Text label="Title" value={v.title} onChange={(x) => ch({ title: x })} />
                    <Text label="YouTube link or video ID" value={v.youtubeId} onChange={(x) => ch({ youtubeId: ytId(x) })} hint="Paste the full YouTube link, the ID is extracted automatically." />
                  </>
                )} />
            </>
          )}

          {tab === 'Gallery' && (
            <>
              <h2>Gallery</h2>
              <List items={data.gallery} onChange={up('gallery')} addLabel="Add photo" make={() => ({ src: '', caption: '' })}
                render={(g, ch) => (
                  <>
                    <Img label="Photo" value={g.src} onChange={(v) => ch({ src: v })} />
                    <Text label="Caption" value={g.caption} onChange={(v) => ch({ caption: v })} />
                  </>
                )} />
            </>
          )}

          {tab === 'Blog' && (
            <>
              <h2>Blog / Health Articles</h2>
              <List items={data.posts} onChange={up('posts')} addLabel="Add article"
                make={() => ({ slug: 'article-' + Date.now(), title: '', date: new Date().toISOString().slice(0, 10), excerpt: '', content: [], image: '' })}
                render={(p, ch) => (
                  <>
                    <Img label="Cover image" value={p.image} onChange={(v) => ch({ image: v })} />
                    <Text label="Title" value={p.title} onChange={(v) => ch({ title: v })} />
                    <div className="ad-row">
                      <Text label="URL slug" value={p.slug} onChange={(v) => ch({ slug: v.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} hint="Lowercase letters, numbers and dashes only." />
                      <Text label="Date" type="date" value={p.date} onChange={(v) => ch({ date: v })} />
                    </div>
                    <Text label="Short summary" area value={p.excerpt} onChange={(v) => ch({ excerpt: v })} />
                    <Text label="Article text" area value={(p.content || []).join('\n\n')} onChange={(v) => ch({ content: v.split('\n\n') })} hint="Leave a blank line between paragraphs." />
                  </>
                )} />
            </>
          )}

          {tab === 'Settings' && (
            <>
              <h2>Settings</h2>
              <Text label="New admin password" type="password" value={newPw} onChange={setNewPw} hint="At least 8 characters. Default password is admin123, change it now." />
              <button className="btn btn-primary" onClick={changePw} disabled={newPw.length < 8}>Change Password</button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adm') || '')
  TOKEN = token
  useEffect(() => {
    const f = () => { sessionStorage.removeItem('adm'); setToken('') }
    window.addEventListener('adm-logout', f)
    return () => window.removeEventListener('adm-logout', f)
  }, [])
  return (
    <>
      <Helmet><title>Admin</title><meta name="robots" content="noindex" /></Helmet>
      {token
        ? <Panel onLogout={() => { sessionStorage.removeItem('adm'); setToken('') }} />
        : <Login onLogin={(t) => { sessionStorage.setItem('adm', t); setToken(t) }} />}
    </>
  )
}