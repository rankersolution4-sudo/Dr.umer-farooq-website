import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { locations, diagnosticsFacility } from '../data/siteData.js'

export default function Locations() {
  return (
    <>
      <Seo title="Clinic Locations & Timings" description="Clinic locations and timings in Sialkot, Sheikhupura and Hafizabad." />
      <PageHeader title="Clinic Locations & Timings" />
      <section className="section">
        <div className="container grid grid-2">
          {locations.map((l) => (
            <div className="card" key={l.id}>
              <h3>{l.name}</h3>
              <p className="muted">{l.address ? `📍 ${l.address}` : '📍 Address coming soon'}</p>
              <table className="table">
                <tbody>
                  {l.schedule.map((s, i) => (
                    <tr key={i}><td><strong>{s.days}</strong><br /><small>{s.service}</small></td><td>{s.time}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <div className="card">
            <h3>{diagnosticsFacility.name}</h3>
            <p className="muted">{diagnosticsFacility.address ? `📍 ${diagnosticsFacility.address}` : '📍 Location coming soon'}</p>
            <table className="table">
              <tbody>
                {diagnosticsFacility.schedule.map((s, i) => (
                  <tr key={i}><td><strong>{s.days}</strong></td><td>{s.time}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="center mt"><Link to="/appointment" className="btn btn-primary">Book Appointment</Link></div>
      </section>
    </>
  )
}