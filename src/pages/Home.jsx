import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import {
  doctor, specialInterests, locations, videoConsultation, conditionGroups, money,
} from '../data/siteData.js'

export default function Home() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    medicalSpecialty: 'Neurology',
  }
  const topConditions = conditionGroups.flatMap((g) => g.items).slice(0, 6)

  return (
    <>
      <Seo
        description="Dr. Muhammad Umer Farooq, Neurologist. Treatment for headache, stroke, epilepsy and Parkinson's disease. Online appointment and video consultation."
        schema={schema}
      />

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="pill">Consultant Neurologist</span>
            <h1>{doctor.name}</h1>
            <p>{doctor.tagline}</p>
            <div className="hero-actions">
              <Link to="/appointment" className="btn btn-primary">Book Appointment</Link>
              <Link to="/video-consultation" className="btn btn-light">Video Consultation</Link>
            </div>
          </div>
          <div className="hero-photo">
            {doctor.photo ? <img src={doctor.photo} alt={doctor.name} /> : <div className="photo-placeholder">🩺<small>Doctor photo coming soon</small></div>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Special Interests</h2>
          <div className="grid grid-4">
            {specialInterests.map((s) => (
              <div className="card center" key={s.id}>
                <div className="icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="section-title">Clinic Locations</h2>
          <div className="grid grid-3">
            {locations.map((l) => (
              <div className="card" key={l.id}>
                <h3>{l.name}</h3>
                {l.address && <p className="muted">📍 {l.address}</p>}
                {l.schedule.map((s, i) => (
                  <p key={i} className="slot"><strong>{s.days}</strong><br />{s.time}<br /><small>{s.service}</small></p>
                ))}
                <p className="fee">Priority / Online Booking: <strong>{money(l.priorityFee)}</strong></p>
              </div>
            ))}
          </div>
          <div className="center mt"><Link to="/locations" className="btn btn-outline">View Full Details</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="container banner">
          <div>
            <h2>Online Video Consultation</h2>
            <p>Time: {videoConsultation.time} | Fee: {money(videoConsultation.fee)}</p>
          </div>
          <Link to="/video-consultation" className="btn btn-light">Details</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Common Neurological Conditions</h2>
          <div className="grid grid-3">
            {topConditions.map((c) => (
              <div className="card" key={c.name}><h3>{c.name}</h3><p>{c.text}</p></div>
            ))}
          </div>
          <div className="center mt"><Link to="/conditions" className="btn btn-outline">View All Conditions</Link></div>
        </div>
      </section>
    </>
  )
}