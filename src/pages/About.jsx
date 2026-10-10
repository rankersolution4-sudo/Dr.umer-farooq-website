import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { doctor, specialInterests } from '../data/siteData.js'

export default function About() {
  return (
    <>
      <Seo title="About" description={`About ${doctor.name}, ${doctor.title}.`} />
      <PageHeader title="Doctor Profile" subtitle={`${doctor.name} – ${doctor.title}`} />
      <section className="section">
        <div className="container two-col">
          <div className="photo-box">
            {doctor.photo ? <img src={doctor.photo} alt={doctor.name} /> : <div className="photo-placeholder">🩺<small>Photo coming soon</small></div>}
          </div>
          <div>
            <h2>{doctor.name}</h2>
            <p className="muted">{doctor.title}</p>
            {doctor.about ? <p>{doctor.about}</p> : <p className="muted">A detailed introduction will be added soon.</p>}
            <h3>Qualifications</h3>
            {doctor.qualifications.length
              ? <ul>{doctor.qualifications.map((q) => <li key={q}>{q}</li>)}</ul>
              : <p className="muted">Qualifications will be added soon.</p>}
            <h3>Special Interests</h3>
            <ul>{specialInterests.map((s) => <li key={s.id}>{s.title}</li>)}</ul>
          </div>
        </div>
      </section>
    </>
  )
}