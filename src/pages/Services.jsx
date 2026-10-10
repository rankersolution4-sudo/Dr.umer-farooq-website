import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { services } from '../data/siteData.js'

export default function Services() {
  return (
    <>
      <Seo title="Services" description="Neurology consultation, priority appointment, video consultation, NCS, EMG and EEG." />
      <PageHeader title="Our Services" subtitle="Complete neurology care" />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {services.map((s) => (
              <div className="card" key={s.title}><h3>{s.title}</h3><p>{s.text}</p></div>
            ))}
          </div>
          <div className="center mt"><Link to="/appointment" className="btn btn-primary">Book Appointment</Link></div>
        </div>
      </section>
    </>
  )
}