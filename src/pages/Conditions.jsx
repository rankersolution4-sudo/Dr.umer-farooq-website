import { useState } from 'react'
import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { conditionGroups } from '../data/siteData.js'

export default function Conditions() {
  const [q, setQ] = useState('')
  const term = q.trim().toLowerCase()

  const groups = conditionGroups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.name.toLowerCase().includes(term) || i.text.toLowerCase().includes(term)) }))
    .filter((g) => g.items.length)

  return (
    <>
      <Seo title="Neurological Conditions" description="Information about headache, stroke, epilepsy, Parkinson's and other neurological conditions." />
      <PageHeader title="Neurological Conditions" subtitle="Conditions diagnosed and treated" />
      <section className="section">
        <div className="container">
          <input className="input search" placeholder="Search a condition..." value={q} onChange={(e) => setQ(e.target.value)} />
          {groups.length === 0 && <p className="muted center">No results found.</p>}
          {groups.map((g) => (
            <div key={g.group} className="mb">
              <h2 className="group-title">{g.group}</h2>
              <div className="grid grid-3">
                {g.items.map((i) => (
                  <div className="card" key={i.name}><h3>{i.name}</h3><p>{i.text}</p></div>
                ))}
              </div>
            </div>
          ))}
          <p className="muted small">This information is for general awareness only and is not a substitute for medical advice.</p>
        </div>
      </section>
    </>
  )
}