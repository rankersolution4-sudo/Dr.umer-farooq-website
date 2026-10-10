import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { diagnosticsFacility, locations } from '../data/siteData.js'

const tests = [
  { name: 'NCS', full: 'Nerve Conduction Study', text: 'Measures the speed and strength of signals travelling through your nerves.' },
  { name: 'EMG', full: 'Electromyography', text: 'Tests muscles and the nerves that control them.' },
  { name: 'EEG', full: 'Electroencephalography', text: 'Records the electrical activity of the brain.' },
]

export default function Diagnostics() {
  const testLocations = locations.filter((l) => l.schedule.some((s) => /NCS|EMG|EEG/i.test(s.service)))
  return (
    <>
      <Seo title="NCS / EMG / EEG" description="NCS, EMG and EEG test facility and timings." />
      <PageHeader title="NCS / EMG / EEG" subtitle="Neurological diagnostic tests" />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {tests.map((t) => (
              <div className="card" key={t.name}><h3>{t.name}</h3><p className="muted">{t.full}</p><p>{t.text}</p></div>
            ))}
          </div>
          <div className="grid grid-2 mt">
            <div className="card">
              <h3>{diagnosticsFacility.name}</h3>
              <p className="muted">{diagnosticsFacility.address || 'Location coming soon'}</p>
              {diagnosticsFacility.schedule.map((s, i) => <p key={i}><strong>{s.days}</strong><br />{s.time}</p>)}
            </div>
            {testLocations.map((l) => (
              <div className="card" key={l.id}>
                <h3>{l.name}</h3>
                {l.schedule.filter((s) => /NCS|EMG|EEG/i.test(s.service)).map((s, i) => (
                  <p key={i}><strong>{s.service}</strong><br />{s.days}<br />{s.time}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="center mt"><Link to="/appointment" className="btn btn-primary">Book Appointment</Link></div>
        </div>
      </section>
    </>
  )
}